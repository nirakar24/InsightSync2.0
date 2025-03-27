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
  // New fields for churn prediction and engagement
  churnRisk: numeric("churn_risk").default("0"), // 0-100 scale
  engagementScore: numeric("engagement_score").default("50"), // 0-100 scale
  lastContactDate: date("last_contact_date"),
  lifetimeValue: numeric("lifetime_value").default("0"),
  acquisitionChannel: text("acquisition_channel"),
  segment: text("segment").default("general"),
  notes: text("notes"),
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
  // New fields for product management
  stockAvailable: integer("stock_available").default(100),
  stockThreshold: integer("stock_threshold").default(10),
  salesCount: integer("sales_count").default(0),
  profitMargin: numeric("profit_margin").default("30"), // Percentage
  vendor: text("vendor"),
  launchDate: date("launch_date"),
  specifications: text("specifications"), // JSON string for product specs
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
  // New fields for lead management
  assignedTo: text("assigned_to"),
  expectedCloseDate: date("expected_close_date"),
  leadSource: text("lead_source"),
  nextFollowUp: date("next_follow_up"),
  lastActivity: timestamp("last_activity"),
  notes: text("notes"),
  dealType: text("deal_type").default("new"),
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
  // New fields for support ticket system
  assignedTo: text("assigned_to"),
  category: text("category").default("general"),
  resolvedDate: timestamp("resolved_date"),
  firstResponseTime: integer("first_response_time"), // in minutes
  resolutionTime: integer("resolution_time"), // in minutes
  satisfaction: integer("satisfaction"), // 1-5 scale
  notes: text("notes"),
});

export const insertTicketSchema = createInsertSchema(tickets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Task schema for task management
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").default("pending"), // pending, in-progress, completed, cancelled
  priority: text("priority").default("medium"), // low, medium, high
  dueDate: date("due_date"),
  assignedTo: text("assigned_to"),
  relatedTo: text("related_to"), // customer:ID, deal:ID, ticket:ID
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  completion: integer("completion").default(0), // percentage 0-100
  reminderDate: timestamp("reminder_date"),
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Team member schema for team analytics
export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").notNull(),
  department: text("department").notNull(),
  avatar: text("avatar"),
  status: text("status").default("active"),
  salesTarget: numeric("sales_target").default("0"),
  dealsWon: integer("deals_won").default(0),
  ticketsResolved: integer("tickets_resolved").default(0),
  performanceScore: numeric("performance_score").default("0"),
  joinDate: date("join_date"),
});

export const insertTeamMemberSchema = createInsertSchema(teamMembers).omit({
  id: true,
});

// Activity log schema
export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  activityType: text("activity_type").notNull(), // call, email, meeting, note
  description: text("description").notNull(),
  relatedTo: text("related_to").notNull(), // customer:ID, deal:ID, ticket:ID
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  duration: integer("duration"), // in minutes
  outcome: text("outcome"),
});

export const insertActivityLogSchema = createInsertSchema(activityLogs).omit({
  id: true,
  createdAt: true,
});

// Revenue metrics for dashboard
export const revenueMetrics = pgTable("revenue_metrics", {
  id: serial("id").primaryKey(),
  month: text("month").notNull(),
  year: integer("year").notNull(),
  value: numeric("value").notNull(),
  change: numeric("change"), // Percentage change from previous period
  // New fields for advanced metrics
  newCustomers: integer("new_customers").default(0),
  churnedCustomers: integer("churned_customers").default(0),
  mrr: numeric("mrr").default("0"), // Monthly Recurring Revenue
  expenses: numeric("expenses").default("0"),
  profit: numeric("profit").default("0"),
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
  // New fields for category analytics
  growth: numeric("growth").default("0"), // growth from previous period
  itemCount: integer("item_count").default(0),
  avgOrderValue: numeric("avg_order_value").default("0"),
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

export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;

export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;

export type ActivityLog = typeof activityLogs.$inferSelect;
export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;

export type RevenueMetric = typeof revenueMetrics.$inferSelect;
export type InsertRevenueMetric = z.infer<typeof insertRevenueMetricsSchema>;

export type CategorySale = typeof categorySales.$inferSelect;
export type InsertCategorySale = z.infer<typeof insertCategorySalesSchema>;
