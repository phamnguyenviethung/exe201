import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CustomerService } from './customer.service';
import {
  CustomerStatisticsQueryDTO,
  CustomerStatisticsResDTO,
} from './dtos/statistics.dto';

@ApiTags('Statistics')
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly customerService: CustomerService) {}

  @Get('customers')
  @ApiOperation({ summary: 'Get customer statistics by week or month' })
  @ApiResponse({
    status: 200,
    description: 'Customer statistics retrieved successfully',
    type: CustomerStatisticsResDTO,
  })
  async getCustomerStatistics(@Query() query: CustomerStatisticsQueryDTO) {
    return this.customerService.getCustomerStatistics(query);
  }
}
