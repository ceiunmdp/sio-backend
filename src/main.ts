import { HttpStatus, LoggerService, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import * as rateLimit from 'express-rate-limit';
import * as slowDown from 'express-slow-down';
import * as admin from 'firebase-admin';
import * as helmet from 'helmet';
import { AppModule } from './app.module';
import { Paths } from './common/enums/paths';
import { buildError } from './common/filters/http-exception.filter';
import { ApiConfigService } from './config/api/api-config.service';
import { AppConfigService } from './config/app/app-config.service';
import { CustomLoggerService } from './logger/custom-logger.service';

async function bootstrap() {
  // const httpsOptions = buildHttpsOptions();
  const app = await createNestExpressApplication();

  const logger = await createLogger(app);
  setupLogger(app, logger);

  setupGlobalPrefix(app);

  setupCompression(app);

  setupHelmet(app);
  setupCORS(app);
  // setupCSRF(app);
  setupRateLimiting(app);
  setupSlowDown(app);

  // enableAllExceptionsFilterGlobally(app);
  enableValidationPipeGlobally(app);
  // enableClassSerializerInterceptorGlobally(app);

  enableSwaggerUI(app);
  setupFirebaseAdminSDK(logger);

  startApplication(app, logger);

  enableHotReload(app);
}
bootstrap();

// function buildHttpsOptions() {
//   return {
//     key: fs.readFileSync('./secrets/private-key.pem'),
//     cert: fs.readFileSync('./secrets/public-certificate.pem'),
//   };
// }

async function createNestExpressApplication() {
  return NestFactory.create<NestExpressApplication>(AppModule, {
    // httpsOptions,
  });
}

async function createLogger(app: NestExpressApplication) {
  const logger = await app.resolve(CustomLoggerService);
  logger.context = 'NestApplication';
  return logger;
}

function setupLogger(app: NestExpressApplication, logger: LoggerService) {
  app.useLogger(logger);
}

function setupGlobalPrefix(app: NestExpressApplication) {
  // Global prefix
  app.setGlobalPrefix(Paths.API);
}

function setupCompression(app: NestExpressApplication) {
  // Apply compression middleware as global middleware
  app.use(compression());
}

function setupHelmet(app: NestExpressApplication) {
  // Apply helmet as global middleware
  app.use(helmet());
}

function setupCORS(app: NestExpressApplication) {
  app.enableCors({
    origin: app.get(AppConfigService).origin,
  });
}

// function setupCSRF(app: NestExpressApplication) {
//   // Apply the csurf middleware as global middleware
//   app.use(csurf());
// }

function setupRateLimiting(app: NestExpressApplication) {
  // Prerequisite
  enableTrustProxy(app);

  // Apply rate-limiter as global middleware
  const apiConfigService = app.get(ApiConfigService);
  const apiLimiter = rateLimit({
    windowMs: apiConfigService.rateTimeframe * 60 * 1000,
    max: apiConfigService.rateMaxConnections, // limit each IP to X requests per timeframe
    handler: (req, res) => {
      res.status(HttpStatus.TOO_MANY_REQUESTS).send(
        buildError(req, {
          status: HttpStatus.TOO_MANY_REQUESTS,
          error: 'Too Many Requests',
          message: `Demasiadas consultas realizadas a partir de esta IP, intente nuevamente después de ${apiConfigService.rateTimeframe} minutos`,
        }),
      );
    },
  });
  app.use(Paths.API, apiLimiter);
}

function enableTrustProxy(app: NestExpressApplication) {
  // See https://expressjs.com/en/guide/behind-proxies.html
  // Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  app.set('trust proxy', 1);
}

function setupSlowDown(app: NestExpressApplication) {
  // Apply slow-down as global middleware
  const apiConfigService = app.get(ApiConfigService);
  const speedLimiter = slowDown({
    windowMs: apiConfigService.speedTimeframe * 60 * 1000,
    delayAfter: apiConfigService.speedDelayAfter, // allow Y requests per X minutes, then...
    delayMs: apiConfigService.speedDelayMS, // begin adding Z ms of delay per request above Y:
    // request # Y + 1 is delayed by Z ms
    // request # Y + 2 is delayed by 2Z ms
    // request # Y + 3 is delayed by 3Z ms
    // etc.
    maxDelayMs: apiConfigService.speedMaxDelayMS, // load balancer or reverse proxy that has a request timeout
  });
  app.use(Paths.API, speedLimiter);
}

// function enableAllExceptionsFilterGlobally(app: NestExpressApplication) {
//   // Enable global-scoped AllExceptionsFilter
//   // This is one alternative to bind AllExceptionsFilter to all endpoints, but can't inject dependencies
//   // app.useGlobalFilters(new AllExceptionsFilter());
// }

function enableValidationPipeGlobally(app: NestExpressApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      // skipMissingProperties: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      // disableErrorMessages: true, // Useful in production
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      transform: true, // Automatically transform payloads to be objects typed according to their DTO classes
    }),
  );
}

// function enableClassSerializerInterceptorGlobally(app: NestExpressApplication) {
//   // Setup global interceptor to serialize responses
//   // app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
// }

function enableSwaggerUI(app: NestExpressApplication) {
  const options = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('List of endpoints exposed by NestJS server')
    .setContact('ICEI Support', 'https://support.icei.com.ar', 'support@icei.com.ar')
    .setVersion('1.0.0')
    // .setLicense('MIT', 'url')
    // .setTermsOfService('Terms of Service')
    .addServer(app.get(AppConfigService).origin)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
}

function setupFirebaseAdminSDK(logger: LoggerService) {
  // console.log(admin.apps.length);
  if (!admin.apps.length) {
    logger.log('Firebase Admin SDK initialized');
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      // databaseURL: 'https://<DATABASE_NAME>.firebaseio.com',
    });
  }
}

async function startApplication(app: NestExpressApplication, logger: LoggerService) {
  const appConfigService = app.get(AppConfigService);
  await app.listen(appConfigService.port);
  logger.log(`Application is running on: ${await app.getUrl()}`, 'NestApplication');
}

function enableHotReload(app: NestExpressApplication) {
  // Enable webpack Hot-Module Replacement
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
