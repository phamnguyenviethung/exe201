import {
  Account,
  AccountRole,
  Admin,
  Customer,
  Staff,
} from '@/database/entities/Account.entity';
import { EntityManager, Transactional } from '@mikro-orm/core';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
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

  async getProfile(accountID: string): Promise<any> {
    const account = await this.em.findOne(Account, { id: accountID });

    if (!account) {
      throw new NotFoundException(`Account with ID ${accountID} not found`);
    }

    switch (account.role) {
      case AccountRole.USER:
        return await this.em.findOne(
          Customer,
          {
            id: account.id,
          },
          {
            populate: ['account'],
          },
        );
      case AccountRole.STAFF:
        return await this.em.findOne(
          Staff,
          {
            id: account.id,
          },
          {
            populate: ['account'],
          },
        );
      case AccountRole.ADMIN:
        return await this.em.findOne(
          Admin,
          { id: account.id },
          { populate: ['account'] },
        );
      default:
        throw new NotFoundException(`Account with ID ${accountID} not found`);
    }
  }
}
