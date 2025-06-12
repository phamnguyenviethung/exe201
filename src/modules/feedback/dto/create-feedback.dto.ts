import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { FeedbackRating } from '../../../database/entities/feedback.entity';

export const createFeedbackSchema = z.object({
  comment: z.string().min(10).max(500),
  rating: z.nativeEnum(FeedbackRating),
});

export class CreateFeedbackDto extends createZodDto(createFeedbackSchema) {}

export const replyFeedbackSchema = z.object({
  reply: z.string().min(1).max(500),
});

export class ReplyFeedbackDto extends createZodDto(replyFeedbackSchema) {}

export type CreateFeedbackType = z.infer<typeof createFeedbackSchema>;
export type ReplyFeedbackType = z.infer<typeof replyFeedbackSchema>;
