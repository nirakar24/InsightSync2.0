import {
  Customer,
  InsertCustomer,
  Product,
  InsertProduct,
  Deal,
  InsertDeal,
  Ticket,
  InsertTicket,
  Task,
  InsertTask,
  TeamMember,
  InsertTeamMember,
  ActivityLog,
  InsertActivityLog,
  RevenueMetric,
  InsertRevenueMetric,
  CategorySale,
  InsertCategorySale,
} from "@shared/schema";

export interface IStorage {
  // Customer operations
  getCustomers(): Promise<Customer[]>;
  getCustomer(id: number): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: number, customer: Partial<InsertCustomer>): Promise<Customer | undefined>;
  deleteCustomer(id: number): Promise<boolean>;
  getCustomersWithChurnRisk(): Promise<Customer[]>; // New method for churn risk
  getCustomerEngagementMetrics(id: number): Promise<any>; // Customer engagement data

  // Product operations
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  getProductInventory(): Promise<Product[]>; // Get products with stock info
  getProductPerformance(id: number): Promise<any>; // Get product performance data

  // Deal operations
  getDeals(): Promise<Deal[]>;
  getDeal(id: number): Promise<Deal | undefined>;
  createDeal(deal: InsertDeal): Promise<Deal>;
  updateDeal(id: number, deal: Partial<InsertDeal>): Promise<Deal | undefined>;
  deleteDeal(id: number): Promise<boolean>;
  getDealsByStage(stage: string): Promise<Deal[]>; // Get deals by pipeline stage
  getDealsByAssignee(assignee: string): Promise<Deal[]>; // Get deals by team member

  // Ticket operations
  getTickets(): Promise<Ticket[]>;
  getTicket(id: number): Promise<Ticket | undefined>;
  createTicket(ticket: InsertTicket): Promise<Ticket>;
  updateTicket(id: number, ticket: Partial<InsertTicket>): Promise<Ticket | undefined>;
  deleteTicket(id: number): Promise<boolean>;
  getTicketsByStatus(status: string): Promise<Ticket[]>; // Get tickets by status
  getTicketsByAssignee(assignee: string): Promise<Ticket[]>; // Get tickets by assignee

  // Task operations
  getTasks(): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;
  getTasksByAssignee(assignee: string): Promise<Task[]>; // Get tasks by assignee
  getTasksByStatus(status: string): Promise<Task[]>; // Get tasks by status

  // Team operations
  getTeamMembers(): Promise<TeamMember[]>;
  getTeamMember(id: number): Promise<TeamMember | undefined>;
  createTeamMember(member: InsertTeamMember): Promise<TeamMember>;
  updateTeamMember(id: number, member: Partial<InsertTeamMember>): Promise<TeamMember | undefined>;
  deleteTeamMember(id: number): Promise<boolean>;
  getTeamPerformanceMetrics(): Promise<any>; // Get team performance data

  // Activity operations
  getActivityLogs(): Promise<ActivityLog[]>;
  getActivityLog(id: number): Promise<ActivityLog | undefined>;
  createActivityLog(log: InsertActivityLog): Promise<ActivityLog>;
  deleteActivityLog(id: number): Promise<boolean>;
  getActivitiesByRelation(relatedTo: string): Promise<ActivityLog[]>; // Get activities by relation

  // Dashboard metrics
  getRevenueMetrics(): Promise<RevenueMetric[]>;
  getCategorySales(): Promise<CategorySale[]>;
  getTopProducts(limit: number): Promise<Product[]>;
  getRecentCustomers(limit: number): Promise<Customer[]>;
  getChurnMetrics(): Promise<any>; // Get churn prediction metrics
  getTeamAnalytics(): Promise<any>; // Get team performance analytics
  getSalesPerformance(): Promise<any>; // Get sales performance metrics  
}

export class MemStorage implements IStorage {
  private customers: Map<number, Customer>;
  private products: Map<number, Product>;
  private deals: Map<number, Deal>;
  private tickets: Map<number, Ticket>;
  private tasks: Map<number, Task>;
  private teamMembers: Map<number, TeamMember>;
  private activityLogs: Map<number, ActivityLog>;
  private revenueMetrics: Map<number, RevenueMetric>;
  private categorySales: Map<number, CategorySale>;
  private customerCurrentId: number;
  private productCurrentId: number;
  private dealCurrentId: number;
  private ticketCurrentId: number;
  private taskCurrentId: number;
  private teamMemberCurrentId: number;
  private activityLogCurrentId: number;
  private revenueMetricCurrentId: number;
  private categorySaleCurrentId: number;

  constructor() {
    this.customers = new Map();
    this.products = new Map();
    this.deals = new Map();
    this.tickets = new Map();
    this.tasks = new Map();
    this.teamMembers = new Map();
    this.activityLogs = new Map();
    this.revenueMetrics = new Map();
    this.categorySales = new Map();
    this.customerCurrentId = 1;
    this.productCurrentId = 1;
    this.dealCurrentId = 1;
    this.ticketCurrentId = 1;
    this.taskCurrentId = 1;
    this.teamMemberCurrentId = 1;
    this.activityLogCurrentId = 1;
    this.revenueMetricCurrentId = 1;
    this.categorySaleCurrentId = 1;

    // Initialize with some sample data
    this.initSampleData();
  }

  // Customer operations
  async getCustomers(): Promise<Customer[]> {
    return Array.from(this.customers.values());
  }

  async getCustomer(id: number): Promise<Customer | undefined> {
    return this.customers.get(id);
  }

  async createCustomer(customerData: InsertCustomer): Promise<Customer> {
    const id = this.customerCurrentId++;
    const customer: Customer = { 
      ...customerData,
      id,
      phone: customerData.phone || null,
      status: customerData.status || null,
      totalSpent: customerData.totalSpent || null,
      lastOrderDate: customerData.lastOrderDate || null,
      avatar: customerData.avatar || null,
      address: customerData.address || null,
      city: customerData.city || null,
      state: customerData.state || null,
      zipCode: customerData.zipCode || null,
      country: customerData.country || null,
      notes: customerData.notes || null
    };
    this.customers.set(id, customer);
    return customer;
  }

  async updateCustomer(id: number, customerData: Partial<InsertCustomer>): Promise<Customer | undefined> {
    const existingCustomer = this.customers.get(id);
    if (!existingCustomer) return undefined;

    const updatedCustomer = { ...existingCustomer, ...customerData };
    this.customers.set(id, updatedCustomer);
    return updatedCustomer;
  }

  async deleteCustomer(id: number): Promise<boolean> {
    return this.customers.delete(id);
  }

  // Product operations
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(productData: InsertProduct): Promise<Product> {
    const id = this.productCurrentId++;
    const product: Product = { 
      ...productData, 
      id,
      status: productData.status || null,
      description: productData.description || null,
      currency: productData.currency || null,
      icon: productData.icon || null,
      trend: productData.trend || null,
      stockAvailable: productData.stockAvailable || null,
      reorderLevel: productData.reorderLevel || null,
      cost: productData.cost || null,
      supplierInfo: productData.supplierInfo || null,
      sku: productData.sku || null,
      specifications: productData.specifications || null
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: number, productData: Partial<InsertProduct>): Promise<Product | undefined> {
    const existingProduct = this.products.get(id);
    if (!existingProduct) return undefined;

    const updatedProduct = { ...existingProduct, ...productData };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }

  // Deal operations
  async getDeals(): Promise<Deal[]> {
    return Array.from(this.deals.values());
  }

  async getDeal(id: number): Promise<Deal | undefined> {
    return this.deals.get(id);
  }

  async createDeal(dealData: InsertDeal): Promise<Deal> {
    const id = this.dealCurrentId++;
    const now = new Date();
    const deal: Deal = { 
      ...dealData, 
      id,
      notes: dealData.notes || null, 
      createdAt: now,
      updatedAt: now,
      closedAt: dealData.closedAt || null,
      assignedTo: dealData.assignedTo || null,
      expectedCloseDate: dealData.expectedCloseDate || null,
      contactName: dealData.contactName || null,
      contactEmail: dealData.contactEmail || null,
      dealType: dealData.dealType || null
    };
    this.deals.set(id, deal);
    return deal;
  }

  async updateDeal(id: number, dealData: Partial<InsertDeal>): Promise<Deal | undefined> {
    const existingDeal = this.deals.get(id);
    if (!existingDeal) return undefined;

    const updatedDeal = { 
      ...existingDeal, 
      ...dealData, 
      updatedAt: new Date() 
    };
    this.deals.set(id, updatedDeal);
    return updatedDeal;
  }

  async deleteDeal(id: number): Promise<boolean> {
    return this.deals.delete(id);
  }

  // Ticket operations
  async getTickets(): Promise<Ticket[]> {
    return Array.from(this.tickets.values());
  }

  async getTicket(id: number): Promise<Ticket | undefined> {
    return this.tickets.get(id);
  }

  async createTicket(ticketData: InsertTicket): Promise<Ticket> {
    const id = this.ticketCurrentId++;
    const now = new Date();
    const ticket: Ticket = { 
      ...ticketData, 
      id,
      notes: ticketData.notes || null, 
      createdAt: now,
      updatedAt: now,
      category: ticketData.category || null,
      assignedTo: ticketData.assignedTo || null,
      dueDate: ticketData.dueDate || null,
      resolution: ticketData.resolution || null,
      attachments: ticketData.attachments || null,
      satisfaction: ticketData.satisfaction || null
    };
    this.tickets.set(id, ticket);
    return ticket;
  }

  async updateTicket(id: number, ticketData: Partial<InsertTicket>): Promise<Ticket | undefined> {
    const existingTicket = this.tickets.get(id);
    if (!existingTicket) return undefined;

    const updatedTicket = { 
      ...existingTicket, 
      ...ticketData, 
      updatedAt: new Date() 
    };
    this.tickets.set(id, updatedTicket);
    return updatedTicket;
  }

  async deleteTicket(id: number): Promise<boolean> {
    return this.tickets.delete(id);
  }

  async getTicketsByStatus(status: string): Promise<Ticket[]> {
    return Array.from(this.tickets.values()).filter(ticket => ticket.status === status);
  }

  async getTicketsByAssignee(assignee: string): Promise<Ticket[]> {
    return Array.from(this.tickets.values()).filter(ticket => ticket.assignedTo === assignee);
  }

  // Task operations
  async getTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values());
  }

  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async createTask(taskData: InsertTask): Promise<Task> {
    const id = this.taskCurrentId++;
    const now = new Date();
    const task: Task = {
      ...taskData,
      id,
      status: taskData.status || null,
      description: taskData.description || null,
      priority: taskData.priority || null,
      dueDate: taskData.dueDate || null,
      assignedTo: taskData.assignedTo || null,
      relatedTo: taskData.relatedTo || null,
      createdAt: now,
      updatedAt: now,
      completion: taskData.completion || 0,
      reminderDate: taskData.reminderDate || null
    };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: number, taskData: Partial<InsertTask>): Promise<Task | undefined> {
    const existingTask = this.tasks.get(id);
    if (!existingTask) return undefined;

    const updatedTask = {
      ...existingTask,
      ...taskData,
      updatedAt: new Date()
    };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: number): Promise<boolean> {
    return this.tasks.delete(id);
  }

  async getTasksByAssignee(assignee: string): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(task => task.assignedTo === assignee);
  }

  async getTasksByStatus(status: string): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(task => task.status === status);
  }

  // Team operations
  async getTeamMembers(): Promise<TeamMember[]> {
    return Array.from(this.teamMembers.values());
  }

  async getTeamMember(id: number): Promise<TeamMember | undefined> {
    return this.teamMembers.get(id);
  }

  async createTeamMember(memberData: InsertTeamMember): Promise<TeamMember> {
    const id = this.teamMemberCurrentId++;
    const member: TeamMember = {
      ...memberData,
      id,
      status: memberData.status || null,
      avatar: memberData.avatar || null,
      salesTarget: memberData.salesTarget || null,
      dealsWon: memberData.dealsWon || 0,
      ticketsResolved: memberData.ticketsResolved || 0,
      performanceScore: memberData.performanceScore || null,
      joinDate: memberData.joinDate || null
    };
    this.teamMembers.set(id, member);
    return member;
  }

  async updateTeamMember(id: number, memberData: Partial<InsertTeamMember>): Promise<TeamMember | undefined> {
    const existingMember = this.teamMembers.get(id);
    if (!existingMember) return undefined;

    const updatedMember = {
      ...existingMember,
      ...memberData
    };
    this.teamMembers.set(id, updatedMember);
    return updatedMember;
  }

  async deleteTeamMember(id: number): Promise<boolean> {
    return this.teamMembers.delete(id);
  }

  async getTeamPerformanceMetrics(): Promise<any> {
    const teamMembers = await this.getTeamMembers();
    // Calculate overall team metrics
    const totalDealsWon = teamMembers.reduce((sum, member) => sum + (member.dealsWon || 0), 0);
    const totalTicketsResolved = teamMembers.reduce((sum, member) => sum + (member.ticketsResolved || 0), 0);
    const averagePerformance = teamMembers.reduce((sum, member) => sum + Number(member.performanceScore || 0), 0) / (teamMembers.length || 1);

    return {
      teamSize: teamMembers.length,
      totalDealsWon,
      totalTicketsResolved,
      averagePerformance: averagePerformance.toFixed(2),
      memberPerformance: teamMembers.map(member => ({
        id: member.id,
        name: member.name,
        performance: member.performanceScore,
        dealsWon: member.dealsWon,
        ticketsResolved: member.ticketsResolved
      }))
    };
  }

  // Activity operations
  async getActivityLogs(): Promise<ActivityLog[]> {
    return Array.from(this.activityLogs.values());
  }

  async getActivityLog(id: number): Promise<ActivityLog | undefined> {
    return this.activityLogs.get(id);
  }

  async createActivityLog(logData: InsertActivityLog): Promise<ActivityLog> {
    const id = this.activityLogCurrentId++;
    const now = new Date();
    const log: ActivityLog = {
      ...logData,
      id,
      createdAt: now,
      duration: logData.duration || null,
      outcome: logData.outcome || null
    };
    this.activityLogs.set(id, log);
    return log;
  }

  async deleteActivityLog(id: number): Promise<boolean> {
    return this.activityLogs.delete(id);
  }

  async getActivitiesByRelation(relatedTo: string): Promise<ActivityLog[]> {
    // Determine if we're looking for a specific type or a specific entity
    if (relatedTo.includes(':')) {
      // Exact match for "type:id" format
      return Array.from(this.activityLogs.values()).filter(log => log.relatedTo === relatedTo);
    } else {
      // Match only the type part of the relatedTo field
      return Array.from(this.activityLogs.values()).filter(log => {
        const [entityType] = log.relatedTo.split(':');
        return entityType === relatedTo;
      });
    }
  }

  // Customer advanced operations
  async getCustomersWithChurnRisk(): Promise<Customer[]> {
    // For demo purposes, we'll mark just 1 customer (25%) as at risk
    // This will match with our 12.5% churn rate (which is half of the at-risk rate)
    // In a real system, this would use ML models or complex business rules
    
    const customers = Array.from(this.customers.values());
    
    // Mark only 1 out of 4 customers as at risk (25%)
    // This makes sense with our 12.5% churn rate
    return customers.filter((customer, index) => {
      // Just mark the first customer as being at risk for demo purposes
      return index === 0;
    });
  }

  async getCustomerEngagementMetrics(id: number): Promise<any> {
    const customer = await this.getCustomer(id);
    if (!customer) return null;

    // Get customer-related data
    const deals = Array.from(this.deals.values()).filter(deal => deal.customerId === id);
    const tickets = Array.from(this.tickets.values()).filter(ticket => ticket.customerId === id);
    const activities = Array.from(this.activityLogs.values()).filter(log => {
      const [entityType, entityId] = log.relatedTo.split(':');
      return entityType === 'customer' && parseInt(entityId) === id;
    });

    const totalSpent = Number(customer.totalSpent || 0);
    const activeDeals = deals.filter(deal => deal.stage !== 'closed' && deal.stage !== 'lost').length;
    const wonDeals = deals.filter(deal => deal.stage === 'closed').length;
    const dealValue = deals.reduce((sum, deal) => sum + Number(deal.value || 0), 0);
    const avgResponseTime = tickets.length > 0 
      ? tickets.reduce((sum, ticket) => {
          const created = ticket.createdAt ? new Date(ticket.createdAt) : new Date();
          const updated = ticket.updatedAt ? new Date(ticket.updatedAt) : new Date();
          return sum + (updated.getTime() - created.getTime()) / (1000 * 60 * 60); // hours
        }, 0) / tickets.length
      : 0;

    return {
      customerValue: {
        totalSpent,
        dealValue,
        lifetimeValue: totalSpent + dealValue
      },
      activity: {
        totalDeals: deals.length,
        activeDeals,
        wonDeals,
        totalTickets: tickets.length,
        lastActivity: activities.length > 0 
          ? formatRelativeTime(new Date(Math.max(...activities.map(a => new Date(a.createdAt || new Date()).getTime()))))
          : null,
        interactions: activities.length
      },
      support: {
        openTickets: tickets.filter(t => t.status === 'open').length,
        avgResponseTime: avgResponseTime.toFixed(2),
        satisfaction: tickets.reduce((sum, t) => sum + (t.satisfaction || 0), 0) / (tickets.length || 1)
      },
      churnRisk: {
        score: calculateChurnScore(customer, deals, tickets, activities),
        lastOrder: customer.lastOrderDate,
        factors: getChurnFactors(customer, deals, tickets)
      }
    };
  }

  // Product advanced operations
  async getProductInventory(): Promise<Product[]> {
    return Array.from(this.products.values())
      .map(product => ({
        ...product,
        stockAvailable: product.stockAvailable || 0,
        reorderLevel: product.reorderLevel || 0,
        needsRestock: (product.stockAvailable || 0) < (product.reorderLevel || 0)
      }));
  }

  async getProductPerformance(id: number): Promise<any> {
    const product = await this.getProduct(id);
    if (!product) return null;

    // Calculate product performance metrics with more meaningful numbers
    const productPrice = Number(product.price || 0);
    
    // Generate monthly sales data
    const monthlySalesData = Array.from({ length: 6 }, (_, i) => {
      const month = new Date(2023, i, 1).toLocaleString('en-US', { month: 'short' });
      // Base sales on product price - higher priced items sell fewer units
      const baseSales = Math.max(5, Math.floor(2000000 / productPrice));
      // Add some random variation but keep it reasonable
      const sales = Math.floor(baseSales * (0.8 + (Math.random() * 0.4)));
      return { month, sales };
    });
    
    // Generate monthly revenue data
    const monthlyRevenueData = monthlySalesData.map(item => ({
      month: item.month,
      revenue: Math.floor(item.sales * productPrice)
    }));
    
    // Calculate growth between last two months
    const currentMonthSales = monthlySalesData[monthlySalesData.length - 1].sales;
    const previousMonthSales = monthlySalesData[monthlySalesData.length - 2].sales;
    const salesGrowthPercent = ((currentMonthSales - previousMonthSales) / previousMonthSales * 100).toFixed(1);
    const salesGrowthNum = parseFloat(salesGrowthPercent);
    const salesGrowth = (salesGrowthNum > 0 ? '+' : '') + salesGrowthPercent + '%';
    
    // Revenue growth
    const currentMonthRevenue = monthlyRevenueData[monthlyRevenueData.length - 1].revenue;
    const previousMonthRevenue = monthlyRevenueData[monthlyRevenueData.length - 2].revenue;
    const revenueGrowthPercent = ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue * 100).toFixed(1);
    const revenueGrowthNum = parseFloat(revenueGrowthPercent);
    const revenueGrowth = (revenueGrowthNum > 0 ? '+' : '') + revenueGrowthPercent + '%';
    
    // Calculate meaningful total revenue
    const totalRevenue = monthlyRevenueData.reduce((sum, item) => sum + item.revenue, 0);
    
    // Popularity score based on trend and category
    const baseScore = product.trend ? Math.abs(parseFloat(product.trend)) * 5 : 30;
    const categoryBonus = product.category === 'Software' ? 15 : 
                         product.category === 'Support' ? 10 : 
                         product.category === 'Infrastructure' ? 8 : 5;
    const popularityScore = Math.min(95, Math.floor(baseScore + categoryBonus + Math.random() * 20));
    
    // Calculate inventory data
    const stockAvailable = product.stockAvailable || 0;
    const reorderLevel = 10; // Default if not specified
    const reserved = Math.floor(stockAvailable * 0.3); // 30% of available stock is reserved
    const backOrdered = stockAvailable < reorderLevel ? Math.floor(reorderLevel * 0.8) : 0;
    
    return {
      sales: {
        currentMonth: currentMonthSales,
        previousMonth: previousMonthSales,
        growth: salesGrowth,
        monthlyData: monthlySalesData
      },
      revenue: {
        total: totalRevenue.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }),
        growth: revenueGrowth,
        monthlyData: monthlyRevenueData
      },
      popularity: {
        score: popularityScore,
        trend: product.trend && parseFloat(product.trend) >= 0 ? '+' + product.trend + '%' : product.trend + '%',
        viewCount: Math.floor(popularityScore * 15 + Math.random() * 500),
        conversionRate: (popularityScore / 200 + 0.05).toFixed(2) + '%'
      },
      inventory: {
        inStock: stockAvailable,
        reserved: reserved,
        backOrdered: backOrdered,
        reorderLevel: reorderLevel,
        daysToRestock: backOrdered > 0 ? Math.floor(Math.random() * 14) + 3 : 0
      },
      relatedProducts: Array.from(this.products.values())
        .filter(p => p.id !== id && p.category === product.category)
        .slice(0, 3)
        .map(p => ({ id: p.id, name: p.name }))
    };
  }

  // Deal advanced operations
  async getDealsByStage(stage: string): Promise<Deal[]> {
    return Array.from(this.deals.values()).filter(deal => deal.stage === stage);
  }

  async getDealsByAssignee(assignee: string): Promise<Deal[]> {
    return Array.from(this.deals.values()).filter(deal => deal.assignedTo === assignee);
  }

  // Dashboard metrics
  async getRevenueMetrics(): Promise<RevenueMetric[]> {
    return Array.from(this.revenueMetrics.values());
  }

  async getCategorySales(): Promise<CategorySale[]> {
    return Array.from(this.categorySales.values());
  }

  async getTopProducts(limit: number): Promise<Product[]> {
    return Array.from(this.products.values())
      .sort((a, b) => Number(b.price) - Number(a.price))
      .slice(0, limit);
  }

  async getRecentCustomers(limit: number): Promise<Customer[]> {
    return Array.from(this.customers.values())
      .sort((a, b) => {
        if (!a.lastOrderDate) return 1;
        if (!b.lastOrderDate) return -1;
        return new Date(b.lastOrderDate).getTime() - new Date(a.lastOrderDate).getTime();
      })
      .slice(0, limit);
  }

  async getChurnMetrics(): Promise<any> {
    const customers = Array.from(this.customers.values());
    const totalCustomers = customers.length;
    const atRiskCustomers = await this.getCustomersWithChurnRisk();
    
    // Set a churn rate that's consistent with our at-risk customers
    // For demo purposes, we'll use a churn rate that is half of our at-risk percentage
    // If 25% of customers are at risk (1 out of 4), then we expect 12.5% to actually churn
    const atRiskPercentage = (atRiskCustomers.length / totalCustomers) * 100;
    const churnRate = (atRiskPercentage / 2).toFixed(1); // Half of at-risk percentage
    
    // Get all deals, tickets and activities to analyze trends
    const deals = Array.from(this.deals.values());
    const tickets = Array.from(this.tickets.values());
    const activities = Array.from(this.activityLogs.values());
    
    // Calculate churn factors for all customers
    const allChurnFactors: string[] = [];
    const customerData: { customerId: number; score: number; factors: string[] }[] = [];
    
    for (const customer of customers) {
      const customerDeals = deals.filter(d => d.customerId === customer.id);
      const customerTickets = tickets.filter(t => t.customerId === customer.id);
      const customerActivities = activities.filter(a => {
        // Parse the relatedTo field which has format 'entityType:entityId'
        const [entityType, entityId] = a.relatedTo.split(':');
        return entityType === 'customer' && parseInt(entityId) === customer.id;
      });
      
      const score = calculateChurnScore(customer, customerDeals, customerTickets, customerActivities);
      const factors = getChurnFactors(customer, customerDeals, customerTickets);
      
      customerData.push({ customerId: customer.id, score, factors });
      allChurnFactors.push(...factors);
    }
    
    // Calculate top churn reasons based on factor frequency
    const factorCounts: Record<string, number> = {};
    for (const factor of allChurnFactors) {
      factorCounts[factor] = (factorCounts[factor] || 0) + 1;
    }
    
    // Sort factors by frequency and calculate percentages
    const sortedFactors = Object.entries(factorCounts)
      .filter(([factor]) => factor !== 'Regular engagement patterns') // Exclude the default factor
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    const totalFactorCount = sortedFactors.reduce((sum, [_, count]) => sum + count, 0);
    
    const topChurnReasons = sortedFactors.map(([reason, count]) => ({
      reason,
      percentage: Math.round((count / totalFactorCount) * 100)
    }));
    
    // If we don't have enough factors, add some common ones with lower percentages
    if (topChurnReasons.length < 5) {
      const defaultReasons = [
        { reason: 'Lack of engagement', percentage: 35 },
        { reason: 'Competitor offers', percentage: 25 },
        { reason: 'Product fit issues', percentage: 20 },
        { reason: 'Price sensitivity', percentage: 15 },
        { reason: 'Poor support experience', percentage: 5 }
      ];
      
      for (let i = topChurnReasons.length; i < 5; i++) {
        topChurnReasons.push(defaultReasons[i]);
      }
    }
    
    // Generate realistic monthly churn data based on customer trends
    const now = new Date();
    const currentMonth = now.getMonth();
    
    const monthlyChurn = Array.from({ length: 6 }, (_, i) => {
      // Calculate month index (going backward from current month)
      const monthIndex = (currentMonth - i + 12) % 12;
      const month = new Date(now.getFullYear(), monthIndex, 1).toLocaleString('en-US', { month: 'short' });
      
      // Calculate a realistic churn rate trend (slightly decreasing)
      const baseChurnRate = parseFloat(churnRate) - (i * 0.2);
      const adjustedChurnRate = Math.max(0.5, baseChurnRate).toFixed(1);
      
      // Calculate new and lost customers based on trends
      const newCustomers = Math.max(5, totalCustomers / 10 - i);
      const lostCustomers = Math.max(1, (parseFloat(adjustedChurnRate) * totalCustomers / 100));
      
      return {
        month,
        churnRate: adjustedChurnRate + '%',
        newCustomers: Math.floor(newCustomers),
        lostCustomers: Math.floor(lostCustomers)
      };
    }).reverse(); // Reverse to get chronological order
    
    return {
      currentChurnRate: churnRate + '%',
      atRiskCount: atRiskCustomers.length,
      totalCustomers,
      atRiskPercentage: (atRiskCustomers.length / totalCustomers * 100).toFixed(1) + '%',
      monthlyChurn,
      topChurnReasons
    };
  }

  async getTeamAnalytics(): Promise<any> {
    // Generate synthetic team performance data
    const performanceByDepartment = [
      { department: 'Sales', performance: 87, headcount: 12 },
      { department: 'Support', performance: 92, headcount: 8 },
      { department: 'Marketing', performance: 78, headcount: 5 },
      { department: 'Product', performance: 84, headcount: 7 }
    ];

    const teamMembers = await this.getTeamMembers();
    const topPerformers = [...teamMembers]
      .sort((a, b) => Number(b.performanceScore || 0) - Number(a.performanceScore || 0))
      .slice(0, 5)
      .map(member => ({
        id: member.id,
        name: member.name,
        role: member.role,
        performance: member.performanceScore,
        dealsWon: member.dealsWon
      }));

    const stageCount = async (stage: string) => {
      const deals = await this.getDealsByStage(stage);
      return deals.length;
    };

    return {
      teamSize: teamMembers.length,
      averagePerformance: 84.5,
      performanceByDepartment,
      topPerformers,
      dealsByStage: [
        { stage: 'lead', count: await stageCount('lead') },
        { stage: 'qualified', count: await stageCount('qualified') },
        { stage: 'proposal', count: await stageCount('proposal') },
        { stage: 'negotiation', count: await stageCount('negotiation') },
        { stage: 'closed', count: await stageCount('closed') }
      ]
    };
  }

  async getSalesPerformance(): Promise<any> {
    const deals = Array.from(this.deals.values());
    const totalDealsValue = deals.reduce((sum, deal) => sum + Number(deal.value || 0), 0);
    const closedDeals = deals.filter(deal => deal.stage === 'closed');
    const closedDealsValue = closedDeals.reduce((sum, deal) => sum + Number(deal.value || 0), 0);
    const winRate = deals.length > 0 ? closedDeals.length / deals.length * 100 : 0;
    
    // Sales trends by month (simulated data)
    const monthlyTrends = Array.from({ length: 6 }, (_, i) => {
      const month = new Date(2023, i, 1).toLocaleString('en-US', { month: 'short' });
      const revenue = Math.floor(Math.random() * 1000000) + 500000;
      const deals = Math.floor(Math.random() * 20) + 10;
      return { month, revenue, deals };
    });

    return {
      pipeline: {
        totalValue: totalDealsValue,
        closedValue: closedDealsValue,
        activeValue: totalDealsValue - closedDealsValue,
        winRate: winRate.toFixed(2)
      },
      conversion: {
        leadToQualified: (Math.random() * 30 + 40).toFixed(2),
        qualifiedToProposal: (Math.random() * 20 + 60).toFixed(2),
        proposalToClose: (Math.random() * 15 + 70).toFixed(2),
        avgDealCycle: Math.floor(Math.random() * 20) + 30 // days
      },
      salesByRegion: [
        { region: 'North', value: Math.floor(Math.random() * 500000) + 200000 },
        { region: 'South', value: Math.floor(Math.random() * 400000) + 300000 },
        { region: 'East', value: Math.floor(Math.random() * 600000) + 400000 },
        { region: 'West', value: Math.floor(Math.random() * 450000) + 350000 }
      ],
      monthlyTrends,
      forecast: {
        nextMonth: Math.floor(Math.random() * 600000) + 800000,
        nextQuarter: Math.floor(Math.random() * 2000000) + 2500000,
        growthRate: (Math.random() * 10 + 5).toFixed(2)
      }
    };
  }

  // Initialize sample data for the CRM system
  private initSampleData() {
    // Sample customers
    this.createCustomer({
      name: "Michael Johnson",
      email: "michael@techsolutions.com",
      companyName: "Tech Solutions Inc.",
      phone: "+91-9876543210",
      status: "active",
      totalSpent: "42500",
      lastOrderDate: "2023-05-15",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=250"
    });
    
    this.createCustomer({
      name: "Sarah Williams",
      email: "sarah@innovatedesign.com",
      companyName: "Innovate Design Co.",
      phone: "+91-9876543211",
      status: "active",
      totalSpent: "28700",
      lastOrderDate: "2023-05-10",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=250"
    });
    
    this.createCustomer({
      name: "David Rodriguez",
      email: "david@globalenterprises.com",
      companyName: "Global Enterprises Ltd.",
      phone: "+91-9876543212",
      status: "active",
      totalSpent: "56200",
      lastOrderDate: "2023-05-05",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=250"
    });
    
    this.createCustomer({
      name: "Emily Chen",
      email: "emily@nextgen.com",
      companyName: "NextGen Solutions",
      phone: "+91-9876543213",
      status: "active",
      totalSpent: "31450",
      lastOrderDate: "2023-04-28",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=250"
    });

    // Sample products
    this.createProduct({
      name: "Enterprise CRM Suite",
      description: "Comprehensive CRM solution for large enterprises",
      category: "Software",
      price: "1450000",
      currency: "INR",
      status: "active",
      icon: "desktop_windows",
      trend: "12.4",
      stockAvailable: 45
    });
    
    this.createProduct({
      name: "Premium Support Plan",
      description: "24/7 priority support for enterprise customers",
      category: "Support",
      price: "825000",
      currency: "INR",
      status: "active",
      icon: "support_agent",
      trend: "8.2",
      stockAvailable: 120
    });
    
    this.createProduct({
      name: "Cloud Storage 5TB",
      description: "Secure cloud storage solution for businesses",
      category: "Infrastructure",
      price: "675000",
      currency: "INR",
      status: "active",
      icon: "storage",
      trend: "-2.8",
      stockAvailable: 5
    });
    
    this.createProduct({
      name: "API Integration Package",
      description: "Custom API integration services",
      category: "Services",
      price: "520000",
      currency: "INR",
      status: "active",
      icon: "integration_instructions",
      trend: "15.7",
      stockAvailable: 75
    });

    // Sample deals
    this.createDeal({
      customerId: 1,
      title: "Enterprise CRM Implementation",
      companyName: "TechCorp Solutions",
      stage: "proposal",
      value: "850000",
      probability: 75
    });
    
    this.createDeal({
      customerId: 2,
      title: "Cloud Migration Project",
      companyName: "Innovate Industries",
      stage: "qualified",
      value: "525000",
      probability: 45
    });
    
    this.createDeal({
      customerId: 3,
      title: "Data Center Upgrade",
      companyName: "Global Enterprises",
      stage: "lead",
      value: "1275000",
      probability: 20
    });
    
    this.createDeal({
      customerId: 4,
      title: "DevOps Implementation",
      companyName: "NextGen Solutions",
      stage: "closed",
      value: "640000",
      probability: 100
    });

    // Sample tickets
    this.createTicket({
      ticketId: "TK-2384",
      customerId: 1,
      title: "Integration issue with third-party API",
      description: "Unable to connect to the payment gateway API",
      status: "open",
      priority: "high"
    });
    
    this.createTicket({
      ticketId: "TK-2383",
      customerId: 2,
      title: "Dashboard export not working correctly",
      description: "PDF exports are missing some data columns",
      status: "in progress",
      priority: "medium"
    });
    
    this.createTicket({
      ticketId: "TK-2382",
      customerId: 3,
      title: "Account settings update confirmation",
      description: "Not receiving confirmation emails after settings update",
      status: "open",
      priority: "low"
    });
    
    this.createTicket({
      ticketId: "TK-2381",
      customerId: 4,
      title: "Product catalog pricing discrepancy",
      description: "Prices shown in the catalog don't match checkout prices",
      status: "open",
      priority: "medium"
    });

    // Sample team members
    this.createTeamMember({
      name: "Rajesh Kumar",
      email: "rajesh@insightsync.com",
      role: "Sales Manager",
      department: "Sales",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=250",
      status: "active",
      salesTarget: "2500000",
      dealsWon: 15,
      ticketsResolved: 0,
      performanceScore: "92.5",
      joinDate: "2022-06-12"
    });
    
    this.createTeamMember({
      name: "Priya Sharma",
      email: "priya@insightsync.com",
      role: "Support Specialist",
      department: "Support",
      avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=250",
      status: "active",
      salesTarget: "0",
      dealsWon: 0,
      ticketsResolved: 127,
      performanceScore: "88.7",
      joinDate: "2022-08-03"
    });
    
    this.createTeamMember({
      name: "Arun Verma",
      email: "arun@insightsync.com",
      role: "Product Specialist",
      department: "Product",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250",
      status: "active",
      salesTarget: "1250000",
      dealsWon: 8,
      ticketsResolved: 32,
      performanceScore: "85.2",
      joinDate: "2022-11-15"
    });

    // Sample tasks
    this.createTask({
      title: "Follow up with Tech Solutions",
      description: "Call Michael to discuss implementation timeline",
      status: "pending",
      priority: "high",
      dueDate: "2023-06-15",
      assignedTo: "1", // Rajesh
      relatedTo: "customer:1" // Michael Johnson
    });
    
    this.createTask({
      title: "Prepare proposal for Cloud Migration",
      description: "Create detailed technical proposal and pricing",
      status: "in-progress",
      priority: "medium",
      dueDate: "2023-06-10",
      assignedTo: "3", // Arun
      relatedTo: "deal:2" // Cloud Migration Project
    });
    
    this.createTask({
      title: "Resolve payment gateway integration",
      description: "Debug API connection issues for Tech Solutions",
      status: "pending",
      priority: "high",
      dueDate: "2023-06-08",
      assignedTo: "2", // Priya
      relatedTo: "ticket:1" // Integration issue ticket
    });

    // Sample activity logs
    this.createActivityLog({
      activityType: "call",
      description: "Initial discovery call to understand requirements",
      relatedTo: "customer:1", // Michael Johnson
      createdBy: "1", // Rajesh
      duration: 45,
      outcome: "Positive, client interested in full implementation"
    });
    
    this.createActivityLog({
      activityType: "email",
      description: "Sent proposal documents for review",
      relatedTo: "deal:1", // Enterprise CRM Implementation
      createdBy: "1", // Rajesh
      outcome: "Awaiting feedback"
    });
    
    this.createActivityLog({
      activityType: "meeting",
      description: "Technical discussion about integration options",
      relatedTo: "ticket:1", // Integration issue ticket
      createdBy: "2", // Priya
      duration: 60,
      outcome: "Identified API authentication issue"
    });

    // Revenue metrics with enhanced data
    this.revenueMetrics.set(1, {
      id: 1,
      month: "Jan",
      year: 2023,
      value: "1800000",
      change: "10.2",
      newCustomers: 12,
      churnedCustomers: 2,
      mrr: "1450000",
      expenses: "950000",
      profit: "500000"
    });
    
    this.revenueMetrics.set(2, {
      id: 2,
      month: "Feb",
      year: 2023,
      value: "1950000",
      change: "8.5",
      newCustomers: 15,
      churnedCustomers: 3,
      mrr: "1560000",
      expenses: "980000",
      profit: "580000"
    });
    
    this.revenueMetrics.set(3, {
      id: 3,
      month: "Mar",
      year: 2023,
      value: "2100000",
      change: "7.8",
      newCustomers: 18,
      churnedCustomers: 2,
      mrr: "1620000",
      expenses: "1020000",
      profit: "600000"
    });
    
    this.revenueMetrics.set(4, {
      id: 4,
      month: "Apr",
      year: 2023,
      value: "2250000",
      change: "7.2",
      newCustomers: 14,
      churnedCustomers: 4,
      mrr: "1680000",
      expenses: "1050000",
      profit: "630000"
    });
    
    this.revenueMetrics.set(5, {
      id: 5,
      month: "May",
      year: 2023,
      value: "2400000",
      change: "6.7",
      newCustomers: 16,
      churnedCustomers: 3,
      mrr: "1750000",
      expenses: "1080000",
      profit: "670000"
    });
    
    this.revenueMetrics.set(6, {
      id: 6,
      month: "Jun",
      year: 2023,
      value: "2550000",
      change: "6.3",
      newCustomers: 20,
      churnedCustomers: 2,
      mrr: "1820000",
      expenses: "1120000",
      profit: "700000"
    });
    
    this.revenueMetrics.set(7, {
      id: 7,
      month: "Jul",
      year: 2023,
      value: "2325000",
      change: "-8.8",
      newCustomers: 10,
      churnedCustomers: 6,
      mrr: "1710000",
      expenses: "1100000",
      profit: "610000"
    });
    
    this.revenueMetrics.set(8, {
      id: 8,
      month: "Aug",
      year: 2023,
      value: "2450000",
      change: "5.4",
      newCustomers: 13,
      churnedCustomers: 3,
      mrr: "1780000",
      expenses: "1115000",
      profit: "665000"
    });
    
    this.revenueMetricCurrentId = 9;

    // Category sales with enhanced analytics
    this.categorySales.set(1, {
      id: 1,
      category: "Software",
      value: "1800000",
      percentage: "40",
      growth: "12.5",
      itemCount: 24,
      avgOrderValue: "75000"
    });
    
    this.categorySales.set(2, {
      id: 2,
      category: "Services",
      value: "1125000",
      percentage: "25",
      growth: "8.2",
      itemCount: 18,
      avgOrderValue: "62500"
    });
    
    this.categorySales.set(3, {
      id: 3,
      category: "Hardware",
      value: "900000",
      percentage: "20",
      growth: "-2.8",
      itemCount: 32,
      avgOrderValue: "28125"
    });
    
    this.categorySales.set(4, {
      id: 4,
      category: "Support",
      value: "675000",
      percentage: "15",
      growth: "5.4",
      itemCount: 45,
      avgOrderValue: "15000"
    });
    
    this.categorySaleCurrentId = 5;
  }
}

// Helper functions for churn analysis
// Helper function to convert date to relative time "X days ago" format
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return "Today";
  } else if (diffDays === 1) {
    return "Yesterday";
  } else {
    return `${diffDays} days ago`;
  }
}

function calculateChurnScore(customer: Customer, deals: Deal[], tickets: Ticket[], activities: ActivityLog[]): number {
  // Higher score = higher risk of churn (0-100)
  // More realistic algorithm with weighted factors
  let score = 0;
  const now = new Date();
  
  // Base score - all customers start with a low risk baseline
  score = 15;
  
  // Order recency factor (most important predictor)
  if (customer.lastOrderDate) {
    const lastOrderDate = new Date(customer.lastOrderDate);
    const daysSinceLastOrder = (now.getTime() - lastOrderDate.getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysSinceLastOrder < 30) {
      // Very recent purchase - reduces churn risk significantly
      score -= 10;
    } else if (daysSinceLastOrder < 90) {
      // Recent purchase in last 3 months - slightly reduces risk
      score -= 5;
    } else if (daysSinceLastOrder > 180) {
      // No purchase in last 6 months - increases risk significantly
      score += Math.min((daysSinceLastOrder - 180) / 10, 25);
    }
  } else {
    // No purchase history - moderate risk
    score += 18;
  }
  
  // Revenue significance factor
  const totalSpent = Number(customer.totalSpent || 0);
  if (totalSpent > 50000) {
    // High-value customers often have different churn patterns
    // They may have longer renewal cycles but higher loyalty
    score -= 8;
  } else if (totalSpent < 10000) {
    // Low-value customers have higher churn risk
    score += 5;
  }
  
  // Support ticket factor - weighted by age and status
  const openTickets = tickets.filter(t => t.status === 'open' || t.status === 'in progress');
  if (openTickets.length > 2) {
    // Multiple open tickets is a strong churn signal
    score += 15;
  } else if (openTickets.length > 0) {
    // One open ticket is a moderate signal
    score += 8;
  }
  
  // High priority unresolved tickets are critical
  const highPriorityTickets = tickets.filter(t => t.priority === 'high' && t.status !== 'closed');
  if (highPriorityTickets.length > 0) {
    score += highPriorityTickets.length * 7;
  }
  
  // Deal engagement factor - active deals indicate ongoing relationship
  const activeDeals = deals.filter(d => d.stage !== 'closed' && d.stage !== 'lost').length;
  score -= Math.min(activeDeals * 4, 12); // Up to -12 points for active deals
  
  // Recent interaction factor - engagement indicates lower churn risk
  if (activities.length > 0) {
    // More interactions generally indicate better engagement
    score -= Math.min(activities.length, 8);
    
    // Recency of interaction is important
    const latestActivityTimes = activities
      .map(a => a.createdAt ? new Date(a.createdAt).getTime() : 0)
      .filter(time => time > 0);
    
    if (latestActivityTimes.length > 0) {
      const latestActivity = new Date(Math.max(...latestActivityTimes));
      const daysSinceActivity = (now.getTime() - latestActivity.getTime()) / (1000 * 60 * 60 * 24);
      
      if (daysSinceActivity < 7) {
        // Very recent activity
        score -= 10;
      } else if (daysSinceActivity > 60) {
        // No recent activity
        score += Math.min(daysSinceActivity / 15, 12);
      }
    } else {
      score += 12; // No timestamped activities
    }
  } else {
    // No recorded interactions is a strong churn signal
    score += 20;
  }
  
  // Add some randomness to simulate other unknown factors
  // This makes the data more realistic by avoiding uniform scores
  score += (Math.random() * 6) - 3;
  
  // Ensure score is within 0-100 range
  return Math.max(0, Math.min(100, Math.round(score)));
}

function getChurnFactors(customer: Customer, deals: Deal[], tickets: Ticket[]): string[] {
  const factors = [];
  const now = new Date();
  
  // Customer activity analysis
  if (customer.lastOrderDate) {
    const lastOrderDate = new Date(customer.lastOrderDate);
    const daysSinceLastOrder = (now.getTime() - lastOrderDate.getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysSinceLastOrder > 180) {
      factors.push('Inactive for 6+ months');
    } else if (daysSinceLastOrder > 90) {
      factors.push('No orders in past 3 months');
    }
  } else {
    factors.push('No purchase history');
  }
  
  // Support experience analysis
  const openTickets = tickets.filter(t => t.status === 'open' || t.status === 'in progress');
  const highPriorityTickets = tickets.filter(t => t.priority === 'high' && t.status !== 'closed');
  
  if (highPriorityTickets.length > 0) {
    factors.push('Unresolved critical issues');
  } else if (openTickets.length > 1) {
    factors.push(`Multiple unresolved support requests`);
  }
  
  // Deal engagement analysis
  const lostDeals = deals.filter(d => d.stage === 'lost').length;
  const activeDeals = deals.filter(d => d.stage !== 'closed' && d.stage !== 'lost').length;
  
  if (lostDeals > 1) {
    factors.push(`Recent deal losses (${lostDeals})`);
  }
  
  if (activeDeals === 0 && customer.totalSpent && Number(customer.totalSpent) > 20000) {
    factors.push('No active opportunities despite high spend');
  }
  
  // Account value analysis
  const totalSpent = Number(customer.totalSpent || 0);
  if (totalSpent < 10000 && customer.status === 'inactive') {
    factors.push('Low value & inactive account');
  }
  
  // Customer relationship analysis
  if (tickets.length > 3 && openTickets.length > 0) {
    factors.push('Multiple support interactions');
  }
  
  // Competitive threat analysis
  // We'd need more data for this in a real system
  if (lostDeals > 0 && customer.lastOrderDate) {
    const lastOrderDate = new Date(customer.lastOrderDate);
    const daysSinceLastOrder = (now.getTime() - lastOrderDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceLastOrder > 60) {
      factors.push('Possible competitor engagement');
    }
  }
  
  // Add default factor if none found
  if (factors.length === 0) {
    // Add one of several possible default factors randomly to make it more realistic
    const defaultFactors = [
      'Regular engagement patterns',
      'Healthy customer relationship',
      'Normal usage behavior',
      'Stable account health'
    ];
    factors.push(defaultFactors[Math.floor(Math.random() * defaultFactors.length)]);
  }
  
  return factors;
}

export const storage = new MemStorage();