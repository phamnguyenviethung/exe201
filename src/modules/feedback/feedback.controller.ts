import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { FeedbackService } from './feedback.service';
import { ClerkAuthGuard } from '../auth/guard/clerk.guard';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post('booking/:bookingId')
  @UseGuards(ClerkAuthGuard)
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
}
