import { z } from 'zod';
import { BookingStatus } from '../../../../database/entities/Booking.entity';

export const updateActivityStatusSchema = z.object({
  status: z
    .nativeEnum(BookingStatus)
    .refine((status) => status !== BookingStatus.CONFIRMED, {
      message: 'Cannot set status to COMPLETED using this endpoint',
    }),
});

export const completeActivitySchema = z.object({
  notes: z.string().optional(),
});

export const bookingHistoryItemSchema = z.object({
  id: z.string(),
  status: z.nativeEnum(BookingStatus),
  createdAt: z.date(),
  updatedAt: z.date(),
  totalAmount: z.number(),
  planName: z.string(),
});

export const bookingHistoryResponseSchema = z.object({
  items: z.array(bookingHistoryItemSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
});
