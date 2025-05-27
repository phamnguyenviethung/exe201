import {
  Account,
  AccountRole,
  Admin,
  Customer,
  Staff,
} from '@/database/entities/Account.entity';
import { EntityManager, Transactional } from '@mikro-orm/core';
import { Injectable, Logger } from '@nestjs/common';
import { ClerkWebhookPayload } from '../customer/interfaces';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(private readonly em: EntityManager) {}

  @Transactional()
  async synCustomerFromClerkWebhook(data: ClerkWebhookPayload): Promise<void> {
    const role = data.data.unsafe_metadata.role || AccountRole.USER;

    this.logger.log(
      `Syncing ${role} ${data.data.email_addresses[0].email_address}`,
    );

    const account = await this.em.upsert(Account, {
      id: data.data.id,
      firstName: data.data.first_name,
      lastName: data.data.last_name,
      email: data.data.email_addresses[0].email_address,
      role,
    });

    const entity =
      role === AccountRole.ADMIN
        ? Admin
        : role === AccountRole.STAFF
          ? Staff
          : Customer;

    await this.em.upsert(entity, {
      id: data.data.id,
      account,
    });

    this.logger.log(
      `${role} ${data.data.email_addresses[0].email_address} synced`,
    );
  }
}
