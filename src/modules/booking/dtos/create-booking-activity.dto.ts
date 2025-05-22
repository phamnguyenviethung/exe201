import { BookingActivityType } from '@/database/entities/Booking.entity';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createBookingActivitySchema = z
  .object({
    name: z.string().min(1),
    content: z.string().min(1),
    note: z.string().optional(),
    type: z.nativeEnum(BookingActivityType),
    startAt: z.string().datetime(),
    endAt: z.string().datetime(),
    metadata: z.record(z.any()).optional(),
  })
  .refine((data) => data.startAt < data.endAt, {
    message: 'Activity start time must be before end time',
    path: ['endAt'],
  });

export class CreateBookingActivityDto extends createZodDto(
  createBookingActivitySchema,
) {}
