import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { BookingActivityStatus } from '../../../database/entities/Booking.entity';

/**
 * Schema and DTO for updating activity status.
 * Can be used to update any status including COMPLETED.
 */
export const updateActivityStatusSchema = z.object({
  status: z.nativeEnum(BookingActivityStatus),
  notes: z
    .string()
    .optional()
    .describe('Optional notes, especially useful when completing an activity'),
});

export type UpdateActivityStatusDtoType = z.infer<
  typeof updateActivityStatusSchema
>;

export class UpdateActivityStatusDto extends createZodDto(
  updateActivityStatusSchema,
) {}
