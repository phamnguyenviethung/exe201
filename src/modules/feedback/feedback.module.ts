import { Module } from '@nestjs/common';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Feedback } from '../../database/entities/feedback.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Feedback])],
  controllers: [FeedbackController],
  providers: [FeedbackService],
  exports: [FeedbackService],
})
export class FeedbackModule {}
