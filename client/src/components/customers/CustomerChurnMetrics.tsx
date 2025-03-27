import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ChurnMetrics {
  currentChurnRate: string;
  atRiskCount: number;
  totalCustomers: number;
  atRiskPercentage: string;
  monthlyChurn: {
    month: string;
    churnRate: string;
    newCustomers: number;
    lostCustomers: number;
  }[];
  topChurnReasons: {
    reason: string;
    percentage: number;
  }[];
}

const CustomerChurnMetrics: React.FC = () => {
  const { toast } = useToast();
  
  // Get churn metrics
  const { data, isLoading, isError } = useQuery({
    queryKey: ['/api/analytics/dashboard/churn-metrics'],
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to load churn metrics data",
        variant: "destructive"
      });
    }
  });

  const churnData: ChurnMetrics = data || {
    currentChurnRate: '4.2%',
    atRiskCount: 15,
    totalCustomers: 345,
    atRiskPercentage: '4.3%',
    monthlyChurn: [
      {
        month: 'Jan',
        churnRate: '3.2%',
        newCustomers: 24,
        lostCustomers: 8
      },
      {
        month: 'Feb',
        churnRate: '3.5%',
        newCustomers: 21,
        lostCustomers: 9
      },
      {
        month: 'Mar',
        churnRate: '3.8%',
        newCustomers: 18,
        lostCustomers: 10
      },
      {
        month: 'Apr',
        churnRate: '4.0%',
        newCustomers: 16,
        lostCustomers: 12
      },
      {
        month: 'May',
        churnRate: '4.2%',
        newCustomers: 19,
        lostCustomers: 14
      },
      {
        month: 'Jun',
        churnRate: '3.9%',
        newCustomers: 22,
        lostCustomers: 11
      }
    ],
    topChurnReasons: [
      {
        reason: 'Price Concerns',
        percentage: 35
      },
      {
        reason: 'Competitor Offers',
        percentage: 25
      },
      {
        reason: 'Product Features',
        percentage: 20
      },
      {
        reason: 'Customer Service',
        percentage: 12
      },
      {
        reason: 'Other',
        percentage: 8
      }
    ]
  };

  // Convert string percentages to numbers for charting
  const monthlyChurnData = churnData.monthlyChurn.map(item => ({
    ...item,
    churnRateValue: parseFloat(item.churnRate)
  }));

  const CHURN_REASON_COLORS = [
    '#ff6384',
    '#36a2eb',
    '#ffce56',
    '#4bc0c0',
    '#9966ff'
  ];

  if (isLoading) {
    return (
      <div className="space-y-4">
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
      </div>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Customer Churn Analytics</CardTitle>
          <CardDescription>
            Error loading churn data. Please try again later.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-6 text-center">
            <span className="material-icons text-red-500 text-4xl mb-2">error</span>
            <p className="text-slate-500 dark:text-slate-400">
              We encountered an error retrieving the customer churn metrics. 
              This could be due to a temporary server issue.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Customer Churn Analytics</CardTitle>
          <CardDescription>
            Analyze customer churn patterns and identify at-risk customers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex flex-col p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <span className="text-sm text-slate-500 dark:text-slate-400">Current Churn Rate</span>
              <span className="text-3xl font-bold text-red-600">
                {churnData.currentChurnRate}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Monthly average
              </span>
            </div>
            
            <div className="flex flex-col p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <span className="text-sm text-slate-500 dark:text-slate-400">At-Risk Customers</span>
              <span className="text-3xl font-bold text-amber-500">
                {churnData.atRiskCount}
              </span>
              <div className="flex items-center mt-1">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {churnData.atRiskPercentage} of total
                </span>
                <Badge className="ml-2 bg-amber-100 text-amber-800 border-amber-200 text-xs">
                  Needs Attention
                </Badge>
              </div>
            </div>
            
            <div className="flex flex-col p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <span className="text-sm text-slate-500 dark:text-slate-400">Customer Base</span>
              <span className="text-3xl font-bold">
                {churnData.totalCustomers}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Active customers
              </span>
            </div>
          </div>
          
          <Tabs defaultValue="trends">
            <TabsList className="mb-6">
              <TabsTrigger value="trends">Churn Trends</TabsTrigger>
              <TabsTrigger value="reasons">Churn Reasons</TabsTrigger>
            </TabsList>
            
            <TabsContent value="trends">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthlyChurnData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="churnRateValue"
                      stroke="#ff6384"
                      activeDot={{ r: 8 }}
                      name="Churn Rate %"
                    />
                    <Line 
                      yAxisId="right" 
                      type="monotone" 
                      dataKey="newCustomers" 
                      stroke="#36a2eb" 
                      name="New Customers"
                    />
                    <Line 
                      yAxisId="right" 
                      type="monotone" 
                      dataKey="lostCustomers" 
                      stroke="#ffce56" 
                      name="Lost Customers"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="reasons">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Churn Reasons</CardTitle>
                    <CardDescription>Primary factors leading to customer churn</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={churnData.topChurnReasons}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="percentage"
                            nameKey="reason"
                          >
                            {churnData.topChurnReasons.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={CHURN_REASON_COLORS[index % CHURN_REASON_COLORS.length]} 
                              />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value) => [`${value}%`, 'Percentage']} 
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Detailed Breakdown</CardTitle>
                    <CardDescription>Analysis of churn factors</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {churnData.topChurnReasons.map((reason, index) => (
                        <div key={index}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">{reason.reason}</span>
                            <span className="text-sm font-medium">{reason.percentage}%</span>
                          </div>
                          <Progress 
                            value={reason.percentage} 
                            className="h-2"
                            style={{ 
                              backgroundColor: 'rgba(0,0,0,0.1)',
                              '--progress-color': CHURN_REASON_COLORS[index % CHURN_REASON_COLORS.length]
                            } as React.CSSProperties}
                          />
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-100 dark:border-blue-800">
                      <div className="flex">
                        <span className="material-icons text-blue-600 dark:text-blue-400 mr-2">
                          lightbulb
                        </span>
                        <div>
                          <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                            Recommendation
                          </h4>
                          <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                            Focus on price optimization and competitive analysis to address the top reasons 
                            for customer churn. Consider implementing a customer retention program targeting 
                            these specific concerns.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerChurnMetrics;