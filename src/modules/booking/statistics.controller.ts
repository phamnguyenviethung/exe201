import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  BookingStatisticsQueryDTO,
  BookingStatisticsResDTO,
} from './dtos/statistics.dto';
import { StatisticsService } from './services/statistics.service';

@ApiTags('Statistics')
@Controller('statistics')
export class BookingStatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('bookings')
  @ApiOperation({ summary: 'Get booking statistics by week or month' })
  @ApiResponse({
    status: 200,
    description: 'Booking statistics retrieved successfully',
    type: BookingStatisticsResDTO,
  })
  async getBookingStatistics(@Query() query: BookingStatisticsQueryDTO) {
    return this.statisticsService.getBookingStatistics(query);
  }
}
