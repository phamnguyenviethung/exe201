import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { AppBaseEntity } from './base.entity';

@Entity()
export class Customer extends AppBaseEntity {
  @PrimaryKey()
  id: string;

  @Property()
  firstName: string;

  @Property()
  lastName: string;

  @Property()
  email: string;

  @Property({ default: 0, nullable: true })
  balance: number;
}
