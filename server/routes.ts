import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import {
  insertCustomerSchema,
  insertProductSchema,
  insertDealSchema,
  insertTicketSchema,
  insertTaskSchema,
  insertTeamMemberSchema,
  insertActivityLogSchema
} from "@shared/schema";
import { Router } from 'express';
import { prisma } from './db';
import { calculateChurnRate, calculateRevenue } from './utils';
import { format, subDays } from 'date-fns';
import { Parser } from 'json2csv';

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes prefix
  const apiPrefix = "/api";

  // Dashboard routes
  app.get(`${apiPrefix}/dashboard/revenue-metrics`, async (req, res) => {
    try {
      const metrics = await storage.getRevenueMetrics();
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch revenue metrics" });
    }
  });

  app.get(`${apiPrefix}/dashboard/category-sales`, async (req, res) => {
    try {
      const categorySales = await storage.getCategorySales();
      res.json(categorySales);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch category sales" });
    }
  });

  app.get(`${apiPrefix}/dashboard/top-products`, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 4;
      const products = await storage.getTopProducts(limit);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch top products" });
    }
  });

  app.get(`${apiPrefix}/dashboard/recent-customers`, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 4;
      const customers = await storage.getRecentCustomers(limit);
      res.json(customers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recent customers" });
    }
  });

  // Customer routes
  app.get(`${apiPrefix}/customers`, async (req, res) => {
    try {
      const customers = await storage.getCustomers();
      res.json(customers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch customers" });
    }
  });

  app.get(`${apiPrefix}/customers/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid customer ID" });
      }

      const customer = await storage.getCustomer(id);
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }

      res.json(customer);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch customer" });
    }
  });

  app.post(`${apiPrefix}/customers`, async (req, res) => {
    try {
      const customerData = insertCustomerSchema.parse(req.body);
      const newCustomer = await storage.createCustomer(customerData);
      res.status(201).json(newCustomer);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid customer data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create customer" });
    }
  });

  app.put(`${apiPrefix}/customers/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid customer ID" });
      }

      const customerData = insertCustomerSchema.partial().parse(req.body);
      const updatedCustomer = await storage.updateCustomer(id, customerData);
      
      if (!updatedCustomer) {
        return res.status(404).json({ message: "Customer not found" });
      }

      res.json(updatedCustomer);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid customer data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update customer" });
    }
  });

  app.delete(`${apiPrefix}/customers/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid customer ID" });
      }

      const deleted = await storage.deleteCustomer(id);
      if (!deleted) {
        return res.status(404).json({ message: "Customer not found" });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete customer" });
    }
  });

  // Product routes
  app.get(`${apiPrefix}/products`, async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get(`${apiPrefix}/products/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }

      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post(`${apiPrefix}/products`, async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const newProduct = await storage.createProduct(productData);
      res.status(201).json(newProduct);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  app.put(`${apiPrefix}/products/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }

      const productData = insertProductSchema.partial().parse(req.body);
      const updatedProduct = await storage.updateProduct(id, productData);
      
      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json(updatedProduct);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.delete(`${apiPrefix}/products/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }

      const deleted = await storage.deleteProduct(id);
      if (!deleted) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Deal routes
  app.get(`${apiPrefix}/deals`, async (req, res) => {
    try {
      const deals = await storage.getDeals();
      res.json(deals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch deals" });
    }
  });

  app.get(`${apiPrefix}/deals/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid deal ID" });
      }

      const deal = await storage.getDeal(id);
      if (!deal) {
        return res.status(404).json({ message: "Deal not found" });
      }

      res.json(deal);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch deal" });
    }
  });

  app.post(`${apiPrefix}/deals`, async (req, res) => {
    try {
      const dealData = insertDealSchema.parse(req.body);
      const newDeal = await storage.createDeal(dealData);
      res.status(201).json(newDeal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid deal data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create deal" });
    }
  });

  app.put(`${apiPrefix}/deals/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid deal ID" });
      }

      const dealData = insertDealSchema.partial().parse(req.body);
      const updatedDeal = await storage.updateDeal(id, dealData);
      
      if (!updatedDeal) {
        return res.status(404).json({ message: "Deal not found" });
      }

      res.json(updatedDeal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid deal data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update deal" });
    }
  });

  app.delete(`${apiPrefix}/deals/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid deal ID" });
      }

      const deleted = await storage.deleteDeal(id);
      if (!deleted) {
        return res.status(404).json({ message: "Deal not found" });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete deal" });
    }
  });

  // Ticket routes
  app.get(`${apiPrefix}/tickets`, async (req, res) => {
    try {
      const tickets = await storage.getTickets();
      res.json(tickets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tickets" });
    }
  });

  app.get(`${apiPrefix}/tickets/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ticket ID" });
      }

      const ticket = await storage.getTicket(id);
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }

      res.json(ticket);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch ticket" });
    }
  });

  app.post(`${apiPrefix}/tickets`, async (req, res) => {
    try {
      const ticketData = insertTicketSchema.parse(req.body);
      const newTicket = await storage.createTicket(ticketData);
      res.status(201).json(newTicket);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid ticket data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create ticket" });
    }
  });

  app.put(`${apiPrefix}/tickets/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ticket ID" });
      }

      const ticketData = insertTicketSchema.partial().parse(req.body);
      const updatedTicket = await storage.updateTicket(id, ticketData);
      
      if (!updatedTicket) {
        return res.status(404).json({ message: "Ticket not found" });
      }

      res.json(updatedTicket);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid ticket data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update ticket" });
    }
  });

  app.delete(`${apiPrefix}/tickets/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ticket ID" });
      }

      const deleted = await storage.deleteTicket(id);
      if (!deleted) {
        return res.status(404).json({ message: "Ticket not found" });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete ticket" });
    }
  });

  // Analytics routes for enhanced interactive features
  
  // Customer analytics
  app.get(`${apiPrefix}/analytics/customers/churn-risk`, async (req, res) => {
    try {
      const customers = await storage.getCustomersWithChurnRisk();
      res.json(customers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch customers with churn risk" });
    }
  });

  app.get(`${apiPrefix}/analytics/customers/:id/engagement`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid customer ID" });
      }

      const engagementMetrics = await storage.getCustomerEngagementMetrics(id);
      if (!engagementMetrics) {
        return res.status(404).json({ message: "Customer not found" });
      }

      res.json(engagementMetrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch customer engagement metrics" });
    }
  });

  // Product analytics
  app.get(`${apiPrefix}/analytics/products/inventory`, async (req, res) => {
    try {
      const inventory = await storage.getProductInventory();
      res.json(inventory);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product inventory" });
    }
  });

  app.get(`${apiPrefix}/analytics/products/:id/performance`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }

      const performance = await storage.getProductPerformance(id);
      if (!performance) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json(performance);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product performance metrics" });
    }
  });

  // Deal analytics
  app.get(`${apiPrefix}/analytics/deals/by-stage/:stage`, async (req, res) => {
    try {
      const stage = req.params.stage;
      const deals = await storage.getDealsByStage(stage);
      res.json(deals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch deals by stage" });
    }
  });

  app.get(`${apiPrefix}/analytics/deals/by-assignee/:assignee`, async (req, res) => {
    try {
      const assignee = req.params.assignee;
      const deals = await storage.getDealsByAssignee(assignee);
      res.json(deals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch deals by assignee" });
    }
  });

  // Dashboard advanced analytics
  app.get(`${apiPrefix}/analytics/dashboard/churn-metrics`, async (req, res) => {
    try {
      const metrics = await storage.getChurnMetrics();
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch churn metrics" });
    }
  });

  app.get(`${apiPrefix}/analytics/dashboard/team-analytics`, async (req, res) => {
    try {
      const analytics = await storage.getTeamAnalytics();
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch team analytics" });
    }
  });

  app.get(`${apiPrefix}/analytics/dashboard/sales-performance`, async (req, res) => {
    try {
      const performance = await storage.getSalesPerformance();
      res.json(performance);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sales performance metrics" });
    }
  });

  // Team members routes
  app.get(`${apiPrefix}/team-members`, async (req, res) => {
    try {
      const members = await storage.getTeamMembers();
      res.json(members);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch team members" });
    }
  });

  app.get(`${apiPrefix}/team-members/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid team member ID" });
      }

      const member = await storage.getTeamMember(id);
      if (!member) {
        return res.status(404).json({ message: "Team member not found" });
      }

      res.json(member);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch team member" });
    }
  });

  app.post(`${apiPrefix}/team-members`, async (req, res) => {
    try {
      const memberData = insertTeamMemberSchema.parse(req.body);
      const newMember = await storage.createTeamMember(memberData);
      res.status(201).json(newMember);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid team member data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create team member" });
    }
  });

  app.put(`${apiPrefix}/team-members/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid team member ID" });
      }

      const memberData = insertTeamMemberSchema.partial().parse(req.body);
      const updatedMember = await storage.updateTeamMember(id, memberData);
      
      if (!updatedMember) {
        return res.status(404).json({ message: "Team member not found" });
      }

      res.json(updatedMember);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid team member data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update team member" });
    }
  });

  // Export dashboard data endpoint
  app.get(`${apiPrefix}/dashboard/export`, async (req, res) => {
    try {
      const { timeRange = 'last30days' } = req.query;
      const endDate = new Date();
      let startDate;

      switch (timeRange) {
        case 'last7days':
          startDate = subDays(endDate, 7);
          break;
        case 'last90days':
          startDate = subDays(endDate, 90);
          break;
        default: // last30days
          startDate = subDays(endDate, 30);
      }

      // Fetch all required data
      const [revenue, categorySales, churnMetrics] = await Promise.all([
        calculateRevenue(startDate, endDate),
        prisma.sale.groupBy({
          by: ['category'],
          where: {
            date: {
              gte: startDate,
              lte: endDate,
            },
          },
          _sum: {
            amount: true,
          },
        }),
        calculateChurnRate(startDate, endDate),
      ]);

      // Prepare data for CSV
      const csvData = {
        revenue: revenue.total,
        averageOrderValue: revenue.averageOrderValue,
        categorySales: categorySales.map(cat => ({
          category: cat.category,
          amount: cat._sum.amount || 0,
        })),
        churnRate: churnMetrics.churnRate,
        retentionRate: churnMetrics.retentionRate,
        totalCustomers: churnMetrics.totalCustomers,
        churnedCustomers: churnMetrics.churnedCustomers,
      };

      // Convert to CSV
      const fields = [
        'Revenue',
        'Average Order Value',
        'Category Sales',
        'Churn Rate',
        'Retention Rate',
        'Total Customers',
        'Churned Customers',
      ];
      
      const parser = new Parser({ fields });
      const csv = parser.parse([{
        'Revenue': `$${csvData.revenue.toFixed(2)}`,
        'Average Order Value': `$${csvData.averageOrderValue.toFixed(2)}`,
        'Category Sales': csvData.categorySales.map(cat => `${cat.category}: $${cat.amount.toFixed(2)}`).join('; '),
        'Churn Rate': `${(csvData.churnRate * 100).toFixed(1)}%`,
        'Retention Rate': `${(csvData.retentionRate * 100).toFixed(1)}%`,
        'Total Customers': csvData.totalCustomers,
        'Churned Customers': csvData.churnedCustomers,
      }]);

      // Send CSV file
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=dashboard-report-${format(new Date(), 'yyyy-MM-dd')}.csv`);
      res.send(csv);
    } catch (error) {
      console.error('Error generating export:', error);
      res.status(500).json({ error: 'Failed to generate export' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
