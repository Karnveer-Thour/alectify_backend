import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

export function setupSwaggerConfig(
  docsUrl: string,
  app: INestApplication,
): OpenAPIObject {
  const options = new DocumentBuilder()
    .setTitle('Alectify Node Backend')
    .setDescription('API Documentation for Alectify Node Backend')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(docsUrl, app, document);
  return document;
}
