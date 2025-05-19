import { Injectable, Logger } from '@nestjs/common';
import { ClerkWebhookPayload, ICustomerService } from './interfaces';
import { EntityManager } from '@mikro-orm/core';
import { Customer } from '@/database/entities/Customer.entity';

@Injectable()
export class CustomerService implements ICustomerService {
  private readonly logger = new Logger(CustomerService.name);

  constructor(private readonly em: EntityManager) {}

  async synCustomerFromClerkWebhook(data: ClerkWebhookPayload): Promise<void> {
    this.logger.log(`Syncing customer ${data.data.id}`);

    await this.em.upsert(Customer, {
      id: data.data.id,
      firstName: data.data.first_name,
      lastName: data.data.last_name,
      email: data.data.email_addresses[0].email_address,
    });

    this.logger.log(`Customer ${data.data.id} synced`);
  }
}
