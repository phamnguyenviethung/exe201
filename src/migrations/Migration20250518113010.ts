import { Migration } from '@mikro-orm/migrations';

export class Migration20250518113010 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "customer" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "customer" alter column "created_at" set default '2025-05-18T11:30:10.862Z';`);
    this.addSql(`alter table "customer" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "customer" alter column "updated_at" set default '2025-05-18T11:30:10.863Z';`);
    this.addSql(`alter table "customer" alter column "updated_at" drop not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "customer" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "customer" alter column "created_at" set default '2025-05-18T11:28:48.676Z';`);
    this.addSql(`alter table "customer" alter column "updated_at" drop default;`);
    this.addSql(`alter table "customer" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "customer" alter column "updated_at" set not null;`);
  }

}
