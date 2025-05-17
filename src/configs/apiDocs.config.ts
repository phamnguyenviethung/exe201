import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';
export async function configSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Nest Base Project')
    .setDescription('## Description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'jwt',
    )
    .addSecurityRequirements('jwt')
    .build();
  // await SwaggerModule.loadPluginMetadata(metadata);
  const document = SwaggerModule.createDocument(app, config);
  const theme = new SwaggerTheme();

  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
    customCss: theme.getBuffer(SwaggerThemeNameEnum.DARK),
  });
}
