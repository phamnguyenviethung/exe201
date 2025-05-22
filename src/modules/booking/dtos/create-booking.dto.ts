import { z } from 'zod';
import { PlanFor } from '../../../database/entities/Booking.entity';
import { createZodDto } from 'nestjs-zod';

const createBookingSchema = z.object({
  planId: z.string(),
  planFor: z.nativeEnum(PlanFor),
  note: z.string().optional(),
});

export class CreateBookingReqDTO extends createZodDto(createBookingSchema) {}
