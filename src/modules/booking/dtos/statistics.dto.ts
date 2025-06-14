import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// Request DTOs
export const BookingStatisticsQuerySchema = z.object({
  period: z.enum(['week', 'month']).default('month'),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export class BookingStatisticsQueryDTO extends createZodDto(
  BookingStatisticsQuerySchema,
) {}

// Response DTOs
export const BookingActivityStatsSchema = z.object({
  period: z.string(),
  totalBookings: z.number(),
  reviewCVBookings: z.number(),
  mockInterviewBookings: z.number(),
  completedActivities: z.number(),
  upcomingActivities: z.number(),
});

export class BookingActivityStatsDTO extends createZodDto(
  BookingActivityStatsSchema,
) {}

export const BookingStatsSummarySchema = z.object({
  totalBookings: z.number(),
  totalReviewCVBookings: z.number(),
  totalMockInterviewBookings: z.number(),
  totalCompletedActivities: z.number(),
  totalUpcomingActivities: z.number(),
  period: z.object({
    startDate: z.date(),
    endDate: z.date(),
  }),
});

export class BookingStatsSummaryDTO extends createZodDto(
  BookingStatsSummarySchema,
) {}

export const BookingStatisticsResSchema = z.object({
  summary: BookingStatsSummarySchema,
  data: z.array(BookingActivityStatsSchema),
});

export class BookingStatisticsResDTO extends createZodDto(
  BookingStatisticsResSchema,
) {}
