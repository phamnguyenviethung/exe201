import {
  TransactionAction,
  TransactionStatus,
} from '@/modules/transaction/enums';
import { Entity, Enum, ManyToOne, Property } from '@mikro-orm/core';
import { AppBaseEntity } from './base.entity';
import { Customer } from './Account.entity';
@Entity()
export class Transaction extends AppBaseEntity {
  @Enum(() => TransactionAction)
  action: TransactionAction;

  @Enum(() => TransactionStatus)
  status: TransactionStatus;

  @Property()
  amount: number;

  @ManyToOne(() => Customer)
  customer: Customer;

  @Property({ type: 'json' })
  paymentData: object;
}
