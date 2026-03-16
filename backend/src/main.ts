import "dotenv/config";
import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe, VersioningType, ClassSerializerInterceptor } from "@nestjs/common";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { PrismaExceptionFilter } from "./common/filters/prisma-exception.filter";
import helmet from 'helmet';
import rateLimit from "express-rate-limit";
import { TransformInterceptor } from "./common/interceptors/transform.interceptor";
import { winstonLogger } from "./common/logger/winston.logger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: winstonLogger,
  });
  
  app.use(helmet());
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  app.use(
      rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
        message: 'Too many requests from this IP, please try again later.',
      }),
  );
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  
  app.useGlobalFilters(
    new HttpExceptionFilter(),
    new PrismaExceptionFilter()
  );
  
  app.setGlobalPrefix("api");
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  
  // Use TransformInterceptor and ClassSerializerInterceptor
  app.useGlobalInterceptors(
    new TransformInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector))
  );
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
