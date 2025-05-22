import { Migration } from '@mikro-orm/migrations';

export class Migration20250521112819 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "account" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "account" alter column "created_at" set default '2025-05-21T11:28:18.996Z';`);
    this.addSql(`alter table "account" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "account" alter column "updated_at" set default '2025-05-21T11:28:18.997Z';`);

    this.addSql(`alter table "customer" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "customer" alter column "created_at" set default '2025-05-21T11:28:18.996Z';`);
    this.addSql(`alter table "customer" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "customer" alter column "updated_at" set default '2025-05-21T11:28:18.997Z';`);

    this.addSql(`alter table "plan" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "plan" alter column "created_at" set default '2025-05-21T11:28:18.996Z';`);
    this.addSql(`alter table "plan" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "plan" alter column "updated_at" set default '2025-05-21T11:28:18.997Z';`);

    this.addSql(`alter table "staff" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "staff" alter column "created_at" set default '2025-05-21T11:28:18.996Z';`);
    this.addSql(`alter table "staff" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "staff" alter column "updated_at" set default '2025-05-21T11:28:18.997Z';`);

    this.addSql(`alter table "transaction" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "transaction" alter column "created_at" set default '2025-05-21T11:28:18.996Z';`);
    this.addSql(`alter table "transaction" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "transaction" alter column "updated_at" set default '2025-05-21T11:28:18.997Z';`);

    this.addSql(`alter table "booking" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "booking" alter column "created_at" set default '2025-05-21T11:28:18.996Z';`);
    this.addSql(`alter table "booking" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "booking" alter column "updated_at" set default '2025-05-21T11:28:18.997Z';`);

    this.addSql(`alter table "booking_activity" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "booking_activity" alter column "created_at" set default '2025-05-21T11:28:18.996Z';`);
    this.addSql(`alter table "booking_activity" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "booking_activity" alter column "updated_at" set default '2025-05-21T11:28:18.997Z';`);
  }

  override async down(): Promise<void> {
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

    this.addSql(`alter table "booking_activity" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "booking_activity" alter column "created_at" set default '2025-05-20T14:19:06.518Z';`);
    this.addSql(`alter table "booking_activity" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "booking_activity" alter column "updated_at" set default '2025-05-20T14:19:06.519Z';`);
  }

}
