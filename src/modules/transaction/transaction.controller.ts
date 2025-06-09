import { RequestWithUser } from '@/share/types/request.type';
import {
  Controller,
  Get,
  Param,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ClerkAuthGuard } from '../auth/guard/clerk.guard';
import { TransactionService } from './transaction.service';
import {
  QueryTransactionsDto,
  TransactionListResponseDto,
  TransactionResponseDto,
} from './dto/transaction.dto';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get('statistics/revenue')
  @ApiOperation({ summary: 'Get revenue statistics by time period' })
  @ApiQuery({
    name: 'period',
    enum: ['day', 'week', 'month', 'year'],
    required: true,
  })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiResponse({
    status: 200,
    description: 'Revenue statistics',
  })
  async getRevenueStatistics(
    @Query('period') period: 'day' | 'week' | 'month' | 'year',
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.transactionService.getRevenueStatistics(
      period,
      startDate,
      endDate,
    );
  }

  @Get('statistics/summary')
  @ApiOperation({ summary: 'Get transaction summary statistics' })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiResponse({
    status: 200,
    description: 'Transaction summary statistics',
  })
  async getTransactionSummary(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.transactionService.getTransactionSummary(startDate, endDate);
  }

  @Get('me')
  @ApiOperation({ summary: "Get current user's transaction history" })
  @ApiResponse({
    status: 200,
    description: "User's transaction history",
    type: TransactionListResponseDto,
  })
  @UseGuards(ClerkAuthGuard)
  async getMyTransactions(
    @Request() req: RequestWithUser,
    @Query() query: QueryTransactionsDto,
  ) {
    return this.transactionService.getMyTransactions(req.user.id, query);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: "Get a specific user's transaction history" })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: "User's transaction history",
    type: TransactionListResponseDto,
  })
  async getUserTransactions(
    @Param('userId') userId: string,
    @Query() query: QueryTransactionsDto,
  ) {
    return this.transactionService.getMyTransactions(userId, query);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all transactions with filtering and pagination',
  })
  @ApiResponse({
    status: 200,
    description: 'List of transactions',
    type: TransactionListResponseDto,
  })
  async getAllTransactions(@Query() query: QueryTransactionsDto) {
    return this.transactionService.getAllTransactions(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get transaction by ID' })
  @ApiParam({ name: 'id', description: 'Transaction ID' })
  @ApiResponse({
    status: 200,
    description: 'Transaction details',
    type: TransactionResponseDto,
  })
  async getTransactionById(@Param('id') id: string) {
    return this.transactionService.getTransactionById(id);
  }
}
