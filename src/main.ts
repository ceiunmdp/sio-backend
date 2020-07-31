import { HttpStatus, ValidationPipe } from '@nestjs/common';
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
import { AppConfigService } from './config/app/app-config.service';
import { FacultyEntitiesModule } from './faculty-entities/faculty-entities.module';

async function bootstrap() {
  // HTTPS
  // const httpsOptions = {
  //     key: fs.readFileSync('./secrets/private-key.pem'),
  //     cert: fs.readFileSync('./secrets/public-certificate.pem'),
  // };

  // const app = await NestFactory.create(AppModule, {
  //     httpsOptions,
  // });

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['debug', 'log', 'warn', 'error'],
  });
  // See https://expressjs.com/en/guide/behind-proxies.html
  // Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  app.set('trust proxy', 1);

  // Global prefix
  app.setGlobalPrefix(Paths.API);
  // Apply the compression middleware as global middleware
  app.use(compression());
  // Apply helmet as global middleware
  app.use(helmet());
  // Enable CORS
  app.enableCors();
  // Apply the csurf middleware as global middleware
  // app.use(csurf());
  // Apply the rate-limiter as global middleware
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  });
  app.use(Paths.API, apiLimiter);
  // Apply slow-down as global middleware
  const speedLimiter = slowDown({
    windowMs: 15 * 60 * 1000, // 15 minutes
    delayAfter: 100, // allow 100 requests per 15 minutes, then...
    delayMs: 500, // begin adding 500ms of delay per request above 100:
    // request # 101 is delayed by  500ms
    // request # 102 is delayed by 1000ms
    // request # 103 is delayed by 1500ms
    // etc.
    maxDelayMs: 20000, // load balancer or reverse proxy that has a request timeout
  });
  app.use(Paths.API, speedLimiter);

  // Enable global-scoped AllExceptionsFilter
  // Another alternative to bind AllExceptionsFilter to all endpoints, but can't inject dependencies
  // app.useGlobalFilters(new AllExceptionsFilter());

  // Enable ValidationPipe globally
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

  // Setup global interceptor to serialize responses
  // app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Enable Swagger UI
  const options = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('List of endpoints exposed by NestJS server')
    .setContact('ICEI Support', 'https://support.icei.com.ar', 'support@icei.com.ar')
    .setVersion('1.0.0')
    // .setLicense('MIT', 'url')
    // .setTermsOfService('Terms of Service')
    .addServer('http://localhost:3000')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options, { include: [FacultyEntitiesModule] });
  SwaggerModule.setup('api', app, document);

  // Firebase Admin SDK
  // console.log(admin.apps.length);
  if (!admin.apps.length) {
    // console.log('Initialize App');
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      // databaseURL: 'https://<DATABASE_NAME>.firebaseio.com',
    });
  }

  const appConfigService = app.get(AppConfigService);
  await app.listen(appConfigService.port);
  console.log(`Application is running on: ${await app.getUrl()}`);

  // Enable Hot-Module Replacement
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
