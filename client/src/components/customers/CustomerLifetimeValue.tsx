import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

interface Customer {
  id: number;
  name: string;
  email: string;
  companyName: string;
}

interface CustomerEngagement {
  customerValue: {
    totalSpent: number;
    dealValue: number;
    lifetimeValue: number;
  };
  activity: {
    totalDeals: number;
    activeDeals: number;
    wonDeals: number;
    totalTickets: number;
    lastActivity: number | null;
    interactions: number;
  };
  support: {
    openTickets: number;
    avgResponseTime: string;
    satisfaction: number;
  };
  churnRisk: {
    score: number;
    lastOrder: string | null;
    factors: string[];
  };
}

interface CustomerLifetimeValueProps {
  customerId: number;
}

const CustomerLifetimeValue: React.FC<CustomerLifetimeValueProps> = ({ customerId }) => {
  const { toast } = useToast();
  
  // Get customer engagement data
  const { data, isLoading: isLoadingEngagement, isError } = useQuery({
    queryKey: [`/api/analytics/customers/${customerId}/engagement`],
    enabled: !!customerId,
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to load customer engagement data",
        variant: "destructive"
      });
    }
  });

  // Get customer details
  const { data: customerData, isLoading: isLoadingCustomer } = useQuery({
    queryKey: [`/api/customers/${customerId}`],
    enabled: !!customerId,
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to load customer data",
        variant: "destructive"
      });
    }
  });

  const isLoading = isLoadingEngagement || isLoadingCustomer;
  
  // Engagement data with fallback for type safety
  const engagement: CustomerEngagement = data || {
    customerValue: {
      totalSpent: 0,
      dealValue: 0,
      lifetimeValue: 0
    },
    activity: {
      totalDeals: 0,
      activeDeals: 0,
      wonDeals: 0,
      totalTickets: 0,
      lastActivity: null,
      interactions: 0
    },
    support: {
      openTickets: 0,
      avgResponseTime: '0h',
      satisfaction: 0
    },
    churnRisk: {
      score: 0,
      lastOrder: null,
      factors: []
    }
  };
  
  const customer: Customer = customerData || { id: customerId, name: 'Customer', email: '', companyName: '' };

  // Format currency
  const formatCurrency = (value: number) => {
    return `₹${value.toLocaleString('en-IN')}`;
  };

  // Format days ago
  const formatDaysAgo = (days: number | null) => {
    if (days === null) return 'Never';
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  };

  // Get churn risk label and color
  const getChurnRiskInfo = (score: number) => {
    if (score < 30) {
      return { label: 'Low Risk', color: 'bg-green-500' };
    } else if (score < 70) {
      return { label: 'Medium Risk', color: 'bg-amber-500' };
    } else {
      return { label: 'High Risk', color: 'bg-red-500' };
    }
  };

  // Prepare engagement radar data
  const engagementRadarData = [
    { 
      metric: 'Purchase Value', 
      value: Math.min(100, (engagement.customerValue.totalSpent / 10000) * 100) 
    },
    { 
      metric: 'Deal Success', 
      value: engagement.activity.totalDeals > 0 
        ? (engagement.activity.wonDeals / engagement.activity.totalDeals) * 100 
        : 0 
    },
    { 
      metric: 'Interaction', 
      value: Math.min(100, engagement.activity.interactions * 10) 
    },
    { 
      metric: 'Satisfaction', 
      value: engagement.support.satisfaction 
    },
    { 
      metric: 'Activity Recency', 
      value: engagement.activity.lastActivity !== null 
        ? Math.max(0, 100 - engagement.activity.lastActivity) 
        : 0 
    },
  ];
  
  // Prepare monthly spending data (mock data for example)
  const monthlySpendingData = [
    { month: 'Jan', spending: engagement.customerValue.totalSpent * 0.12 },
    { month: 'Feb', spending: engagement.customerValue.totalSpent * 0.08 },
    { month: 'Mar', spending: engagement.customerValue.totalSpent * 0.15 },
    { month: 'Apr', spending: engagement.customerValue.totalSpent * 0.11 },
    { month: 'May', spending: engagement.customerValue.totalSpent * 0.09 },
    { month: 'Jun', spending: engagement.customerValue.totalSpent * 0.14 },
  ];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-1/3 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
          <Skeleton className="h-[300px]" />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Customer Lifetime Value</CardTitle>
          <CardDescription>
            Error loading customer data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-6 text-center">
            <span className="material-icons text-red-500 text-4xl mb-2">error</span>
            <p className="text-slate-500 dark:text-slate-400">
              We encountered an error retrieving the customer lifetime value data. 
              This could be due to a temporary server issue.
            </p>
            <Button 
              variant="outline"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const churnRiskInfo = getChurnRiskInfo(engagement.churnRisk.score);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{customer.name}</CardTitle>
            <CardDescription>{customer.companyName}</CardDescription>
          </div>
          <Badge className={`${churnRiskInfo.color} hover:${churnRiskInfo.color}`}>
            {churnRiskInfo.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex flex-col p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <span className="text-sm text-slate-500 dark:text-slate-400">Total Spent</span>
            <span className="text-3xl font-bold text-slate-900 dark:text-white">
              {formatCurrency(engagement.customerValue.totalSpent)}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Lifetime value: {formatCurrency(engagement.customerValue.lifetimeValue)}
            </span>
          </div>
          
          <div className="flex flex-col p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <span className="text-sm text-slate-500 dark:text-slate-400">Deals</span>
            <span className="text-3xl font-bold text-slate-900 dark:text-white">
              {engagement.activity.wonDeals} / {engagement.activity.totalDeals}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Active deals: {engagement.activity.activeDeals}
            </span>
          </div>
          
          <div className="flex flex-col p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <span className="text-sm text-slate-500 dark:text-slate-400">Last Activity</span>
            <span className="text-xl font-bold text-slate-900 dark:text-white">
              {formatDaysAgo(engagement.activity.lastActivity)}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Recent interactions: {engagement.activity.interactions}
            </span>
          </div>
        </div>
        
        <Tabs defaultValue="overview">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Customer Overview</TabsTrigger>
            <TabsTrigger value="spending">Spending Analysis</TabsTrigger>
            <TabsTrigger value="churn">Retention Insights</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Engagement Metrics</CardTitle>
                  <CardDescription>Overall customer engagement profile</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart outerRadius={90} data={engagementRadarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="metric" />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                        <Radar 
                          name="Customer Engagement" 
                          dataKey="value" 
                          stroke="#3b82f6" 
                          fill="#3b82f6" 
                          fillOpacity={0.6} 
                        />
                        <Tooltip formatter={(value) => [`${value.toFixed(0)}%`, 'Score']} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400">Contact Details</h4>
                      <div className="mt-1">
                        <div className="flex items-center text-sm py-1">
                          <span className="material-icons text-sm mr-2 text-slate-400">email</span>
                          <span>{customer.email}</span>
                        </div>
                        <div className="flex items-center text-sm py-1">
                          <span className="material-icons text-sm mr-2 text-slate-400">business</span>
                          <span>{customer.companyName}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400">Support Metrics</h4>
                      <div className="mt-2 space-y-3">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-xs">Satisfaction Score</span>
                            <span className="text-xs font-medium">{engagement.support.satisfaction}%</span>
                          </div>
                          <Progress 
                            value={engagement.support.satisfaction} 
                            className="h-2"
                          />
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span>Open Tickets:</span>
                          <span className="font-medium">{engagement.support.openTickets}</span>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span>Avg. Response Time:</span>
                          <span className="font-medium">{engagement.support.avgResponseTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="spending">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Spending History</CardTitle>
                  <CardDescription>Monthly spending analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={monthlySpendingData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => [formatCurrency(Number(value)), 'Spending']} 
                        />
                        <Legend />
                        <Bar 
                          dataKey="spending" 
                          name="Monthly Spending" 
                          fill="#22c55e" 
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Value Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>Total Spent</span>
                          <span className="font-medium">{formatCurrency(engagement.customerValue.totalSpent)}</span>
                        </div>
                        <Progress 
                          value={Math.min(100, (engagement.customerValue.totalSpent / engagement.customerValue.lifetimeValue) * 100)} 
                          className="h-2"
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>Current Deal Value</span>
                          <span className="font-medium">{formatCurrency(engagement.customerValue.dealValue)}</span>
                        </div>
                        <Progress 
                          value={Math.min(100, (engagement.customerValue.dealValue / engagement.customerValue.lifetimeValue) * 100)} 
                          className="h-2"
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>Lifetime Value Potential</span>
                          <span className="font-medium">{formatCurrency(engagement.customerValue.lifetimeValue)}</span>
                        </div>
                        <Progress 
                          value={100} 
                          className="h-2"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Purchase Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-100 dark:border-blue-800">
                      <div className="flex">
                        <span className="material-icons text-blue-600 dark:text-blue-400 mr-2">
                          lightbulb
                        </span>
                        <div>
                          <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                            Upsell Opportunity
                          </h4>
                          <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                            Based on historical spending patterns, this customer may be interested in 
                            premium service upgrades or complementary products to their existing purchases.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Recommended Actions</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <span className="material-icons text-sm text-green-500 mr-2">check_circle</span>
                          <span className="text-sm">Schedule quarterly business review</span>
                        </li>
                        <li className="flex items-start">
                          <span className="material-icons text-sm text-green-500 mr-2">check_circle</span>
                          <span className="text-sm">Offer premium support package</span>
                        </li>
                        <li className="flex items-start">
                          <span className="material-icons text-sm text-green-500 mr-2">check_circle</span>
                          <span className="text-sm">Introduce new product lines</span>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="churn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Churn Risk Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center">
                    <div 
                      className="relative w-48 h-48 flex items-center justify-center rounded-full mb-6"
                      style={{
                        background: `conic-gradient(${churnRiskInfo.color} ${engagement.churnRisk.score}%, #e5e7eb ${engagement.churnRisk.score}%)`
                      }}
                    >
                      <div className="absolute w-36 h-36 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-4xl font-bold">{engagement.churnRisk.score}%</div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">Risk Score</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center mb-6">
                      <div className="text-sm text-slate-500 dark:text-slate-400">Last Order</div>
                      <div className="font-medium">
                        {engagement.churnRisk.lastOrder 
                          ? new Date(engagement.churnRisk.lastOrder).toLocaleDateString() 
                          : 'No orders yet'
                        }
                      </div>
                    </div>
                    
                    <div className="w-full">
                      <h4 className="text-sm font-medium mb-2">Risk Factors</h4>
                      <ul className="space-y-2">
                        {engagement.churnRisk.factors.map((factor, index) => (
                          <li key={index} className="flex items-start">
                            <span className="material-icons text-sm text-red-500 mr-2">warning</span>
                            <span className="text-sm">{factor}</span>
                          </li>
                        ))}
                        {engagement.churnRisk.factors.length === 0 && (
                          <li className="text-sm text-slate-500 dark:text-slate-400 text-center">
                            No significant risk factors identified
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Retention Strategy</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {engagement.churnRisk.score > 60 && (
                      <div className="p-4 bg-red-50 dark:bg-red-900/30 rounded-lg border border-red-100 dark:border-red-800">
                        <div className="flex">
                          <span className="material-icons text-red-600 dark:text-red-400 mr-2">
                            priority_high
                          </span>
                          <div>
                            <h4 className="text-sm font-medium text-red-800 dark:text-red-300">
                              High Risk Alert
                            </h4>
                            <p className="text-xs text-red-700 dark:text-red-400 mt-1">
                              This customer has a high churn risk and requires immediate attention. 
                              We recommend scheduling a call to discuss their current needs and concerns.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {engagement.churnRisk.score >= 30 && engagement.churnRisk.score <= 60 && (
                      <div className="p-4 bg-amber-50 dark:bg-amber-900/30 rounded-lg border border-amber-100 dark:border-amber-800">
                        <div className="flex">
                          <span className="material-icons text-amber-600 dark:text-amber-400 mr-2">
                            info
                          </span>
                          <div>
                            <h4 className="text-sm font-medium text-amber-800 dark:text-amber-300">
                              Medium Risk Alert
                            </h4>
                            <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                              This customer shows some signs of potential churn. Consider proactive outreach and 
                              offering incentives to increase engagement.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {engagement.churnRisk.score < 30 && (
                      <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-100 dark:border-green-800">
                        <div className="flex">
                          <span className="material-icons text-green-600 dark:text-green-400 mr-2">
                            check_circle
                          </span>
                          <div>
                            <h4 className="text-sm font-medium text-green-800 dark:text-green-300">
                              Low Risk Status
                            </h4>
                            <p className="text-xs text-green-700 dark:text-green-400 mt-1">
                              This customer appears stable with low churn risk. Continue regular engagement and consider 
                              growth opportunities.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Recommended Actions</h4>
                      <ul className="space-y-2">
                        {engagement.churnRisk.score > 60 && (
                          <>
                            <li className="flex items-start">
                              <span className="material-icons text-sm text-blue-500 mr-2">phone</span>
                              <span className="text-sm">Schedule an urgent call with decision maker</span>
                            </li>
                            <li className="flex items-start">
                              <span className="material-icons text-sm text-blue-500 mr-2">discount</span>
                              <span className="text-sm">Offer renewal discount or loyalty incentive</span>
                            </li>
                            <li className="flex items-start">
                              <span className="material-icons text-sm text-blue-500 mr-2">support_agent</span>
                              <span className="text-sm">Assign dedicated account manager</span>
                            </li>
                          </>
                        )}
                        
                        {engagement.churnRisk.score >= 30 && engagement.churnRisk.score <= 60 && (
                          <>
                            <li className="flex items-start">
                              <span className="material-icons text-sm text-blue-500 mr-2">email</span>
                              <span className="text-sm">Send personalized check-in email</span>
                            </li>
                            <li className="flex items-start">
                              <span className="material-icons text-sm text-blue-500 mr-2">card_giftcard</span>
                              <span className="text-sm">Provide bonus feature access</span>
                            </li>
                            <li className="flex items-start">
                              <span className="material-icons text-sm text-blue-500 mr-2">article</span>
                              <span className="text-sm">Share relevant case studies and resources</span>
                            </li>
                          </>
                        )}
                        
                        {engagement.churnRisk.score < 30 && (
                          <>
                            <li className="flex items-start">
                              <span className="material-icons text-sm text-blue-500 mr-2">thumb_up</span>
                              <span className="text-sm">Maintain regular touchpoints</span>
                            </li>
                            <li className="flex items-start">
                              <span className="material-icons text-sm text-blue-500 mr-2">trending_up</span>
                              <span className="text-sm">Explore upsell opportunities</span>
                            </li>
                            <li className="flex items-start">
                              <span className="material-icons text-sm text-blue-500 mr-2">star</span>
                              <span className="text-sm">Consider for testimonial or case study</span>
                            </li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <div>
          <Button variant="outline" size="sm">
            <span className="material-icons text-sm mr-1">history</span>
            View History
          </Button>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <span className="material-icons text-sm mr-1">email</span>
            Contact
          </Button>
          <Button size="sm">
            <span className="material-icons text-sm mr-1">edit</span>
            Edit Customer
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CustomerLifetimeValue;