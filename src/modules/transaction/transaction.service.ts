import { Injectable, Logger } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { Transaction } from '@/database/entities/Transaction.entity';
import { QueryTransactionsDto } from './dto/transaction.dto';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);

  constructor(private readonly em: EntityManager) {}

  async getTransactionById(id: string): Promise<Transaction> {
    return this.em.findOneOrFail(Transaction, { id });
  }

  private async getTransactionsWithPagination(
    query: QueryTransactionsDto,
    where: any = {},
  ) {
    const { page, limit, startDate, endDate, status, action } = query;

    if (startDate) {
      where.createdAt = { $gte: new Date(startDate) };
    }

    if (endDate) {
      where.createdAt = { ...where.createdAt, $lte: new Date(endDate) };
    }

    if (status) {
      where.status = status;
    }

    if (action) {
      where.action = action;
    }

    const [items, total] = await this.em.findAndCount(Transaction, where, {
      limit,
      offset: (page - 1) * limit,
      orderBy: { createdAt: 'DESC' },
    });

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Admin: Get all transactions with filtering and pagination
  async getAllTransactions(query: QueryTransactionsDto) {
    return this.getTransactionsWithPagination(query);
  }

  // User: Get my transactions with filtering and pagination
  async getMyTransactions(customerId: string, query: QueryTransactionsDto) {
    return this.getTransactionsWithPagination(query, { customer: customerId });
  }
}
