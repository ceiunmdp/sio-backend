import { HttpStatus, LoggerService, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import * as compression from 'compression';
import * as rateLimit from 'express-rate-limit';
import * as slowDown from 'express-slow-down';
import * as admin from 'firebase-admin';
import * as helmet from 'helmet';
import { types } from 'pg';
import { AppModule } from './app.module';
import { SocketIoAdapter } from './common/classes/socket-io-adapter.class';
import { Path } from './common/enums/path.enum';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ApiConfigService } from './config/api/api-config.service';
import { AppConfigService } from './config/app/app-config.service';
import { CustomLoggerService } from './global/custom-logger.service';

// const buildHttpsOptions = () => {
//   return {
//     key: fs.readFileSync('./secrets/private-key.pem'),
//     cert: fs.readFileSync('./secrets/public-certificate.pem'),
//   };
// };

const createNestExpressApplication = async () => {
  return NestFactory.create<NestExpressApplication>(AppModule, {
    // httpsOptions,
  });
};

const createLogger = async (app: NestExpressApplication) => {
  const logger = await app.resolve(CustomLoggerService);
  logger.context = 'NestApplication';
  return logger;
};

const setupLogger = (app: NestExpressApplication, logger: LoggerService) => {
  app.useLogger(logger);
};

const setupGlobalPrefix = (app: NestExpressApplication) => {
  // Global prefix
  app.setGlobalPrefix(Path.API);
};

const setupCompression = (app: NestExpressApplication) => {
  // Apply compression middleware as global middleware
  app.use(compression());
};

const setupHelmet = (app: NestExpressApplication) => {
  // Apply helmet as global middleware
  app.use(helmet());
};

const setupCORS = (app: NestExpressApplication) => {
  const appConfigService = app.get(AppConfigService);

  app.enableCors({
    allowedHeaders: ['Authorization', 'Content-Type'],
    origin: appConfigService.isProduction() ? appConfigService.origin : true,
    credentials: true,
    maxAge: 86400,
  });
};

// const setupCSRF = (app: NestExpressApplication) => {
//   // Apply the csurf middleware as global middleware
//   app.use(csurf());
// };

const setupRateLimiting = (app: NestExpressApplication) => {
  const appConfigService = app.get(AppConfigService);

  if (appConfigService.isProduction()) {
    // Prerequisite
    enableTrustProxy(app);

    // Apply rate-limiter as global middleware
    const apiConfigService = app.get(ApiConfigService);
    const apiLimiter = rateLimit({
      windowMs: apiConfigService.rateTimeframe * 60 * 1000,
      max: apiConfigService.rateMaxConnections, // limit each IP to X requests per timeframe
      handler: (req, res) => {
        res.status(HttpStatus.TOO_MANY_REQUESTS).send(
          app.get(HttpExceptionFilter).buildHttpError(req, {
            status: HttpStatus.TOO_MANY_REQUESTS,
            name: 'Too Many Requests',
            message: `Demasiadas consultas realizadas a partir de esta IP, intente nuevamente después de ${apiConfigService.rateTimeframe} minutos`,
          }),
        );
      },
    });
    app.use(Path.API, apiLimiter);
  }
};

const enableTrustProxy = (app: NestExpressApplication) => {
  // See https://expressjs.com/en/guide/behind-proxies.html
  // Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  app.set('trust proxy', 1);
};

const setupSlowDown = (app: NestExpressApplication) => {
  const appConfigService = app.get(AppConfigService);

  if (appConfigService.isProduction()) {
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
    app.use(Path.API, speedLimiter);
  }
};

// const enableAllExceptionsFilterGlobally = (app: NestExpressApplication) => {
//   // Enable global-scoped AllExceptionsFilter
//   // This is one alternative to bind AllExceptionsFilter to all endpoints, but can't inject dependencies
//   app.useGlobalFilters(new AllExceptionsFilter());
// }

const enableValidationPipeGlobally = (app: NestExpressApplication) => {
  app.useGlobalPipes(
    new ValidationPipe({
      // skipMissingProperties: true,
      whitelist: true, // Strip all properties that don't have any decorators
      forbidNonWhitelisted: true, // In combination with the previous flag, it'll throw an error when there's any extra property
      forbidUnknownValues: true, // Prevent unknown objects from passing validation
      // disableErrorMessages: true, // Useful in production
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      transform: true, // Automatically transform payloads to be objects typed according to their DTO classes
      // TODO: Add 'stopAtFirstError' when it's available in NestJS common library
    }),
  );
};

// const enableSerializerInterceptorGlobally = (app: NestExpressApplication) => {
//  // Setup global interceptor to serialize responses
//  app.useGlobalInterceptors(new SerializerInterceptor());
// };

const setupSwaggerUI = (app: NestExpressApplication) => {
  const appConfigService = app.get(AppConfigService);

  if (!appConfigService.isProduction()) {
    const options = new DocumentBuilder()
      .setTitle('API Documentation')
      .setDescription('List of endpoints exposed by NestJS server')
      .setContact('ICEI Support', 'https://support.icei.com.ar', 'support@icei.com.ar')
      .setVersion('1.0.0')
      // .setLicense('MIT', 'url')
      // .setTermsOfService('Terms of Service')
      .addServer(appConfigService.origin)
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup(Path.DOCS, app, document);
  }
};

const setupWebSocketAdapter = (app: NestExpressApplication) => {
  app.useWebSocketAdapter(new SocketIoAdapter(app, true));
};

const setupFirebaseAdminSDK = (logger: LoggerService) => {
  if (!admin.apps.length) {
    logger.log('Firebase Admin SDK initialized');
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      // databaseURL: 'https://<DATABASE_NAME>.firebaseio.com',
    });
  }
};

const configureToParseFloatValuesFromPostgreSQL = () => {
  //* Converti all float values from PostgreSQL to numeric type
  types.setTypeParser(1700, (value) => parseFloat(value));
};

const startApplication = async (app: NestExpressApplication, logger: LoggerService) => {
  await app.listen(app.get(AppConfigService).port);
  logger.log(`Application is running on: ${await app.getUrl()}`, 'NestApplication');
};

const enableHotReload = (app: NestExpressApplication) => {
  // Enable webpack Hot-Module Replacement
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
};

(async () => {
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
  // enableSerializerInterceptorGlobally(app);

  // This will cause class-validator to use the NestJS module resolution
  // The fallback option is to spare our selfs from importing all the class-validator modules to NestJS
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  setupSwaggerUI(app);

  setupWebSocketAdapter(app);

  setupFirebaseAdminSDK(logger);

  configureToParseFloatValuesFromPostgreSQL();

  startApplication(app, logger);

  enableHotReload(app);
})();
