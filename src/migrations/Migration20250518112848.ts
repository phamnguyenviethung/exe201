import { Migration } from '@mikro-orm/migrations';

export class Migration20250518112848 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "customer" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "customer" alter column "created_at" set default '2025-05-18T11:28:48.676Z';`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "customer" alter column "created_at" drop default;`);
    this.addSql(`alter table "customer" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
  }

}
