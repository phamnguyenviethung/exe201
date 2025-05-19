import { Migration } from '@mikro-orm/migrations';

export class Migration20250518082056 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "customer" alter column "balance" type int using ("balance"::int);`);
    this.addSql(`alter table "customer" alter column "balance" set default 0;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "customer" alter column "balance" drop default;`);
    this.addSql(`alter table "customer" alter column "balance" type int using ("balance"::int);`);
  }

}
