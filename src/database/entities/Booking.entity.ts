import { Entity, ManyToOne, OneToOne, Property, Ref } from '@mikro-orm/core';
import { Customer, Staff } from './Account.entity';
import { AppBaseEntity } from './base.entity';
import { Transaction } from './Transaction.entity';

export enum PlanFor {
  REVIEW_CV = 'review_cv',
  MOCK_INTERVIEW = 'mock_interview',
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
}

export enum BookingActivityType {
  ANNOUNCEMENT = 'announcement',
  MEETING = 'meeting',
}

export enum BookingActivityStatus {
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  UPCOMING = 'upcoming',
  IN_PROGRESS = 'in_progress',
}

@Entity()
export class Plan extends AppBaseEntity {
  @Property()
  name: string;

  @Property({ nullable: true })
  description: string;

  @Property()
  price: number;

  @Property()
  for: PlanFor;

  @Property({ default: true })
  isActive?: boolean = true;
}

@Entity()
export class Booking extends AppBaseEntity {
  @OneToOne(() => Plan)
  plan: Plan;

  @OneToOne(() => Customer, { ref: true })
  customer: Ref<Customer>;

  @OneToOne(() => Transaction, { ref: true })
  transaction: Ref<Transaction>;

  @OneToOne(() => Staff, { ref: true, nullable: true })
  mentor!: Ref<Staff>;

  @Property({ default: BookingStatus.PENDING })
  status: BookingStatus = BookingStatus.PENDING;
}

@Entity()
export class BookingActivity extends AppBaseEntity {
  @ManyToOne(() => Booking)
  booking: Booking;

  @Property()
  name: string;

  @Property()
  content: string;

  @Property({ nullable: true, default: null })
  note?: string;

  @Property({ nullable: true })
  meetingLink?: string;

  @Property()
  type: BookingActivityType;

  @Property()
  status: BookingActivityStatus;

  @Property()
  startAt: Date;

  @Property()
  endAt: Date;

  @Property({ type: 'json' })
  metadata: Record<string, any>;
}
