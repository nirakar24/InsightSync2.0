import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import CustomerList from '@/components/customers/CustomerList';
import CustomerLifetimeValue from '@/components/customers/CustomerLifetimeValue';
import CustomerChurnMetrics from '@/components/customers/CustomerChurnMetrics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const Customers: React.FC = () => {
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const { toast } = useToast();
  
  // Get customers with churn risk
  const { data: churnRiskCustomers } = useQuery({
    queryKey: ['/api/analytics/customers/churn-risk']
  });

  const handleCustomerSelect = (customerId: number) => {
    setSelectedCustomerId(customerId);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Customer Management</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">View and manage your customer relationships</p>
          </div>
          
        </div>
        
        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Customers</TabsTrigger>
            <TabsTrigger value="lifetime">Customer Value</TabsTrigger>
            <TabsTrigger value="churn">Churn Analysis</TabsTrigger>
            <TabsTrigger value="at-risk">At-Risk Customers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <CustomerList onCustomerSelect={handleCustomerSelect} />
          </TabsContent>
          
          <TabsContent value="lifetime">
            {selectedCustomerId ? (
              <CustomerLifetimeValue customerId={selectedCustomerId} />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Customer Lifetime Value</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center min-h-[400px]">
                  <div className="text-center">
                    <div className="material-icons text-slate-400 text-5xl mb-4">person_search</div>
                    <p className="text-slate-500 dark:text-slate-400 mb-4">Select a customer from the list to view their lifetime value analysis</p>
                    <Button variant="outline" onClick={() => document.querySelector('[data-value="all"]')?.click()}>
                      View Customer List
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="churn">
            <CustomerChurnMetrics />
          </TabsContent>
          
          <TabsContent value="at-risk">
            <Card>
              <CardHeader>
                <CardTitle>At-Risk Customers</CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    High Risk
                  </Badge>
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                    Medium Risk
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                    <thead className="bg-slate-50 dark:bg-slate-800">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Customer
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Company
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Last Order
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Total Spent
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
                      {churnRiskCustomers?.map((customer: any) => (
                        <tr 
                          key={customer.id} 
                          className="hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {customer.avatar ? (
                                <img 
                                  src={customer.avatar} 
                                  alt={customer.name}
                                  className="h-10 w-10 rounded-full mr-3"
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-secondary text-white flex items-center justify-center mr-3">
                                  {customer.name.charAt(0)}
                                </div>
                              )}
                              <div>
                                <div className="text-sm font-medium text-slate-900 dark:text-white">
                                  {customer.name}
                                </div>
                                <div className="text-sm text-slate-500 dark:text-slate-400">
                                  {customer.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-slate-900 dark:text-white">
                              {customer.companyName}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-slate-900 dark:text-white">
                              {customer.lastOrderDate ? new Date(customer.lastOrderDate).toLocaleDateString() : 'Never'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-slate-900 dark:text-white">
                              ₹{Number(customer.totalSpent).toLocaleString('en-IN')}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                handleCustomerSelect(customer.id);
                                document.querySelector('[data-value="lifetime"]')?.click();
                              }}
                            >
                              View Details
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Customers;
