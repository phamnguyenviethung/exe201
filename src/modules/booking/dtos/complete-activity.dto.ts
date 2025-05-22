import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

/**
 * DTO for completing an activity.
 * When an activity is completed, the activity status is set to COMPLETED
 * and the associated booking status is automatically updated to CONFIRMED.
 */
export const completeActivitySchema = z.object({
  notes: z
    .string()
    .optional()
    .describe('Optional notes about the completed activity'),
});

export type CompleteActivityDtoType = z.infer<typeof completeActivitySchema>;

export class CompleteActivityDto extends createZodDto(completeActivitySchema) {}
