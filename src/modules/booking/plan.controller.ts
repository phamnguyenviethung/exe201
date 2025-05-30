import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PlanService } from './services/plan.service';
import { CreatePlanDto, PlanResponseDto, UpdatePlanDto } from './dto/plan.dto';
import { Plan } from '@/database/entities/Booking.entity';

@ApiTags('Plans')
@Controller('plans')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Get()
  @ApiOperation({ summary: 'Get all plans' })
  @ApiResponse({
    status: 200,
    description: 'The plans have been successfully retrieved.',
    type: [PlanResponseDto],
  })
  async getPlans(): Promise<Plan[]> {
    return this.planService.getPlans();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a plan by id' })
  @ApiResponse({
    status: 200,
    description: 'The plan has been successfully retrieved.',
    type: PlanResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Plan not found.',
  })
  async getPlanById(@Param('id') id: string): Promise<Plan> {
    return this.planService.getPlanById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new plan' })
  @ApiResponse({
    status: 201,
    description: 'The plan has been successfully created.',
    type: PlanResponseDto,
  })
  async createPlan(@Body() dto: CreatePlanDto): Promise<Plan> {
    return this.planService.createPlan(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a plan' })
  @ApiResponse({
    status: 200,
    description: 'The plan has been successfully updated.',
    type: PlanResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Plan not found.',
  })
  async updatePlan(
    @Param('id') id: string,
    @Body() dto: UpdatePlanDto,
  ): Promise<Plan> {
    return this.planService.updatePlan(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a plan' })
  @ApiResponse({
    status: 200,
    description: 'The plan has been successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'Plan not found.',
  })
  async deletePlan(@Param('id') id: string): Promise<void> {
    return this.planService.deletePlan(id);
  }
}
