import { Injectable, Logger } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { Transaction } from '@/database/entities/Transaction.entity';
import { QueryTransactionsDto } from './dto/transaction.dto';
import { TransactionAction, TransactionStatus } from './enums';
import * as dayjs from 'dayjs';
import * as isoWeek from 'dayjs/plugin/isoWeek';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';

// Extend dayjs with plugins
dayjs.extend(isoWeek);
dayjs.extend(customParseFormat);

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
      where.createdAt = { $gte: dayjs(startDate).toDate() };
    }

    if (endDate) {
      where.createdAt = { ...where.createdAt, $lte: dayjs(endDate).toDate() };
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

  /**
   * Get revenue statistics grouped by the specified time period
   */
  async getRevenueStatistics(
    period: 'day' | 'week' | 'month' | 'year',
    startDate?: string,
    endDate?: string,
  ) {
    // Set default date range if not provided
    const end = endDate ? dayjs(endDate) : dayjs();
    const start = startDate
      ? dayjs(startDate)
      : end.subtract(1, period === 'day' ? 'month' : 'year');

    // Only include successful transactions
    const where = {
      createdAt: { $gte: start.toDate(), $lte: end.toDate() },
      status: TransactionStatus.SUCCESS,
    };

    // Get all transactions in the date range
    const transactions = await this.em.find(Transaction, where, {
      orderBy: { createdAt: 'ASC' },
    });

    // Group transactions by the specified time period
    const groupedData: Record<
      string,
      {
        total: number;
        count: number;
        deposit: number;
        booking: number;
      }
    > = {};

    transactions.forEach((transaction) => {
      let periodKey: string;
      const date = dayjs(transaction.createdAt);

      switch (period) {
        case 'day':
          periodKey = date.format('YYYY-MM-DD');
          break;
        case 'week':
          periodKey = `${date.year()}-W${date.isoWeek()}`;
          break;
        case 'month':
          periodKey = date.format('YYYY-MM');
          break;
        case 'year':
          periodKey = date.format('YYYY');
          break;
      }

      if (!groupedData[periodKey]) {
        groupedData[periodKey] = {
          total: 0,
          count: 0,
          deposit: 0,
          booking: 0,
        };
      }

      groupedData[periodKey].total += transaction.amount;
      groupedData[periodKey].count += 1;

      // Track by transaction type
      if (transaction.action === TransactionAction.DEPOSIT) {
        groupedData[periodKey].deposit += transaction.amount;
      } else if (transaction.action === TransactionAction.BOOKING) {
        groupedData[periodKey].booking += transaction.amount;
      }
    });

    // Convert to array and sort by period
    const result = Object.entries(groupedData).map(([period, stats]) => ({
      period,
      ...stats,
    }));

    // Sort result by period
    result.sort((a, b) => a.period.localeCompare(b.period));

    return {
      startDate: start.toDate(),
      endDate: end.toDate(),
      data: result,
      summary: {
        totalRevenue: result.reduce((sum, item) => sum + item.total, 0),
        totalCount: result.reduce((sum, item) => sum + item.count, 0),
        totalDeposit: result.reduce((sum, item) => sum + item.deposit, 0),
        totalBooking: result.reduce((sum, item) => sum + item.booking, 0),
      },
    };
  }

  /**
   * Get transaction summary statistics
   */
  async getTransactionSummary(startDate?: string, endDate?: string) {
    // Set default date range if not provided
    const end = endDate ? dayjs(endDate) : dayjs();
    const start = startDate ? dayjs(startDate) : end.subtract(1, 'month');

    // Calculate overall statistics
    const where = {
      createdAt: { $gte: start.toDate(), $lte: end.toDate() },
    };

    // Get count and sum of successful transactions
    const [successTransactions, totalSuccess] = await this.em.findAndCount(
      Transaction,
      {
        ...where,
        status: TransactionStatus.SUCCESS,
      },
    );

    // Get count of pending transactions
    const [, totalPending] = await this.em.findAndCount(Transaction, {
      ...where,
      status: TransactionStatus.PENDING,
    });

    // Get count of failed transactions
    const [, totalFailed] = await this.em.findAndCount(Transaction, {
      ...where,
      status: TransactionStatus.FAILED,
    });

    // Calculate total revenue from successful transactions
    const totalRevenue = successTransactions.reduce(
      (sum, tx) => sum + tx.amount,
      0,
    );

    // Group by transaction action
    const depositTransactions = successTransactions.filter(
      (tx) => tx.action === TransactionAction.DEPOSIT,
    );
    const bookingTransactions = successTransactions.filter(
      (tx) => tx.action === TransactionAction.BOOKING,
    );

    const totalDepositAmount = depositTransactions.reduce(
      (sum, tx) => sum + tx.amount,
      0,
    );
    const totalBookingAmount = bookingTransactions.reduce(
      (sum, tx) => sum + tx.amount,
      0,
    );

    // Get unique customer count
    const uniqueCustomerIds = new Set(
      successTransactions.map((tx) => tx.customer.id),
    );

    return {
      period: {
        startDate: start.toDate(),
        endDate: end.toDate(),
      },
      transactions: {
        total: totalSuccess + totalPending + totalFailed,
        success: totalSuccess,
        pending: totalPending,
        failed: totalFailed,
      },
      revenue: {
        total: totalRevenue,
        deposit: totalDepositAmount,
        booking: totalBookingAmount,
      },
      customers: {
        uniqueCount: uniqueCustomerIds.size,
      },
    };
  }
}
