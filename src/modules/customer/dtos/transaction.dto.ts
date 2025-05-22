import { GatewayName } from '@/modules/payment/enums/gatewayName';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const DepositTransactionReqSchema = z.object({
  amount: z.number().min(10000).max(100000000),
  gateway: z.nativeEnum(GatewayName),
  returnUrl: z.string().url(),
});

export const DepositTransactionResSchema = z.object({
  paymentUrl: z.string().url(),
  transactionID: z.string(),
});

export class DepositTransactionReqDTO extends createZodDto(
  DepositTransactionReqSchema,
) {}

export class DepositTransactionResDTO extends createZodDto(
  DepositTransactionResSchema,
) {}
