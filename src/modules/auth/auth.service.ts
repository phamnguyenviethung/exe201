import {
  Account,
  AccountRole,
  Admin,
  Customer,
  Staff,
} from '@/database/entities/Account.entity';
import { EntityManager, Transactional } from '@mikro-orm/core';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ClerkWebhookPayload } from '../customer/interfaces';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly CLERK_ENDPOINT = `https://api.clerk.com/v1`;

  constructor(
    private readonly em: EntityManager,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

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

  async createTestToken(email: string) {
    const account = await this.em.findOne(Account, {
      email,
    });

    if (!account) {
      throw new BadRequestException('Account not found');
    }

    const sk = this.configService.get('CLERK_SECRET_KEY');

    const response = await this.httpService.axiosRef.post(
      `${this.CLERK_ENDPOINT}/sessions`,
      {
        user_id: account.id,
        expires_in_seconds: 2592000,
      },
      {
        headers: {
          Authorization: `Bearer ${sk}`,
        },
      },
    );

    const sid = response.data.id;

    const tokenRes = await this.httpService.axiosRef.post(
      `${this.CLERK_ENDPOINT}/sessions/${sid}/tokens/default`,
      {},
      {
        headers: {
          Authorization: `Bearer ${sk}`,
        },
      },
    );

    return tokenRes.data.jwt;
  }
}
