import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { Feedback } from '../../database/entities/feedback.entity';
import { CreateFeedbackType } from './dto/create-feedback.dto';
import { Booking } from '../../database/entities/Booking.entity';
import { Customer } from '../../database/entities/Account.entity';

@Injectable()
export class FeedbackService {
  constructor(private readonly em: EntityManager) {}

  async createFeedback(
    bookingId: string,
    customerId: string,
    createFeedbackDto: CreateFeedbackType,
  ): Promise<Feedback> {
    const booking = await this.em.findOne(Booking, { id: bookingId });
    if (!booking) {
      throw new Error('Booking not found');
    }

    const customer = await this.em.findOne(Customer, { id: customerId });
    if (!customer) {
      throw new Error('Customer not found');
    }

    const feedback = this.em.create(Feedback, {
      ...createFeedbackDto,
      booking,
      customer,
    });

    await this.em.persistAndFlush(feedback);
    return feedback;
  }

  async getFeedbackByBooking(bookingId: string): Promise<Feedback | null> {
    return this.em.findOne(Feedback, { booking: { id: bookingId } });
  }

  async getFeedbackByCustomer(customerId: string): Promise<Feedback[]> {
    return this.em.find(Feedback, { customer: { id: customerId } });
  }

  async replyToFeedback(feedbackId: string, reply: string): Promise<Feedback> {
    const feedback = await this.em.findOne(Feedback, { id: feedbackId });
    if (!feedback) {
      throw new Error('Feedback not found');
    }

    feedback.reply = reply;
    feedback.repliedAt = new Date();
    await this.em.persistAndFlush(feedback);
    return feedback;
  }
}
