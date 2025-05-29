import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import {
  BookingStatus,
  BookingActivityStatus,
  BookingActivityType,
} from '../../../database/entities/Booking.entity';

const bookingActivitySchema = z.object({
  id: z.string(),
  name: z.string(),
  content: z.string(),
  type: z.nativeEnum(BookingActivityType),
  status: z.nativeEnum(BookingActivityStatus),
  startAt: z.date(),
  endAt: z.date(),
  meetingLink: z.string().nullable(),
  note: z.string().nullable(),
});

export const bookingHistoryItemSchema = z.object({
  id: z.string(),
  status: z.nativeEnum(BookingStatus),
  createdAt: z.date(),
  updatedAt: z.date(),
  totalAmount: z.number(),
  planName: z.string(),
  mentor: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .nullable(),
  activities: z.array(bookingActivitySchema),
});

export const bookingHistoryResponseSchema = z.object({
  items: z.array(bookingHistoryItemSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
});

export type BookingHistoryItemDtoType = z.infer<
  typeof bookingHistoryItemSchema
>;
export type BookingHistoryResponseDtoType = z.infer<
  typeof bookingHistoryResponseSchema
>;

export class BookingHistoryItemDto extends createZodDto(
  bookingHistoryItemSchema,
) {}
export class BookingHistoryResponseDto extends createZodDto(
  bookingHistoryResponseSchema,
) {}
