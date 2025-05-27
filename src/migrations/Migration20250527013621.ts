import { Migration } from '@mikro-orm/migrations';

export class Migration20250527013621 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "account" ("id" varchar(255) not null, "created_at" timestamptz not null default '2025-05-27T01:36:18.942Z', "updated_at" timestamptz null default '2025-05-27T01:36:18.942Z', "first_name" varchar(255) null, "last_name" varchar(255) null, "email" varchar(255) not null, "role" text check ("role" in ('admin', 'user', 'staff')) not null, constraint "account_pkey" primary key ("id"));`);
    this.addSql(`alter table "account" add constraint "account_email_unique" unique ("email");`);

    this.addSql(`create table "admin" ("id" varchar(255) not null, "created_at" timestamptz not null default '2025-05-27T01:36:18.942Z', "updated_at" timestamptz null default '2025-05-27T01:36:18.942Z', "account_id" varchar(255) not null, constraint "admin_pkey" primary key ("id"));`);
    this.addSql(`alter table "admin" add constraint "admin_account_id_unique" unique ("account_id");`);

    this.addSql(`create table "customer" ("id" varchar(255) not null, "created_at" timestamptz not null default '2025-05-27T01:36:18.942Z', "updated_at" timestamptz null default '2025-05-27T01:36:18.942Z', "account_id" varchar(255) not null, "balance" int not null default 0, constraint "customer_pkey" primary key ("id"));`);
    this.addSql(`alter table "customer" add constraint "customer_account_id_unique" unique ("account_id");`);

    this.addSql(`create table "plan" ("id" varchar(255) not null, "created_at" timestamptz not null default '2025-05-27T01:36:18.942Z', "updated_at" timestamptz null default '2025-05-27T01:36:18.942Z', "name" varchar(255) not null, "description" varchar(255) null, "price" int not null, "for" varchar(255) not null, "is_active" boolean not null default true, constraint "plan_pkey" primary key ("id"));`);

    this.addSql(`create table "staff" ("id" varchar(255) not null, "created_at" timestamptz not null default '2025-05-27T01:36:18.942Z', "updated_at" timestamptz null default '2025-05-27T01:36:18.942Z', "account_id" varchar(255) not null, "role" text check ("role" in ('mentor')) not null, constraint "staff_pkey" primary key ("id"));`);
    this.addSql(`alter table "staff" add constraint "staff_account_id_unique" unique ("account_id");`);

    this.addSql(`create table "transaction" ("id" varchar(255) not null, "created_at" timestamptz not null default '2025-05-27T01:36:18.942Z', "updated_at" timestamptz null default '2025-05-27T01:36:18.942Z', "action" text check ("action" in ('deposit', 'booking')) not null, "status" text check ("status" in ('pending', 'success', 'failed')) not null, "amount" int not null, "customer_id" varchar(255) not null, "payment_data" jsonb not null, constraint "transaction_pkey" primary key ("id"));`);

    this.addSql(`create table "booking" ("id" varchar(255) not null, "created_at" timestamptz not null default '2025-05-27T01:36:18.942Z', "updated_at" timestamptz null default '2025-05-27T01:36:18.942Z', "plan_id" varchar(255) not null, "customer_id" varchar(255) not null, "transaction_id" varchar(255) not null, "mentor_id" varchar(255) null, "status" varchar(255) not null default 'pending', constraint "booking_pkey" primary key ("id"));`);
    this.addSql(`alter table "booking" add constraint "booking_plan_id_unique" unique ("plan_id");`);
    this.addSql(`alter table "booking" add constraint "booking_customer_id_unique" unique ("customer_id");`);
    this.addSql(`alter table "booking" add constraint "booking_transaction_id_unique" unique ("transaction_id");`);
    this.addSql(`alter table "booking" add constraint "booking_mentor_id_unique" unique ("mentor_id");`);

    this.addSql(`create table "booking_activity" ("id" varchar(255) not null, "created_at" timestamptz not null default '2025-05-27T01:36:18.942Z', "updated_at" timestamptz null default '2025-05-27T01:36:18.942Z', "booking_id" varchar(255) not null, "name" varchar(255) not null, "content" varchar(255) not null, "note" varchar(255) null, "type" varchar(255) not null, "status" varchar(255) not null, "start_at" timestamptz not null, "end_at" timestamptz not null, "metadata" jsonb not null, constraint "booking_activity_pkey" primary key ("id"));`);

    this.addSql(`alter table "admin" add constraint "admin_account_id_foreign" foreign key ("account_id") references "account" ("id") on update cascade;`);

    this.addSql(`alter table "customer" add constraint "customer_account_id_foreign" foreign key ("account_id") references "account" ("id") on update cascade;`);

    this.addSql(`alter table "staff" add constraint "staff_account_id_foreign" foreign key ("account_id") references "account" ("id") on update cascade;`);

    this.addSql(`alter table "transaction" add constraint "transaction_customer_id_foreign" foreign key ("customer_id") references "customer" ("id") on update cascade;`);

    this.addSql(`alter table "booking" add constraint "booking_plan_id_foreign" foreign key ("plan_id") references "plan" ("id") on update cascade;`);
    this.addSql(`alter table "booking" add constraint "booking_customer_id_foreign" foreign key ("customer_id") references "customer" ("id") on update cascade;`);
    this.addSql(`alter table "booking" add constraint "booking_transaction_id_foreign" foreign key ("transaction_id") references "transaction" ("id") on update cascade;`);
    this.addSql(`alter table "booking" add constraint "booking_mentor_id_foreign" foreign key ("mentor_id") references "staff" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "booking_activity" add constraint "booking_activity_booking_id_foreign" foreign key ("booking_id") references "booking" ("id") on update cascade;`);
  }

}
