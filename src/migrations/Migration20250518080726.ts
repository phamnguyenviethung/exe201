import { Migration } from '@mikro-orm/migrations';

export class Migration20250518080726 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "customer" ("id" varchar(255) not null, "first_name" varchar(255) not null, "last_name" varchar(255) not null, "email" varchar(255) not null, "balance" int not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "customer_pkey" primary key ("id"));`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "customer" cascade;`);
  }

}
