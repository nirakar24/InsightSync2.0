import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
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
} from 'recharts';

interface Product {
  id: number;
  name: string;
  description: string;
  icon: string;
  category: string;
  price: string;
  currency: string;
  stockAvailable: number;
  needsRestock: boolean;
  reorderLevel: number;
  specifications: string;
  status: string;
  popularity: number;
  rating: number;
  relatedProducts: number[];
}

interface ProductPerformance {
  sales: {
    currentMonth: number;
    previousMonth: number;
    growth: string;
    monthlyData: {
      month: string;
      sales: number;
    }[];
  };
  revenue: {
    total: string;
    growth: string;
    monthlyData: {
      month: string;
      revenue: number;
    }[];
  };
  popularity: {
    score: number;
    trend: string;
    viewCount: number;
    conversionRate: string;
  };
  inventory: {
    inStock: number;
    reserved: number;
    backOrdered: number;
    reorderLevel: number;
    daysToRestock: number;
  };
}

interface ProductDetailProps {
  productId: number;
  isOpen: boolean;
  onClose: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ productId, isOpen, onClose }) => {
  const { toast } = useToast();
  
  // Get product data
  const { data: productData, isLoading: isLoadingProduct } = useQuery({
    queryKey: ['/api/products', productId],
    enabled: isOpen && !!productId,
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to load product data",
        variant: "destructive"
      });
    }
  });

  // Get product performance data
  const { data: performanceData, isLoading: isLoadingPerformance } = useQuery({
    queryKey: ['/api/analytics/products/performance', productId],
    enabled: isOpen && !!productId,
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to load performance data",
        variant: "destructive"
      });
    }
  });

  const isLoading = isLoadingProduct || isLoadingPerformance;
  const product: Product | undefined = productData as Product;
  const performance: ProductPerformance | undefined = performanceData as ProductPerformance;

  if (!isOpen) {
    return null;
  }

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={() => onClose()}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <Skeleton className="h-8 w-1/3 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
          <Skeleton className="h-[300px] mb-4" />
        </DialogContent>
      </Dialog>
    );
  }

  if (!product) {
    return (
      <Dialog open={isOpen} onOpenChange={() => onClose()}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Product Not Found</DialogTitle>
            <DialogDescription>
              The requested product information could not be loaded.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={onClose}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Format currency
  const formatCurrency = (value: string | number) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return `₹${numValue.toLocaleString('en-IN')}`;
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-500 hover:bg-green-600';
      case 'low stock': return 'bg-amber-500 hover:bg-amber-600';
      case 'out of stock': return 'bg-red-500 hover:bg-red-600';
      case 'discontinued': return 'bg-slate-500 hover:bg-slate-600';
      default: return 'bg-blue-500 hover:bg-blue-600';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl flex items-center">
                {product.name}
                <Badge className={`ml-2 ${getStatusColor(product.status || 'active')}`}>
                  {product.status || 'Active'}
                </Badge>
              </DialogTitle>
              <DialogDescription className="mt-1">
                {product.category} - Product ID: {product.id}
              </DialogDescription>
            </div>
            <div className="text-2xl font-bold text-secondary">
              {formatCurrency(product.price)}
            </div>
          </div>
        </DialogHeader>
        
        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex flex-col p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <span className="text-sm text-slate-500 dark:text-slate-400">Stock</span>
                <span className="text-2xl font-bold">
                  {product.stockAvailable || 0} units
                </span>
                {product.needsRestock && (
                  <span className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                    Reorder level: {product.reorderLevel}
                  </span>
                )}
              </div>
              
              <div className="flex flex-col p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <span className="text-sm text-slate-500 dark:text-slate-400">Popularity</span>
                <div className="flex items-center">
                  <span className="text-2xl font-bold mr-2">
                    {performance?.popularity?.score || 0}
                  </span>
                  <span className="text-xs">
                    / 100
                  </span>
                </div>
                <Progress 
                  value={performance?.popularity?.score || 0} 
                  className="mt-2" 
                />
              </div>
              
              <div className="flex flex-col p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <span className="text-sm text-slate-500 dark:text-slate-400">Monthly Sales</span>
                <span className="text-2xl font-bold">
                  {performance?.sales?.currentMonth || 0} units
                </span>
                <span className={`text-xs ${
                  (performance?.sales?.growth?.startsWith('+') 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400')
                } mt-1`}>
                  {performance?.sales?.growth || '0%'} vs last month
                </span>
              </div>
            </div>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Product Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  {product.description || 'No description available.'}
                </p>
              </CardContent>
            </Card>
            
            {performance?.sales?.monthlyData && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Sales Trend</CardTitle>
                  <CardDescription>Units sold over the past 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={performance.sales.monthlyData}
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
                        <Tooltip formatter={(value) => [`${value} units`, 'Sales']} />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="sales" 
                          stroke="#3b82f6" 
                          activeDot={{ r: 8 }} 
                          name="Units Sold"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="performance">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue</CardTitle>
                  <CardDescription>
                    Total: {formatCurrency(performance?.revenue?.total || 0)}
                    <span className={`ml-2 ${
                      (performance?.revenue?.growth?.startsWith('+') 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400')
                    }`}>
                      {performance?.revenue?.growth || '0%'}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={performance?.revenue?.monthlyData || []}
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
                          formatter={(value) => [formatCurrency(value), 'Revenue']} 
                        />
                        <Legend />
                        <Bar 
                          dataKey="revenue" 
                          fill="#22c55e" 
                          name="Revenue" 
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Customer Engagement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Popularity Score</span>
                        <span className="font-medium">{performance?.popularity?.score || 0}/100</span>
                      </div>
                      <Progress 
                        value={performance?.popularity?.score || 0} 
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <div className="text-sm text-slate-500 dark:text-slate-400">Views</div>
                        <div className="text-xl font-medium mt-1">
                          {performance?.popularity?.viewCount?.toLocaleString() || 0}
                        </div>
                      </div>
                      
                      <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <div className="text-sm text-slate-500 dark:text-slate-400">Conversion Rate</div>
                        <div className="text-xl font-medium mt-1">
                          {performance?.popularity?.conversionRate || '0%'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Trend</div>
                      <div className="flex items-center">
                        <span className="material-icons mr-2">
                          {performance?.popularity?.trend === 'up' ? 'trending_up' : 
                           performance?.popularity?.trend === 'down' ? 'trending_down' : 'trending_flat'}
                        </span>
                        <span className={`${
                          performance?.popularity?.trend === 'up' ? 'text-green-600 dark:text-green-400' : 
                          performance?.popularity?.trend === 'down' ? 'text-red-600 dark:text-red-400' : 
                          'text-slate-600 dark:text-slate-400'
                        }`}>
                          {performance?.popularity?.trend === 'up' ? 'Rising popularity' : 
                           performance?.popularity?.trend === 'down' ? 'Declining popularity' : 'Stable popularity'}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="inventory">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Inventory Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <div className="text-sm text-slate-500 dark:text-slate-400">In Stock</div>
                        <div className="text-2xl font-bold mt-1">
                          {performance?.inventory?.inStock || product.stockAvailable || 0}
                        </div>
                      </div>
                      
                      <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <div className="text-sm text-slate-500 dark:text-slate-400">Reserved</div>
                        <div className="text-2xl font-bold mt-1">
                          {performance?.inventory?.reserved || 0}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <div className="text-sm text-slate-500 dark:text-slate-400">Reorder Level</div>
                        <div className="text-2xl font-bold mt-1">
                          {performance?.inventory?.reorderLevel || product.reorderLevel || 0}
                        </div>
                      </div>
                      
                      <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <div className="text-sm text-slate-500 dark:text-slate-400">Back Ordered</div>
                        <div className="text-2xl font-bold mt-1">
                          {performance?.inventory?.backOrdered || 0}
                        </div>
                      </div>
                    </div>
                    
                    {(product.needsRestock || (product.stockAvailable && product.stockAvailable < (product.reorderLevel || 0))) && (
                      <div className="p-4 bg-amber-50 dark:bg-amber-900 rounded-lg border border-amber-200 dark:border-amber-800">
                        <div className="flex items-start">
                          <span className="material-icons text-amber-600 dark:text-amber-400 mr-2">warning</span>
                          <div>
                            <div className="font-medium text-amber-800 dark:text-amber-300">Restock Alert</div>
                            <div className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                              Current stock is below the reorder level. Estimated days until restock: {performance?.inventory?.daysToRestock || 'Unknown'}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Sales Velocity</CardTitle>
                  <CardDescription>Units sold over the past 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={performance?.sales?.monthlyData || []}
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
                        <Tooltip formatter={(value) => [`${value} units`, 'Sales']} />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="sales" 
                          stroke="#3b82f6" 
                          activeDot={{ r: 8 }} 
                          name="Units Sold"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="specifications">
            <Card>
              <CardHeader>
                <CardTitle>Technical Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                {product.specifications ? (
                  <div className="space-y-4">
                    {product.specifications.split('\n').map((spec, index) => {
                      const [key, value] = spec.split(':').map(s => s.trim());
                      return (
                        <div key={index} className="grid grid-cols-3 gap-4 border-b border-slate-200 dark:border-slate-700 pb-2">
                          <div className="font-medium text-slate-900 dark:text-white">{key}</div>
                          <div className="col-span-2 text-slate-700 dark:text-slate-300">{value}</div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-slate-500 dark:text-slate-400">No specifications available for this product.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex items-center justify-between mt-6">
          <div>
            <Button variant="outline" className="mr-2">
              <span className="material-icons text-sm mr-1">edit</span>
              Edit Product
            </Button>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose}>Close</Button>
            <Button>
              <span className="material-icons text-sm mr-1">shopping_cart</span>
              Order Stock
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetail;