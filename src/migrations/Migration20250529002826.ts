import { Migration } from '@mikro-orm/migrations';

export class Migration20250529002826 extends Migration {

  override async up(): Promise<void> {
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
    this.addSql(`alter table "staff" alter column "role" type text using ("role"::text);`);
    this.addSql(`alter table "staff" alter column "role" set default 'mentor';`);

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

  override async down(): Promise<void> {
    this.addSql(`alter table "account" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "account" alter column "created_at" set default '2025-05-29T00:25:20.652Z';`);
    this.addSql(`alter table "account" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "account" alter column "updated_at" set default '2025-05-29T00:25:20.653Z';`);

    this.addSql(`alter table "admin" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "admin" alter column "created_at" set default '2025-05-29T00:25:20.652Z';`);
    this.addSql(`alter table "admin" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "admin" alter column "updated_at" set default '2025-05-29T00:25:20.653Z';`);

    this.addSql(`alter table "customer" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "customer" alter column "created_at" set default '2025-05-29T00:25:20.652Z';`);
    this.addSql(`alter table "customer" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "customer" alter column "updated_at" set default '2025-05-29T00:25:20.653Z';`);

    this.addSql(`alter table "plan" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "plan" alter column "created_at" set default '2025-05-29T00:25:20.652Z';`);
    this.addSql(`alter table "plan" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "plan" alter column "updated_at" set default '2025-05-29T00:25:20.653Z';`);

    this.addSql(`alter table "staff" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "staff" alter column "created_at" set default '2025-05-29T00:25:20.652Z';`);
    this.addSql(`alter table "staff" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "staff" alter column "updated_at" set default '2025-05-29T00:25:20.653Z';`);
    this.addSql(`alter table "staff" alter column "role" drop default;`);
    this.addSql(`alter table "staff" alter column "role" type text using ("role"::text);`);

    this.addSql(`alter table "transaction" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "transaction" alter column "created_at" set default '2025-05-29T00:25:20.652Z';`);
    this.addSql(`alter table "transaction" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "transaction" alter column "updated_at" set default '2025-05-29T00:25:20.653Z';`);

    this.addSql(`alter table "booking" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "booking" alter column "created_at" set default '2025-05-29T00:25:20.652Z';`);
    this.addSql(`alter table "booking" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "booking" alter column "updated_at" set default '2025-05-29T00:25:20.653Z';`);

    this.addSql(`alter table "booking_activity" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "booking_activity" alter column "created_at" set default '2025-05-29T00:25:20.652Z';`);
    this.addSql(`alter table "booking_activity" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "booking_activity" alter column "updated_at" set default '2025-05-29T00:25:20.653Z';`);
  }

}
