import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
export let NEST_APP: NestExpressApplication;

async function bootstrap() {
  const logger = new Logger('Pay-Site-api-bootstrap');

  NEST_APP = await NestFactory.create<NestExpressApplication>(AppModule);
  NEST_APP.setGlobalPrefix('api/v1');

  NEST_APP.useStaticAssets(join(__dirname, '..', 'public'), {
    index: false,
    prefix: '/public',
  });

  const config = new DocumentBuilder()
    .setTitle('Pay-Site')
    .setDescription('The Pay-Site API description')
    .setVersion('1.0')
    .addTag('pay-site')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(NEST_APP, config);
  SwaggerModule.setup('pay-site-api', NEST_APP, document);

  const configService = NEST_APP.get(ConfigService);
  const port = configService.get<number>('PORT');

  NEST_APP.enableCors();

  await NEST_APP.listen(port);

  logger.log(
    `Documentation is running in http://localhost:${port}/pay-site-api`,
  );
  logger.log(`Api is running in http://localhost:${port}`);
}
bootstrap();
