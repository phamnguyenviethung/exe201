import {
  DepositTransactionReqDTO,
  DepositTransactionResDTO,
} from '../dtos/transaction.dto';
import { CustomerStatisticsQueryDTO } from '../dtos/statistics.dto';
import { Customer } from '@/database/entities/Account.entity';

export interface ICustomerService {
  createDepositPaymentLink(
    params: DepositParams,
  ): Promise<DepositTransactionResDTO>;
  processDepositTransaction(transactionID: string): Promise<void>;
  getAllCustomers(): Promise<Customer[]>;
  getCustomerStatistics(query: CustomerStatisticsQueryDTO): Promise<any>;
}

export enum ClerkWebhookType {
  UserCreated = 'user.created',
  UserUpdated = 'user.updated',
  UserDeleted = 'user.deleted',
}

export interface DepositParams {
  ip: string;
  host: string;
  dto: DepositTransactionReqDTO;
  userID: string;
}

export interface ClerkWebhookPayload {
  type: ClerkWebhookType;
  data: {
    id: string;
    first_name: string;
    last_name: string;
    gender: string;
    birthday: string;
    email_addresses: {
      email_address: string;
    }[];
    image_url: string;
    username: string;
    public_metadata: Record<string, any>;
    private_metadata: Record<string, any>;
    unsafe_metadata: Record<string, any>;
  };
}
