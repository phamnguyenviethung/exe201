import { defineConfig } from '@mikro-orm/postgresql';

export default defineConfig({
  dbName: 'appDb',
  user: 'test',
  password: '123',
  host: 'localhost',
  port: 5432,
  entities: ['./dist/**/*.entity.js'],
  entitiesTs: ['./src/**/*.entity.ts'],
});
