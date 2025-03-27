import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import ProductList from '@/components/products/ProductList';
import ProductDetail from '@/components/products/ProductDetail';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const Products: React.FC = () => {
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const { toast } = useToast();
  
  // Fetch product inventory data
  const { data: inventoryData, isLoading } = useQuery({
    queryKey: ['/api/analytics/products/inventory'],
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to load product inventory data",
        variant: "destructive"
      });
    }
  });

  const handleProductClick = (productId: number) => {
    setSelectedProductId(productId);
    setIsDetailOpen(true);
  };

  const handleDetailClose = () => {
    setIsDetailOpen(false);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Product Catalog</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage your products and services</p>
          </div>
          <Button>
            <span className="material-icons text-sm mr-1">add</span>
            Add Product
          </Button>
        </div>
        
        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Products</TabsTrigger>
            <TabsTrigger value="inventory">Inventory Status</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {/* Product List Component */}
            <ProductList onProductClick={handleProductClick} />
          </TabsContent>
          
          <TabsContent value="inventory">
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex flex-col p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <span className="text-sm text-slate-500 dark:text-slate-400">Total Products</span>
                    <span className="text-3xl font-bold text-slate-900 dark:text-white">
                      {inventoryData?.length || 0}
                    </span>
                  </div>
                  
                  <div className="flex flex-col p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <span className="text-sm text-slate-500 dark:text-slate-400">Low Stock</span>
                    <span className="text-3xl font-bold text-amber-500">
                      {inventoryData?.filter((p: any) => p.needsRestock)?.length || 0}
                    </span>
                  </div>
                  
                  <div className="flex flex-col p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <span className="text-sm text-slate-500 dark:text-slate-400">Out of Stock</span>
                    <span className="text-3xl font-bold text-red-500">
                      {inventoryData?.filter((p: any) => p.stockAvailable === 0)?.length || 0}
                    </span>
                  </div>
                </div>
                
                <div className="border rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                    <thead className="bg-slate-50 dark:bg-slate-800">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Product
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Category
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Price
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Stock
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
                      {inventoryData?.map((product: any) => (
                        <tr 
                          key={product.id} 
                          className="hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                          onClick={() => handleProductClick(product.id)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className="material-icons text-slate-400 mr-2">
                                {product.icon || 'inventory_2'}
                              </span>
                              <div className="text-sm font-medium text-slate-900 dark:text-white">
                                {product.name}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-slate-500 dark:text-slate-400">
                              {product.category}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-slate-900 dark:text-white">
                              ₹{Number(product.price).toLocaleString('en-IN')}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-slate-900 dark:text-white">
                              {product.stockAvailable || 0}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              product.needsRestock
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
                                : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                            }`}>
                              {product.needsRestock ? 'Low Stock' : 'In Stock'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="performance">
            <ProductList onProductClick={handleProductClick} showPerformanceData={true} />
          </TabsContent>
        </Tabs>
        
        {/* Product Detail Modal */}
        {selectedProductId && (
          <ProductDetail 
            productId={selectedProductId} 
            isOpen={isDetailOpen} 
            onClose={handleDetailClose} 
          />
        )}
      </div>
    </Layout>
  );
};

export default Products;
