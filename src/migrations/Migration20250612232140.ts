import { Migration } from '@mikro-orm/migrations';

export class Migration20250612232140 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "feedback" ("id" varchar(255) not null, "created_at" timestamptz not null default '2025-06-12T23:21:40.796Z', "updated_at" timestamptz null default '2025-06-12T23:21:40.797Z', "comment" varchar(255) not null, "rating" smallint not null, "booking_id" varchar(255) not null, "customer_id" varchar(255) not null, "reply" varchar(255) null, "replied_at" timestamptz null, constraint "feedback_pkey" primary key ("id"));`);

    this.addSql(`alter table "feedback" add constraint "feedback_booking_id_foreign" foreign key ("booking_id") references "booking" ("id") on update cascade;`);
    this.addSql(`alter table "feedback" add constraint "feedback_customer_id_foreign" foreign key ("customer_id") references "customer" ("id") on update cascade;`);

    this.addSql(`alter table "account" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "account" alter column "created_at" set default '2025-06-12T23:21:40.796Z';`);
    this.addSql(`alter table "account" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "account" alter column "updated_at" set default '2025-06-12T23:21:40.797Z';`);

    this.addSql(`alter table "admin" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "admin" alter column "created_at" set default '2025-06-12T23:21:40.796Z';`);
    this.addSql(`alter table "admin" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "admin" alter column "updated_at" set default '2025-06-12T23:21:40.797Z';`);

    this.addSql(`alter table "customer" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "customer" alter column "created_at" set default '2025-06-12T23:21:40.796Z';`);
    this.addSql(`alter table "customer" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "customer" alter column "updated_at" set default '2025-06-12T23:21:40.797Z';`);

    this.addSql(`alter table "plan" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "plan" alter column "created_at" set default '2025-06-12T23:21:40.796Z';`);
    this.addSql(`alter table "plan" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "plan" alter column "updated_at" set default '2025-06-12T23:21:40.797Z';`);

    this.addSql(`alter table "staff" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "staff" alter column "created_at" set default '2025-06-12T23:21:40.796Z';`);
    this.addSql(`alter table "staff" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "staff" alter column "updated_at" set default '2025-06-12T23:21:40.797Z';`);

    this.addSql(`alter table "transaction" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "transaction" alter column "created_at" set default '2025-06-12T23:21:40.796Z';`);
    this.addSql(`alter table "transaction" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "transaction" alter column "updated_at" set default '2025-06-12T23:21:40.797Z';`);

    this.addSql(`alter table "booking" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "booking" alter column "created_at" set default '2025-06-12T23:21:40.796Z';`);
    this.addSql(`alter table "booking" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "booking" alter column "updated_at" set default '2025-06-12T23:21:40.797Z';`);

    this.addSql(`alter table "booking_activity" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "booking_activity" alter column "created_at" set default '2025-06-12T23:21:40.796Z';`);
    this.addSql(`alter table "booking_activity" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "booking_activity" alter column "updated_at" set default '2025-06-12T23:21:40.797Z';`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "feedback" cascade;`);

    this.addSql(`alter table "account" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "account" alter column "created_at" set default '2025-05-29T00:28:26.795Z';`);
    this.addSql(`alter table "account" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "account" alter column "updated_at" set default '2025-05-29T00:28:26.796Z';`);

    this.addSql(`alter table "admin" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "admin" alter column "created_at" set default '2025-05-29T00:28:26.795Z';`);
    this.addSql(`alter table "admin" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "admin" alter column "updated_at" set default '2025-05-29T00:28:26.796Z';`);

    this.addSql(`alter table "customer" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "customer" alter column "created_at" set default '2025-05-29T00:28:26.795Z';`);
    this.addSql(`alter table "customer" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "customer" alter column "updated_at" set default '2025-05-29T00:28:26.796Z';`);

    this.addSql(`alter table "plan" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "plan" alter column "created_at" set default '2025-05-29T00:28:26.795Z';`);
    this.addSql(`alter table "plan" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "plan" alter column "updated_at" set default '2025-05-29T00:28:26.796Z';`);

    this.addSql(`alter table "staff" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "staff" alter column "created_at" set default '2025-05-29T00:28:26.795Z';`);
    this.addSql(`alter table "staff" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "staff" alter column "updated_at" set default '2025-05-29T00:28:26.796Z';`);

    this.addSql(`alter table "transaction" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "transaction" alter column "created_at" set default '2025-05-29T00:28:26.795Z';`);
    this.addSql(`alter table "transaction" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "transaction" alter column "updated_at" set default '2025-05-29T00:28:26.796Z';`);

    this.addSql(`alter table "booking" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "booking" alter column "created_at" set default '2025-05-29T00:28:26.795Z';`);
    this.addSql(`alter table "booking" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "booking" alter column "updated_at" set default '2025-05-29T00:28:26.796Z';`);

    this.addSql(`alter table "booking_activity" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "booking_activity" alter column "created_at" set default '2025-05-29T00:28:26.795Z';`);
    this.addSql(`alter table "booking_activity" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "booking_activity" alter column "updated_at" set default '2025-05-29T00:28:26.796Z';`);
  }

}
