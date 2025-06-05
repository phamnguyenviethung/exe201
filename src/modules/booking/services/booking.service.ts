import { Customer } from '@/database/entities/Account.entity';
import { EntityManager, Transactional, wrap } from '@mikro-orm/core';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Staff } from '../../../database/entities/Account.entity';
import {
  Booking,
  BookingActivity,
  BookingActivityStatus,
  BookingStatus,
  Plan,
} from '../../../database/entities/Booking.entity';
import { CreateBookingActivityDto } from '../dtos/create-booking-activity.dto';
import { CreateBookingReqDTO } from '../dtos/create-booking.dto';

@Injectable()
export class BookingService {
  private readonly logger = new Logger(BookingService.name);

  constructor(private readonly em: EntityManager) {}

  @Transactional()
  async createBooking(
    customerId: string,
    dto: CreateBookingReqDTO,
  ): Promise<Booking> {
    this.logger.log(
      `Creating booking for customer ${customerId} with plan ${dto.planId}`,
    );

    const plan = await this.em.findOne(Plan, {
      id: dto.planId,
      isActive: true,
    });
    if (!plan) {
      throw new NotFoundException(
        `Plan with id ${dto.planId} not found or inactive`,
      );
    }

    if (plan.for !== dto.planFor) {
      throw new BadRequestException(
        `Plan type mismatch. Expected ${plan.for} but got ${dto.planFor}`,
      );
    }
    const customer = await this.em.findOne(
      Customer,
      {
        id: customerId,
      },
      {
        populate: ['account'],
      },
    );
    if (!customer) {
      throw new NotFoundException(`Customer with id ${customerId} not found`);
    }
    const booking = this.em.create(Booking, {
      plan,
      customer,
      status: BookingStatus.PENDING,
    });

    await this.em.persistAndFlush(booking);
    this.logger.log(`Created booking ${booking.id} successfully`);

    return booking;
  }

  @Transactional()
  async createBookingActivity(
    bookingId: string,
    dto: CreateBookingActivityDto,
  ): Promise<BookingActivity> {
    this.logger.log(`Creating activity for booking ${bookingId}`);

    // Validate booking exists
    const booking = await this.em.findOne(Booking, { id: bookingId });
    if (!booking) {
      throw new NotFoundException(`Booking with id ${bookingId} not found`);
    }

    // Validate booking status
    if (booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException(
        'Cannot create activity for cancelled booking',
      );
    }

    // Validate activity dates
    if (dto.startAt >= dto.endAt) {
      throw new BadRequestException(
        'Activity start time must be before end time',
      );
    }

    // Create activity
    const activity = this.em.create(BookingActivity, {
      booking,
      ...dto,
      status: BookingActivityStatus.UPCOMING,
    });

    await this.em.persistAndFlush(activity);
    this.logger.log(
      `Created activity ${activity.id} for booking ${bookingId} successfully`,
    );

    return activity;
  }

  async getBookingById(id: string): Promise<Booking> {
    const booking = await this.em.findOne(
      Booking,
      { id },
      {
        populate: ['plan', 'customer', 'mentor', 'transaction'],
      },
    );

    if (!booking) {
      throw new BadRequestException(`Booking with id ${id} not found`);
    }

    return booking;
  }

  async getBookingActivities(bookingId: string): Promise<BookingActivity[]> {
    const activities = await this.em.find(
      BookingActivity,
      { booking: { id: bookingId } },
      {
        orderBy: { startAt: 'ASC' },
      },
    );

    return activities;
  }

  @Transactional()
  async updateBookingStatus(
    id: string,
    status: BookingStatus,
  ): Promise<Booking> {
    this.logger.log(`Updating booking ${id} status to ${status}`);

    const booking = await this.em.findOne(Booking, { id });
    if (!booking) {
      throw new BadRequestException(`Booking with id ${id} not found`);
    }

    booking.status = status;
    await this.em.persistAndFlush(booking);
    this.logger.log(`Updated booking ${id} status to ${status} successfully`);

    return booking;
  }

  @Transactional()
  async updateActivityStatus(
    bookingId: string,
    activityId: string,
    status: BookingActivityStatus,
    notes?: string,
  ): Promise<BookingActivity> {
    const activity = await this.em.findOne(BookingActivity, {
      id: activityId,
      booking: { id: bookingId },
    });

    if (!activity) {
      throw new BadRequestException('Activity not found');
    }

    activity.status = status;

    // If completing the activity, add notes and completion metadata
    if (status === BookingActivityStatus.COMPLETED) {
      activity.note = notes;
      activity.metadata = {
        ...activity.metadata,
        completedAt: new Date(),
      };
    }

    await this.em.persistAndFlush(activity);
    return activity;
  }

  @Transactional()
  async completeBooking(bookingId: string, notes?: string): Promise<Booking> {
    const booking = await this.em.findOne(Booking, { id: bookingId });

    if (!booking) {
      throw new BadRequestException(`Booking with id ${bookingId} not found`);
    }

    booking.status = BookingStatus.CONFIRMED;

    // Add notes to the booking's metadata or notes field if available
    // Store completion information in a way that makes sense for your entity
    this.logger.log(
      `Completed booking ${bookingId}${notes ? ' with notes' : ''}`,
    );

    await this.em.persistAndFlush(booking);
    return booking;
  }

  @Transactional()
  async deleteActivity(bookingId: string, activityId: string): Promise<void> {
    const activity = await this.em.findOne(BookingActivity, {
      id: activityId,
      booking: { id: bookingId },
    });

    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    await this.em.removeAndFlush(activity);
  }

  @Transactional()
  async assignStaff(bookingId: string, staffId: string): Promise<Booking> {
    const booking = await this.em.findOne(Booking, { id: bookingId });
    if (!booking) {
      throw new NotFoundException(`Booking with id ${bookingId} not found`);
    }

    const staff = await this.em.findOne(Staff, { id: staffId });
    if (!staff) {
      throw new NotFoundException(`Staff with id ${staffId} not found`);
    }

    wrap(booking).assign({ mentor: staff });
    await this.em.persistAndFlush(booking);
    return booking;
  }

  async getBookingHistory(userId: string, page: number, limit: number) {
    console.log('userId', userId);
    const [bookings, total] = await this.em.findAndCount(
      Booking,
      { customer: { id: userId } },
      {
        populate: ['plan', 'mentor', 'mentor.account'],
        orderBy: { createdAt: 'DESC' },
        limit,
        offset: (page - 1) * limit,
      },
    );

    // Get all booking IDs
    const bookingIds = bookings.map((booking) => booking.id);

    // Fetch all activities for these bookings in a single query
    const activities =
      bookingIds.length > 0
        ? await this.em.find(
            BookingActivity,
            { booking: { id: { $in: bookingIds } } },
            { orderBy: { startAt: 'ASC' } },
          )
        : [];

    // Create a map of booking ID to activities for quick lookup
    const bookingActivitiesMap = new Map<string, BookingActivity[]>();
    activities.forEach((activity) => {
      const bookingId = (activity.booking as any).id;
      if (!bookingActivitiesMap.has(bookingId)) {
        bookingActivitiesMap.set(bookingId, []);
      }
      bookingActivitiesMap.get(bookingId)!.push(activity);
    });

    return {
      items: bookings.map((booking) => {
        const mentor = booking.mentor as any;
        const bookingActivities = bookingActivitiesMap.get(booking.id) || [];

        return {
          id: booking.id,
          status: booking.status,
          createdAt: booking.createdAt,
          updatedAt: booking.updatedAt,
          totalAmount: booking.plan.price,
          planName: booking.plan.name,
          mentor: mentor
            ? {
                id: mentor.id,
                name: mentor.account
                  ? `${mentor.account.firstName} ${mentor.account.lastName}`
                  : 'Unknown',
              }
            : null,
          activities: bookingActivities.map((activity) => ({
            id: activity.id,
            name: activity.name,
            content: activity.content,
            type: activity.type,
            status: activity.status,
            startAt: activity.startAt,
            endAt: activity.endAt,
            meetingLink: activity.meetingLink,
            note: activity.note,
          })),
        };
      }),
      total,
      page,
      limit,
    };
  }
}
