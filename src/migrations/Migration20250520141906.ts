import { Migration } from '@mikro-orm/migrations';

export class Migration20250520141906 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "booking_activity" ("id" varchar(255) not null, "created_at" timestamptz not null default '2025-05-20T14:19:06.518Z', "updated_at" timestamptz null default '2025-05-20T14:19:06.519Z', "booking_id" varchar(255) not null, "name" varchar(255) not null, "content" varchar(255) not null, "note" varchar(255) null, "type" varchar(255) not null, "status" varchar(255) not null, "start_at" timestamptz not null, "end_at" timestamptz not null, "metadata" jsonb not null, constraint "booking_activity_pkey" primary key ("id"));`);

    this.addSql(`alter table "booking_activity" add constraint "booking_activity_booking_id_foreign" foreign key ("booking_id") references "booking" ("id") on update cascade;`);

    this.addSql(`alter table "account" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "account" alter column "created_at" set default '2025-05-20T14:19:06.518Z';`);
    this.addSql(`alter table "account" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "account" alter column "updated_at" set default '2025-05-20T14:19:06.519Z';`);

    this.addSql(`alter table "customer" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "customer" alter column "created_at" set default '2025-05-20T14:19:06.518Z';`);
    this.addSql(`alter table "customer" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "customer" alter column "updated_at" set default '2025-05-20T14:19:06.519Z';`);

    this.addSql(`alter table "plan" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "plan" alter column "created_at" set default '2025-05-20T14:19:06.518Z';`);
    this.addSql(`alter table "plan" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "plan" alter column "updated_at" set default '2025-05-20T14:19:06.519Z';`);

    this.addSql(`alter table "staff" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "staff" alter column "created_at" set default '2025-05-20T14:19:06.518Z';`);
    this.addSql(`alter table "staff" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "staff" alter column "updated_at" set default '2025-05-20T14:19:06.519Z';`);

    this.addSql(`alter table "transaction" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "transaction" alter column "created_at" set default '2025-05-20T14:19:06.518Z';`);
    this.addSql(`alter table "transaction" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "transaction" alter column "updated_at" set default '2025-05-20T14:19:06.519Z';`);

    this.addSql(`alter table "booking" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "booking" alter column "created_at" set default '2025-05-20T14:19:06.518Z';`);
    this.addSql(`alter table "booking" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "booking" alter column "updated_at" set default '2025-05-20T14:19:06.519Z';`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "booking_activity" cascade;`);

    this.addSql(`alter table "account" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "account" alter column "created_at" set default '2025-05-20T14:08:48.349Z';`);
    this.addSql(`alter table "account" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "account" alter column "updated_at" set default '2025-05-20T14:08:48.350Z';`);

    this.addSql(`alter table "customer" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "customer" alter column "created_at" set default '2025-05-20T14:08:48.349Z';`);
    this.addSql(`alter table "customer" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "customer" alter column "updated_at" set default '2025-05-20T14:08:48.350Z';`);

    this.addSql(`alter table "plan" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "plan" alter column "created_at" set default '2025-05-20T14:08:48.349Z';`);
    this.addSql(`alter table "plan" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "plan" alter column "updated_at" set default '2025-05-20T14:08:48.350Z';`);

    this.addSql(`alter table "staff" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "staff" alter column "created_at" set default '2025-05-20T14:08:48.349Z';`);
    this.addSql(`alter table "staff" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "staff" alter column "updated_at" set default '2025-05-20T14:08:48.350Z';`);

    this.addSql(`alter table "transaction" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "transaction" alter column "created_at" set default '2025-05-20T14:08:48.349Z';`);
    this.addSql(`alter table "transaction" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "transaction" alter column "updated_at" set default '2025-05-20T14:08:48.350Z';`);

    this.addSql(`alter table "booking" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "booking" alter column "created_at" set default '2025-05-20T14:08:48.349Z';`);
    this.addSql(`alter table "booking" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "booking" alter column "updated_at" set default '2025-05-20T14:08:48.350Z';`);
  }

}
