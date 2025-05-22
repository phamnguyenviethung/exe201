import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Plan, PlanFor } from '../entities/Booking.entity';

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const plans = [
      {
        id: '1',
        name: 'Basic',
        description: 'Basic plan',
        price: 10000,
        for: PlanFor.REVIEW_CV,
      },
      {
        id: '2',
        name: 'Pro',
        description: 'Pro plan',
        price: 20000,
        for: PlanFor.MOCK_INTERVIEW,
      },
    ];

    await em.upsertMany(Plan, plans);
  }
}
