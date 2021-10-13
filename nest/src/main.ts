import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {AppModule} from './app.module';
import { RolesGuard } from './auth/guards/roles.guard';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    // app.useGlobalGuards(new RolesGuard(new Reflector()));

    const config = new DocumentBuilder()
    .setTitle('Pickem API')
    .setDescription('The pickem API description')
    .setVersion('1.0')
    .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(3000);
}
bootstrap();
