import { Entity, Property, ManyToOne, Enum } from '@mikro-orm/core';
import { AppBaseEntity } from './base.entity';
import { Booking } from './Booking.entity';
import { Customer } from './Account.entity';

export enum FeedbackRating {
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4,
  FIVE = 5,
}

@Entity()
export class Feedback extends AppBaseEntity {
  @Property()
  comment!: string;

  @Enum(() => FeedbackRating)
  rating!: FeedbackRating;

  @ManyToOne(() => Booking)
  booking!: Booking;

  @ManyToOne(() => Customer)
  customer!: Customer;

  @Property({ nullable: true })
  reply?: string;

  @Property({ nullable: true })
  repliedAt?: Date;
}
