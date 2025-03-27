import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: string;
  currency: string;
  status: string;
  icon: string;
  trend: string;
  stockAvailable?: number;
  needsRestock?: boolean;
  popularity?: number;
}

interface ProductListProps {
  onProductClick?: (productId: number) => void;
  showPerformanceData?: boolean;
}

const formSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters." }),
  description: z.string().optional(),
  category: z.string().min(2, { message: "Category is required." }),
  price: z.string().min(1, { message: "Price is required." }),
  currency: z.string().default("INR"),
  status: z.string().default("active"),
  icon: z.string().optional(),
  trend: z.string().default("0"),
});

const ProductList: React.FC<ProductListProps> = ({ onProductClick, showPerformanceData = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      price: "",
      currency: "INR",
      status: "active",
      icon: "inventory_2",
      trend: "0",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await apiRequest('POST', '/api/products', data);
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({
        title: "Product added",
        description: "The product has been added successfully.",
      });
      form.reset();
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredProducts = products?.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount: string) => {
    const numValue = parseFloat(amount);
    if (numValue >= 1000000) {
      return `₹${(numValue / 100000).toFixed(2)}L`;
    }
    return `₹${parseInt(amount).toLocaleString('en-IN')}`;
  };

  const getIconColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'software':
        return 'bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400';
      case 'support':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400';
      case 'infrastructure':
        return 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400';
      case 'services':
        return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400';
      case 'hardware':
        return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400';
      default:
        return 'bg-slate-100 dark:bg-slate-900/30 text-slate-600 dark:text-slate-400';
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="w-full md:w-96">
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add Product</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>
                Enter the product details below to add it to your catalog.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Product name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Product description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input placeholder="Software, Hardware, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (INR)</FormLabel>
                      <FormControl>
                        <Input placeholder="10000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icon</FormLabel>
                      <FormControl>
                        <Input placeholder="Material icon name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Save Product</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
          {[...Array(5)].map((_, index) => (
            <div key={index} className="h-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts?.map((product) => (
                <TableRow 
                  key={product.id}
                  className={onProductClick ? "cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800" : ""}
                  onClick={() => onProductClick && onProductClick(product.id)}
                >
                  <TableCell>
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-md ${getIconColor(product.category)} flex items-center justify-center mr-3`}>
                        <span className="material-icons text-base">{product.icon || 'inventory_2'}</span>
                      </div>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        {product.description && (
                          <div className="text-xs text-slate-500 dark:text-slate-400 max-w-xs truncate">
                            {product.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{formatCurrency(product.price)}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.status === 'active'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          : product.status === 'inactive'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                          : product.status === 'out-of-stock'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                          : 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300'
                      }`}
                    >
                      {product.status ? product.status.charAt(0).toUpperCase() + product.status.slice(1) : 'Unknown'}
                    </span>
                  </TableCell>
                  <TableCell>
                    {showPerformanceData && product.popularity ? (
                      <div className="flex items-center">
                        <div className="w-16 bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mr-2">
                          <div 
                            className="bg-green-600 h-2.5 rounded-full" 
                            style={{ width: `${Math.min(100, product.popularity)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{product.popularity}%</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <span
                          className={`${
                            parseFloat(product.trend) >= 0
                              ? 'text-green-500'
                              : 'text-red-500'
                          } flex items-center`}
                        >
                          <span className="material-icons text-sm mr-0.5">
                            {parseFloat(product.trend) >= 0 ? 'trending_up' : 'trending_down'}
                          </span>
                          {Math.abs(parseFloat(product.trend))}%
                        </span>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ProductList;
