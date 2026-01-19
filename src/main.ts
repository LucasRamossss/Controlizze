import 'dotenv/config';
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    const port = Number(process.env.PORT) || 3000;
    const host = '0.0.0.0';

    await app.listen(port, host);

    console.log('Listening on http://' + host + ':' + port);
  } catch (err) {
    console.error('BOOTSTRAP_ERROR:', err);
    process.exit(1);
  }
}
bootstrap();
