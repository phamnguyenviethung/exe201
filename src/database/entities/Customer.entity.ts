import { Entity, OneToOne, Property } from '@mikro-orm/core';
import { AppBaseEntity } from './base.entity';
import { Account } from './Account.entity';

@Entity()
export class Customer extends AppBaseEntity {
  @OneToOne(() => Account)
  account: Account;

  @Property({ default: 0 })
  balance: number = 0;
}
