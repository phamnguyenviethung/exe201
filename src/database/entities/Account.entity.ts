import { Entity, Enum, Property, Unique } from '@mikro-orm/core';
import { AppBaseEntity } from './base.entity';

export enum AccountRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity()
export class Account extends AppBaseEntity {
  @Property({ nullable: true })
  firstName: string;

  @Property({ nullable: true })
  lastName: string;

  @Property()
  @Unique()
  email: string;

  @Enum(() => AccountRole)
  role: AccountRole;
}
