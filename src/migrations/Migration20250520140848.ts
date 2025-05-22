import { Migration } from '@mikro-orm/migrations';

export class Migration20250520140848 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "staff" ("id" varchar(255) not null, "created_at" timestamptz not null default '2025-05-20T14:08:48.349Z', "updated_at" timestamptz null default '2025-05-20T14:08:48.350Z', "account_id" varchar(255) not null, "role" text check ("role" in ('mentor')) not null, constraint "staff_pkey" primary key ("id"));`);
    this.addSql(`alter table "staff" add constraint "staff_account_id_unique" unique ("account_id");`);

    this.addSql(`create table "booking" ("id" varchar(255) not null, "created_at" timestamptz not null default '2025-05-20T14:08:48.349Z', "updated_at" timestamptz null default '2025-05-20T14:08:48.350Z', "plan_id" varchar(255) not null, "customer_id" varchar(255) not null, "transaction_id" varchar(255) not null, "mentor_id" varchar(255) null, "status" varchar(255) not null default 'pending', constraint "booking_pkey" primary key ("id"));`);
    this.addSql(`alter table "booking" add constraint "booking_plan_id_unique" unique ("plan_id");`);
    this.addSql(`alter table "booking" add constraint "booking_customer_id_unique" unique ("customer_id");`);
    this.addSql(`alter table "booking" add constraint "booking_transaction_id_unique" unique ("transaction_id");`);
    this.addSql(`alter table "booking" add constraint "booking_mentor_id_unique" unique ("mentor_id");`);

    this.addSql(`alter table "staff" add constraint "staff_account_id_foreign" foreign key ("account_id") references "account" ("id") on update cascade;`);

    this.addSql(`alter table "booking" add constraint "booking_plan_id_foreign" foreign key ("plan_id") references "plan" ("id") on update cascade;`);
    this.addSql(`alter table "booking" add constraint "booking_customer_id_foreign" foreign key ("customer_id") references "customer" ("id") on update cascade;`);
    this.addSql(`alter table "booking" add constraint "booking_transaction_id_foreign" foreign key ("transaction_id") references "transaction" ("id") on update cascade;`);
    this.addSql(`alter table "booking" add constraint "booking_mentor_id_foreign" foreign key ("mentor_id") references "staff" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "account" drop constraint if exists "account_role_check";`);

    this.addSql(`alter table "account" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "account" alter column "created_at" set default '2025-05-20T14:08:48.349Z';`);
    this.addSql(`alter table "account" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "account" alter column "updated_at" set default '2025-05-20T14:08:48.350Z';`);
    this.addSql(`alter table "account" add constraint "account_role_check" check("role" in ('admin', 'user', 'staff'));`);

    this.addSql(`alter table "customer" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "customer" alter column "created_at" set default '2025-05-20T14:08:48.349Z';`);
    this.addSql(`alter table "customer" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "customer" alter column "updated_at" set default '2025-05-20T14:08:48.350Z';`);

    this.addSql(`alter table "plan" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "plan" alter column "created_at" set default '2025-05-20T14:08:48.349Z';`);
    this.addSql(`alter table "plan" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "plan" alter column "updated_at" set default '2025-05-20T14:08:48.350Z';`);

    this.addSql(`alter table "transaction" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "transaction" alter column "created_at" set default '2025-05-20T14:08:48.349Z';`);
    this.addSql(`alter table "transaction" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "transaction" alter column "updated_at" set default '2025-05-20T14:08:48.350Z';`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "booking" drop constraint "booking_mentor_id_foreign";`);

    this.addSql(`drop table if exists "staff" cascade;`);

    this.addSql(`drop table if exists "booking" cascade;`);

    this.addSql(`alter table "account" drop constraint if exists "account_role_check";`);

    this.addSql(`alter table "account" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "account" alter column "created_at" set default '2025-05-20T11:54:53.349Z';`);
    this.addSql(`alter table "account" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "account" alter column "updated_at" set default '2025-05-20T11:54:53.350Z';`);
    this.addSql(`alter table "account" add constraint "account_role_check" check("role" in ('admin', 'user'));`);

    this.addSql(`alter table "customer" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "customer" alter column "created_at" set default '2025-05-20T11:54:53.349Z';`);
    this.addSql(`alter table "customer" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "customer" alter column "updated_at" set default '2025-05-20T11:54:53.350Z';`);

    this.addSql(`alter table "plan" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "plan" alter column "created_at" set default '2025-05-20T11:54:53.349Z';`);
    this.addSql(`alter table "plan" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "plan" alter column "updated_at" set default '2025-05-20T11:54:53.350Z';`);

    this.addSql(`alter table "transaction" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "transaction" alter column "created_at" set default '2025-05-20T11:54:53.349Z';`);
    this.addSql(`alter table "transaction" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "transaction" alter column "updated_at" set default '2025-05-20T11:54:53.350Z';`);
  }

}
