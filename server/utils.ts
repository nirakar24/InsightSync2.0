import { db } from './db';
import { and, between, eq, sql } from 'drizzle-orm';
import { sales, customers } from '@shared/schema';

export async function calculateRevenue(startDate: Date, endDate: Date) {
  const result = await db.select({
    total: sql<number>`sum(amount)`,
    count: sql<number>`count(*)`,
  }).from(sales)
    .where(
      between(sales.date, startDate, endDate)
    );

  const { total = 0, count = 0 } = result[0] || {};
  
  return {
    total,
    averageOrderValue: count > 0 ? total / count : 0,
  };
}

export async function calculateChurnRate(startDate: Date, endDate: Date) {
  // Get total customers at start date
  const startCustomers = await db.select({
    count: sql<number>`count(*)`
  }).from(customers)
    .where(
      sql`created_at <= ${startDate}`
    );

  // Get churned customers in date range
  const churnedCustomers = await db.select({
    count: sql<number>`count(*)`
  }).from(customers)
    .where(
      and(
        between(customers.churnedAt, startDate, endDate),
        sql`churned = true`
      )
    );

  const totalCustomers = startCustomers[0]?.count || 0;
  const churned = churnedCustomers[0]?.count || 0;

  return {
    totalCustomers,
    churnedCustomers: churned,
    churnRate: totalCustomers > 0 ? churned / totalCustomers : 0,
    retentionRate: totalCustomers > 0 ? (totalCustomers - churned) / totalCustomers : 0,
  };
} 