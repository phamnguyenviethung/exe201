import { Plan } from '@/database/entities/Booking.entity';
import { EntityManager } from '@mikro-orm/core';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePlanDto, UpdatePlanDto } from '../dto/plan.dto';
import { Transactional } from '@mikro-orm/core';

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

  @Transactional()
  async createPlan(dto: CreatePlanDto): Promise<Plan> {
    const plan = this.em.create(Plan, dto);
    await this.em.persistAndFlush(plan);
    return plan;
  }

  @Transactional()
  async updatePlan(id: string, dto: UpdatePlanDto): Promise<Plan> {
    const plan = await this.getPlanById(id);
    this.em.assign(plan, dto);
    await this.em.flush();
    return plan;
  }

  @Transactional()
  async deletePlan(id: string): Promise<void> {
    const plan = await this.getPlanById(id);
    await this.em.removeAndFlush(plan);
  }
}
