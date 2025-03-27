import {
  Customer,
  InsertCustomer,
  Product,
  InsertProduct,
  Deal,
  InsertDeal,
  Ticket,
  InsertTicket,
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

  // Product operations
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;

  // Deal operations
  getDeals(): Promise<Deal[]>;
  getDeal(id: number): Promise<Deal | undefined>;
  createDeal(deal: InsertDeal): Promise<Deal>;
  updateDeal(id: number, deal: Partial<InsertDeal>): Promise<Deal | undefined>;
  deleteDeal(id: number): Promise<boolean>;

  // Ticket operations
  getTickets(): Promise<Ticket[]>;
  getTicket(id: number): Promise<Ticket | undefined>;
  createTicket(ticket: InsertTicket): Promise<Ticket>;
  updateTicket(id: number, ticket: Partial<InsertTicket>): Promise<Ticket | undefined>;
  deleteTicket(id: number): Promise<boolean>;

  // Dashboard metrics
  getRevenueMetrics(): Promise<RevenueMetric[]>;
  getCategorySales(): Promise<CategorySale[]>;
  getTopProducts(limit: number): Promise<Product[]>;
  getRecentCustomers(limit: number): Promise<Customer[]>;
}

export class MemStorage implements IStorage {
  private customers: Map<number, Customer>;
  private products: Map<number, Product>;
  private deals: Map<number, Deal>;
  private tickets: Map<number, Ticket>;
  private revenueMetrics: Map<number, RevenueMetric>;
  private categorySales: Map<number, CategorySale>;
  private customerCurrentId: number;
  private productCurrentId: number;
  private dealCurrentId: number;
  private ticketCurrentId: number;
  private revenueMetricCurrentId: number;
  private categorySaleCurrentId: number;

  constructor() {
    this.customers = new Map();
    this.products = new Map();
    this.deals = new Map();
    this.tickets = new Map();
    this.revenueMetrics = new Map();
    this.categorySales = new Map();
    this.customerCurrentId = 1;
    this.productCurrentId = 1;
    this.dealCurrentId = 1;
    this.ticketCurrentId = 1;
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
    const customer: Customer = { ...customerData, id };
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
    const product: Product = { ...productData, id };
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
      createdAt: now, 
      updatedAt: now 
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
      createdAt: now, 
      updatedAt: now 
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
      lastOrderDate: new Date("2023-05-15"),
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=250"
    });
    
    this.createCustomer({
      name: "Sarah Williams",
      email: "sarah@innovatedesign.com",
      companyName: "Innovate Design Co.",
      phone: "+91-9876543211",
      status: "active",
      totalSpent: "28700",
      lastOrderDate: new Date("2023-05-10"),
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=250"
    });
    
    this.createCustomer({
      name: "David Rodriguez",
      email: "david@globalenterprises.com",
      companyName: "Global Enterprises Ltd.",
      phone: "+91-9876543212",
      status: "active",
      totalSpent: "56200",
      lastOrderDate: new Date("2023-05-05"),
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=250"
    });
    
    this.createCustomer({
      name: "Emily Chen",
      email: "emily@nextgen.com",
      companyName: "NextGen Solutions",
      phone: "+91-9876543213",
      status: "active",
      totalSpent: "31450",
      lastOrderDate: new Date("2023-04-28"),
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
      trend: "12.4"
    });
    
    this.createProduct({
      name: "Premium Support Plan",
      description: "24/7 priority support for enterprise customers",
      category: "Support",
      price: "825000",
      currency: "INR",
      status: "active",
      icon: "support_agent",
      trend: "8.2"
    });
    
    this.createProduct({
      name: "Cloud Storage 5TB",
      description: "Secure cloud storage solution for businesses",
      category: "Infrastructure",
      price: "675000",
      currency: "INR",
      status: "active",
      icon: "storage",
      trend: "-2.8"
    });
    
    this.createProduct({
      name: "API Integration Package",
      description: "Custom API integration services",
      category: "Services",
      price: "520000",
      currency: "INR",
      status: "active",
      icon: "integration_instructions",
      trend: "15.7"
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

    // Revenue metrics
    this.revenueMetrics.set(1, {
      id: 1,
      month: "Jan",
      year: 2023,
      value: "1800000",
      change: "10.2"
    });
    
    this.revenueMetrics.set(2, {
      id: 2,
      month: "Feb",
      year: 2023,
      value: "1950000",
      change: "8.5"
    });
    
    this.revenueMetrics.set(3, {
      id: 3,
      month: "Mar",
      year: 2023,
      value: "2100000",
      change: "7.8"
    });
    
    this.revenueMetrics.set(4, {
      id: 4,
      month: "Apr",
      year: 2023,
      value: "2250000",
      change: "7.2"
    });
    
    this.revenueMetrics.set(5, {
      id: 5,
      month: "May",
      year: 2023,
      value: "2400000",
      change: "6.7"
    });
    
    this.revenueMetrics.set(6, {
      id: 6,
      month: "Jun",
      year: 2023,
      value: "2550000",
      change: "6.3"
    });
    
    this.revenueMetrics.set(7, {
      id: 7,
      month: "Jul",
      year: 2023,
      value: "2325000",
      change: "-8.8"
    });
    
    this.revenueMetrics.set(8, {
      id: 8,
      month: "Aug",
      year: 2023,
      value: "2450000",
      change: "5.4"
    });
    
    this.revenueMetricCurrentId = 9;

    // Category sales
    this.categorySales.set(1, {
      id: 1,
      category: "Software",
      value: "1800000",
      percentage: "40"
    });
    
    this.categorySales.set(2, {
      id: 2,
      category: "Services",
      value: "1125000",
      percentage: "25"
    });
    
    this.categorySales.set(3, {
      id: 3,
      category: "Hardware",
      value: "900000",
      percentage: "20"
    });
    
    this.categorySales.set(4, {
      id: 4,
      category: "Support",
      value: "675000",
      percentage: "15"
    });
    
    this.categorySaleCurrentId = 5;
  }
}

export const storage = new MemStorage();
