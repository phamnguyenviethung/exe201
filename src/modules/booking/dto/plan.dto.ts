import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { PlanFor } from '@/database/entities/Booking.entity';

// Create Plan Request Schema
export const CreatePlanSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().min(0),
  for: z.nativeEnum(PlanFor),
  isActive: z.boolean().optional().default(true),
});

// Update Plan Request Schema
export const UpdatePlanSchema = CreatePlanSchema.partial();

// Plan Response Schema
export const PlanResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  price: z.number(),
  for: z.nativeEnum(PlanFor),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Create DTOs from schemas
export class CreatePlanDto extends createZodDto(CreatePlanSchema) {}
export class UpdatePlanDto extends createZodDto(UpdatePlanSchema) {}
export class PlanResponseDto extends createZodDto(PlanResponseSchema) {}
