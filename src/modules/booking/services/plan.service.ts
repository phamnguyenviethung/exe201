import { Plan } from '@/database/entities/Booking.entity';
import { EntityManager } from '@mikro-orm/core';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';

@Injectable()
export class PlanService {
  private readonly logger = new Logger(PlanService.name);

  constructor(private readonly em: EntityManager) {}

  async getPlanById(id: string): Promise<Plan> {
    const plan = await this.em.findOne(Plan, { id });
    if (!plan) {
      throw new NotFoundException(`Plan with id ${id} not found`);
    }
    return plan;
  }

  async getPlans(): Promise<Plan[]> {
    return this.em.find(Plan, {});
  }
}
