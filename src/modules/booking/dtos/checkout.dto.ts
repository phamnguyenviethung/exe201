import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const buyReqSchema = z.object({
  planId: z.string(),
  note: z.string().optional(),
});

export class BuyPlanReqDTO extends createZodDto(buyReqSchema) {}
