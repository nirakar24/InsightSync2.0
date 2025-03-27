import { pgTable, text, serial, integer, boolean, timestamp, numeric, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Customer schema
export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  companyName: text("company_name").notNull(),
  phone: text("phone"),
  status: text("status").default("active"),
  totalSpent: numeric("total_spent").default("0"),
  lastOrderDate: date("last_order_date"),
  avatar: text("avatar"),
});

export const insertCustomerSchema = createInsertSchema(customers).omit({
  id: true,
});

// Product schema
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  price: numeric("price").notNull(),
  currency: text("currency").default("INR"),
  status: text("status").default("active"),
  icon: text("icon"),
  trend: numeric("trend").default("0"), // Percentage trend
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
});

// Deal schema (for sales pipeline)
export const deals = pgTable("deals", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").notNull(),
  title: text("title").notNull(),
  companyName: text("company_name").notNull(),
  stage: text("stage").notNull(), // lead, qualified, proposal, closed
  value: numeric("value").notNull(),
  probability: integer("probability").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertDealSchema = createInsertSchema(deals).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Support ticket schema
export const tickets = pgTable("tickets", {
  id: serial("id").primaryKey(),
  ticketId: text("ticket_id").notNull().unique(), // format: TK-XXXX
  customerId: integer("customer_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull(), // open, in progress, resolved, closed
  priority: text("priority").notNull(), // low, medium, high
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertTicketSchema = createInsertSchema(tickets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Revenue metrics for dashboard
export const revenueMetrics = pgTable("revenue_metrics", {
  id: serial("id").primaryKey(),
  month: text("month").notNull(),
  year: integer("year").notNull(),
  value: numeric("value").notNull(),
  change: numeric("change"), // Percentage change from previous period
});

export const insertRevenueMetricsSchema = createInsertSchema(revenueMetrics).omit({
  id: true,
});

// Category sales for dashboard
export const categorySales = pgTable("category_sales", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(),
  value: numeric("value").notNull(),
  percentage: numeric("percentage").notNull(),
});

export const insertCategorySalesSchema = createInsertSchema(categorySales).omit({
  id: true,
});

// Define the types
export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type Deal = typeof deals.$inferSelect;
export type InsertDeal = z.infer<typeof insertDealSchema>;

export type Ticket = typeof tickets.$inferSelect;
export type InsertTicket = z.infer<typeof insertTicketSchema>;

export type RevenueMetric = typeof revenueMetrics.$inferSelect;
export type InsertRevenueMetric = z.infer<typeof insertRevenueMetricsSchema>;

export type CategorySale = typeof categorySales.$inferSelect;
export type InsertCategorySale = z.infer<typeof insertCategorySalesSchema>;
