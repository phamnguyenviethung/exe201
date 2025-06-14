import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// Request DTOs
export const CustomerStatisticsQuerySchema = z.object({
  period: z.enum(['week', 'month']).default('month'),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export class CustomerStatisticsQueryDTO extends createZodDto(
  CustomerStatisticsQuerySchema,
) {}

// Response DTOs
export const CustomerActivityStatsSchema = z.object({
  period: z.string(),
  newCustomers: z.number(),
  activeCustomers: z.number(),
  totalBookings: z.number(),
  totalDeposits: z.number(),
});

export class CustomerActivityStatsDTO extends createZodDto(
  CustomerActivityStatsSchema,
) {}

export const CustomerStatsSummarySchema = z.object({
  totalCustomers: z.number(),
  activeCustomersThisPeriod: z.number(),
  newCustomersThisPeriod: z.number(),
  totalBookingsThisPeriod: z.number(),
  totalDepositsThisPeriod: z.number(),
  period: z.object({
    startDate: z.date(),
    endDate: z.date(),
  }),
});

export class CustomerStatsSummaryDTO extends createZodDto(
  CustomerStatsSummarySchema,
) {}

export const CustomerStatisticsResSchema = z.object({
  summary: CustomerStatsSummarySchema,
  data: z.array(CustomerActivityStatsSchema),
});

export class CustomerStatisticsResDTO extends createZodDto(
  CustomerStatisticsResSchema,
) {}
