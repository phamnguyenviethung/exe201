import { Migration } from '@mikro-orm/migrations';

export class Migration20250520034918 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "account" ("id" varchar(255) not null, "created_at" timestamptz not null default '2025-05-20T03:49:17.995Z', "updated_at" timestamptz null default '2025-05-20T03:49:17.995Z', "first_name" varchar(255) null, "last_name" varchar(255) null, "email" varchar(255) not null, "role" text check ("role" in ('admin', 'user')) not null, constraint "account_pkey" primary key ("id"));`);
    this.addSql(`alter table "account" add constraint "account_email_unique" unique ("email");`);

    this.addSql(`create table "customer" ("id" varchar(255) not null, "created_at" timestamptz not null default '2025-05-20T03:49:17.995Z', "updated_at" timestamptz null default '2025-05-20T03:49:17.995Z', "account_id" varchar(255) not null, "balance" int not null default 0, constraint "customer_pkey" primary key ("id"));`);
    this.addSql(`alter table "customer" add constraint "customer_account_id_unique" unique ("account_id");`);

    this.addSql(`create table "transaction" ("id" varchar(255) not null, "created_at" timestamptz not null default '2025-05-20T03:49:17.995Z', "updated_at" timestamptz null default '2025-05-20T03:49:17.995Z', "action" text check ("action" in ('deposit', 'booking')) not null, "status" text check ("status" in ('pending', 'success', 'failed')) not null, "amount" int not null, "customer_id" varchar(255) not null, "payment_data" jsonb not null, constraint "transaction_pkey" primary key ("id"));`);

    this.addSql(`alter table "customer" add constraint "customer_account_id_foreign" foreign key ("account_id") references "account" ("id") on update cascade;`);

    this.addSql(`alter table "transaction" add constraint "transaction_customer_id_foreign" foreign key ("customer_id") references "customer" ("id") on update cascade;`);
  }

}
