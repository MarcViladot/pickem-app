import { NestFactory, Reflector } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import * as admin from "firebase-admin";
import { ServiceAccount } from "firebase-admin";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService: ConfigService = app.get(ConfigService);
  const adminConfig: ServiceAccount = {
    "projectId": configService.get<string>("FIREBASE_PROJECT_ID"),
    "clientEmail": configService.get<string>("FIREBASE_CLIENT_EMAIL"),
    "privateKey": configService.get<string>("FIREBASE_PRIVATE_KEY").replace(/\\n/g, '\n')
  };
  // process.env['FIRESTORE_EMULATOR_HOST'] = 'localhost:4000';
  admin.initializeApp({
    credential: admin.credential.cert(adminConfig),
  });

  app.enableCors();
  // app.useGlobalGuards(new RolesGuard(new Reflector()));
  const config = new DocumentBuilder()
    .setTitle("Pickem API")
    .setDescription("The pickem API description")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  await app.listen(3000);
}

bootstrap();
