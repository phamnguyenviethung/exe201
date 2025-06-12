import { Body, Controller, Get, Param, Post, Request } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { FeedbackService } from './feedback.service';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post('booking/:bookingId')
  async createFeedback(
    @Param('bookingId') bookingId: string,
    @Body() createFeedbackDto: CreateFeedbackDto,
    @Request() req: any,
  ) {
    return this.feedbackService.createFeedback(
      bookingId,
      req.user.id,
      createFeedbackDto,
    );
  }

  @Get('booking/:bookingId')
  async getFeedbackByBooking(@Param('bookingId') bookingId: string) {
    return this.feedbackService.getFeedbackByBooking(bookingId);
  }

  @Get('customer')
  async getFeedbackByCustomer(@Request() req: any) {
    return this.feedbackService.getFeedbackByCustomer(req.user.id);
  }
}
