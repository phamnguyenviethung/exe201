import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { TransactionAction, TransactionStatus } from '../enums';

// Base Transaction Schema
const BaseTransactionSchema = z.object({
  id: z.string(),
  action: z.nativeEnum(TransactionAction),
  status: z.nativeEnum(TransactionStatus),
  amount: z.number().min(0),
  customerId: z.string(),
  paymentData: z.record(z.unknown()),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Query Transactions Schema
export const QueryTransactionsSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  status: z.nativeEnum(TransactionStatus).optional(),
  action: z.nativeEnum(TransactionAction).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

// Response Schemas
export const TransactionResponseSchema = BaseTransactionSchema;

export const TransactionListResponseSchema = z.object({
  items: z.array(TransactionResponseSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

// Create DTOs
export class QueryTransactionsDto extends createZodDto(
  QueryTransactionsSchema,
) {}
export class TransactionResponseDto extends createZodDto(
  TransactionResponseSchema,
) {}
export class TransactionListResponseDto extends createZodDto(
  TransactionListResponseSchema,
) {}
