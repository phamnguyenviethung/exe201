import { Injectable, Logger } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import * as dayjs from 'dayjs';
import * as isoWeek from 'dayjs/plugin/isoWeek';
import { BookingStatisticsQueryDTO } from '../dtos/statistics.dto';
import {
  Booking,
  BookingActivity,
  BookingActivityStatus,
  PlanFor,
} from '@/database/entities/Booking.entity';

// Extend dayjs with plugins
dayjs.extend(isoWeek);

@Injectable()
export class StatisticsService {
  private readonly logger = new Logger(StatisticsService.name);

  constructor(private readonly em: EntityManager) {}

  /**
   * Get booking statistics by period (week or month)
   */
  async getBookingStatistics(query: BookingStatisticsQueryDTO) {
    const { period, startDate, endDate } = query;

    // Set default date range if not provided
    const end = endDate ? dayjs(endDate) : dayjs();
    const start = startDate
      ? dayjs(startDate)
      : end.subtract(period === 'week' ? 3 : 6, period);

    // Get all bookings in the date range
    const bookings = await this.em.find(
      Booking,
      {
        createdAt: { $gte: start.toDate(), $lte: end.toDate() },
      },
      { populate: ['plan'] },
    );

    // Get all booking activities in the date range
    const activities = await this.em.find(BookingActivity, {
      startAt: { $gte: start.toDate(), $lte: end.toDate() },
    });

    // Group data by period
    const groupedData: Record<
      string,
      {
        totalBookings: number;
        reviewCVBookings: number;
        mockInterviewBookings: number;
        completedActivities: number;
        upcomingActivities: number;
      }
    > = {};

    // Initialize periods
    const periodFormat = period === 'week' ? 'YYYY-[W]WW' : 'YYYY-MM';
    let currentDate = start.clone();

    while (currentDate.isBefore(end) || currentDate.isSame(end, period)) {
      const periodKey = currentDate.format(periodFormat);
      groupedData[periodKey] = {
        totalBookings: 0,
        reviewCVBookings: 0,
        mockInterviewBookings: 0,
        completedActivities: 0,
        upcomingActivities: 0,
      };
      currentDate = currentDate.add(1, period);
    }

    // Process bookings
    bookings.forEach((booking) => {
      const date = dayjs(booking.createdAt);
      const periodKey = date.format(periodFormat);

      if (groupedData[periodKey]) {
        groupedData[periodKey].totalBookings += 1;

        // Count by plan type
        if (booking.plan.for === PlanFor.REVIEW_CV) {
          groupedData[periodKey].reviewCVBookings += 1;
        } else if (booking.plan.for === PlanFor.MOCK_INTERVIEW) {
          groupedData[periodKey].mockInterviewBookings += 1;
        }
      }
    });

    // Process activities
    activities.forEach((activity) => {
      const date = dayjs(activity.startAt);
      const periodKey = date.format(periodFormat);

      if (groupedData[periodKey]) {
        if (activity.status === BookingActivityStatus.COMPLETED) {
          groupedData[periodKey].completedActivities += 1;
        } else if (activity.status === BookingActivityStatus.UPCOMING) {
          groupedData[periodKey].upcomingActivities += 1;
        }
      }
    });

    // Convert to array and format
    const data = Object.entries(groupedData).map(([period, stats]) => ({
      period,
      ...stats,
    }));

    // Sort by period
    data.sort((a, b) => a.period.localeCompare(b.period));

    // Calculate summary statistics
    let totalBookings = 0;
    let totalReviewCVBookings = 0;
    let totalMockInterviewBookings = 0;
    let totalCompletedActivities = 0;
    let totalUpcomingActivities = 0;

    data.forEach((item) => {
      totalBookings += item.totalBookings;
      totalReviewCVBookings += item.reviewCVBookings;
      totalMockInterviewBookings += item.mockInterviewBookings;
      totalCompletedActivities += item.completedActivities;
      totalUpcomingActivities += item.upcomingActivities;
    });

    return {
      summary: {
        totalBookings,
        totalReviewCVBookings,
        totalMockInterviewBookings,
        totalCompletedActivities,
        totalUpcomingActivities,
        period: {
          startDate: start.toDate(),
          endDate: end.toDate(),
        },
      },
      data,
    };
  }
}
