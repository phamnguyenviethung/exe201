import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { BookingStatus } from '../../../database/entities/Booking.entity';

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
