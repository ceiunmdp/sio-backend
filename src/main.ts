import { ValidationPipe, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import * as rateLimit from 'express-rate-limit';
import * as slowDown from 'express-slow-down';
import * as helmet from 'helmet';
import { AppModule } from './app.module';

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
    logger: ['log', 'error', 'warn']
  });
  // See https://expressjs.com/en/guide/behind-proxies.html
  // Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  app.set('trust proxy', 1);

  // Global prefix
  app.setGlobalPrefix('/api/v1');
  // Apply the compression middleware as global middleware
  app.use(compression());
  // Apply helmet as a global middleware
  app.use(helmet());
  // Enable CORS
  app.enableCors();
  // Apply the csurf middleware as global middleware
  // app.use(csurf());
  // Apply the rate-limiter as global middleware
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  });
  app.use('/api', apiLimiter);
  // Apply slow-down as global middleware
  const speedLimiter = slowDown({
    windowMs: 15 * 60 * 1000, // 15 minutes
    delayAfter: 100, // allow 100 requests per 15 minutes, then...
    delayMs: 500, // begin adding 500ms of delay per request above 100:
    // request # 101 is delayed by  500ms
    // request # 102 is delayed by 1000ms
    // request # 103 is delayed by 1500ms
    // etc.
    maxDelayMs: 20000 // load balancer or reverse proxy that has a request timeout
  });
  app.use('/api', speedLimiter);

  // Enable global-scoped AllExceptionsFilter
  // Another alternative to bind AllExceptionsFilter to all endpoints, but can't inject dependencies
  // app.useGlobalFilters(new AllExceptionsFilter());

  // Enable ValidationPipe globally
  app.useGlobalPipes(
    new ValidationPipe({
      // disableErrorMessages: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      forbidUnknownValues: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  );

  // Set up global interceptor to serialize responses
  // app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Enable Swagger UI
  const options = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('Description of endpoints exposed by NestJS server')
    .setVersion('1.0.0')
    // .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  const configService = app.get(ConfigService);
  await app.listen(configService.get('PORT'));
  console.log(`Application is running on: ${await app.getUrl()}`);

  // Enable Hot-Module Replacement
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
