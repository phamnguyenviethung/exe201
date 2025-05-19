import { defineConfig } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';
export default defineConfig({
  dbName: 'appDb',
  user: 'test',
  password: '123',
  host: 'localhost',
  port: 5432,
  entities: ['./dist/database/entities/*.entity.js'],
  entitiesTs: ['./src/database/entities/*.entity.ts'],
  extensions: [Migrator],
  migrations: {
    path: 'dist/migrations',
    pathTs: 'src/migrations',
  },
});
