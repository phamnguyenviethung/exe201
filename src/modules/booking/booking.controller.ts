import { RequestWithUser } from '@/share/types/request.type';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
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
  ApiBody,
} from '@nestjs/swagger';
import { BookingStatus } from '../../database/entities/Booking.entity';
import { ClerkAuthGuard } from '../auth/guard/clerk.guard';
import { CreateBookingActivityDto } from './dtos/create-booking-activity.dto';
import { BookingService } from './services/booking.service';
import { UpdateActivityStatusDto } from './dtos/update-activity-status.dto';
import { CompleteActivityDto } from './dtos/complete-activity.dto';
import { BookingHistoryResponseDto } from './dtos/booking-history.dto';
import { AssignStaffDto } from './dtos/create-booking.dto';

@ApiTags('Bookings')
@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get('history')
  @ApiOperation({ summary: 'Get booking history' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'The booking history has been successfully retrieved.',
    type: BookingHistoryResponseDto,
  })
  @UseGuards(ClerkAuthGuard)
  async getBookingHistory(
    @Request() req: RequestWithUser,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.bookingService.getBookingHistory(req.user.id, page, limit);
  }

  @Post(':id/activities')
  @ApiOperation({ summary: 'Create a new booking activity' })
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiResponse({
    status: 201,
    description: 'The booking activity has been successfully created.',
  })
  async createBookingActivity(
    @Param('id') id: string,
    @Body() createBookingActivityDto: CreateBookingActivityDto,
  ) {
    return this.bookingService.createBookingActivity(
      id,
      createBookingActivityDto,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a booking by ID' })
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiResponse({
    status: 200,
    description: 'The booking has been successfully retrieved.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Booking not found.' })
  async getBooking(@Param('id') id: string) {
    return this.bookingService.getBookingById(id);
  }

  @Get(':id/activities')
  @ApiOperation({ summary: 'Get all activities for a booking' })
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiResponse({
    status: 200,
    description: 'The booking activities have been successfully retrieved.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Booking not found.' })
  async getBookingActivities(@Param('id') id: string) {
    return this.bookingService.getBookingActivities(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update booking status' })
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiResponse({
    status: 200,
    description: 'The booking status has been successfully updated.',
  })
  @UseGuards(ClerkAuthGuard)
  async updateBookingStatus(
    @Param('id') id: string,
    @Body('status') status: BookingStatus,
  ) {
    return this.bookingService.updateBookingStatus(id, status);
  }

  @Patch(':id/complete')
  @ApiOperation({
    summary: 'Complete a booking',
    description: 'Sets the booking status to CONFIRMED',
  })
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiResponse({
    status: 200,
    description: 'The booking has been successfully completed.',
  })
  @UseGuards(ClerkAuthGuard)
  async completeBooking(
    @Param('id') id: string,
    @Body() completeDto: CompleteActivityDto,
  ) {
    return this.bookingService.completeBooking(id, completeDto.notes);
  }

  @Patch(':bookingId/activities/:activityId/status')
  @ApiOperation({
    summary: 'Update activity status',
    description:
      'Updates the status of an activity, including setting it to COMPLETED',
  })
  @ApiParam({ name: 'bookingId', description: 'Booking ID' })
  @ApiParam({ name: 'activityId', description: 'Activity ID' })
  @ApiResponse({
    status: 200,
    description: 'The activity status has been successfully updated.',
  })
  @UseGuards(ClerkAuthGuard)
  async updateActivityStatus(
    @Param('bookingId') bookingId: string,
    @Param('activityId') activityId: string,
    @Body() updateStatusDto: UpdateActivityStatusDto,
  ) {
    return this.bookingService.updateActivityStatus(
      bookingId,
      activityId,
      updateStatusDto.status,
      updateStatusDto.notes,
    );
  }

  @Delete(':bookingId/activities/:activityId')
  @ApiOperation({ summary: 'Delete an activity' })
  @ApiParam({ name: 'bookingId', description: 'Booking ID' })
  @ApiParam({ name: 'activityId', description: 'Activity ID' })
  @ApiResponse({
    status: 200,
    description: 'The activity has been successfully deleted.',
  })
  @UseGuards(ClerkAuthGuard)
  async deleteActivity(
    @Param('bookingId') bookingId: string,
    @Param('activityId') activityId: string,
  ) {
    return this.bookingService.deleteActivity(bookingId, activityId);
  }

  @Patch(':id/assign-staff')
  @ApiOperation({ summary: 'Assign staff to a booking' })
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiBody({ type: AssignStaffDto })
  @ApiResponse({
    status: 200,
    description: 'Staff has been successfully assigned to the booking.',
  })
  async assignStaff(@Param('id') id: string, @Body() dto: AssignStaffDto) {
    return this.bookingService.assignStaff(id, dto.staffId);
  }
}
