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
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface Deal {
  id: number;
  customerId: number;
  companyName: string;
  title: string;
  stage: string;
  value: string;
  probability: number;
  createdAt: string;
  updatedAt: string;
}

interface Customer {
  id: number;
  name: string;
  companyName: string;
}

const formSchema = z.object({
  customerId: z.number({
    required_error: "Please select a customer",
  }),
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  companyName: z.string().min(2, { message: "Company name is required." }),
  stage: z.string({
    required_error: "Please select a stage",
  }),
  value: z.string().min(1, { message: "Value is required." }),
  probability: z.preprocess(
    (val) => parseInt(val as string, 10),
    z.number().min(0).max(100)
  ),
});

const PipelineView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const { data: deals, isLoading: dealsLoading } = useQuery<Deal[]>({
    queryKey: ['/api/deals'],
  });

  const { data: customers, isLoading: customersLoading } = useQuery<Customer[]>({
    queryKey: ['/api/customers'],
  });

  const isLoading = dealsLoading || customersLoading;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      companyName: "",
      stage: "lead",
      value: "",
      probability: 20,
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await apiRequest('POST', '/api/deals', data);
      queryClient.invalidateQueries({ queryKey: ['/api/deals'] });
      toast({
        title: "Deal added",
        description: "The deal has been added to your pipeline.",
      });
      form.reset();
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add the deal. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredDeals = deals?.filter(deal => {
    const matchesSearch = 
      deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStage = selectedStage ? deal.stage === selectedStage : true;
    
    return matchesSearch && matchesStage;
  });

  const formatCurrency = (amount: string) => {
    const numValue = parseFloat(amount);
    if (numValue >= 1000000) {
      return `₹${(numValue / 100000).toFixed(2)}L`;
    }
    return `₹${parseInt(amount).toLocaleString('en-IN')}`;
  };

  // Calculate stage totals
  const stageSummary = {
    lead: { count: 0, value: 0 },
    qualified: { count: 0, value: 0 },
    proposal: { count: 0, value: 0 },
    closed: { count: 0, value: 0 }
  };

  deals?.forEach(deal => {
    if (stageSummary[deal.stage as keyof typeof stageSummary]) {
      stageSummary[deal.stage as keyof typeof stageSummary].count += 1;
      stageSummary[deal.stage as keyof typeof stageSummary].value += parseFloat(deal.value);
    }
  });

  const getStageColor = (stage: string) => {
    switch (stage.toLowerCase()) {
      case 'lead':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'qualified':
        return 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300';
      case 'proposal':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300';
      case 'closed':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      default:
        return 'bg-slate-100 dark:bg-slate-900/30 text-slate-800 dark:text-slate-300';
    }
  };

  const handleSelectCustomer = (customerId: number) => {
    if (customers) {
      const customer = customers.find(c => c.id === customerId);
      if (customer) {
        form.setValue('companyName', customer.companyName);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Pipeline Stage Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          className={`bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 p-5 cursor-pointer hover:border-blue-500 ${!selectedStage || selectedStage === 'lead' ? 'border-blue-500 dark:border-blue-500' : ''}`}
          onClick={() => setSelectedStage(selectedStage === 'lead' ? null : 'lead')}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-900 dark:text-white">Lead</h3>
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-xs font-medium">
              {stageSummary.lead.count}
            </span>
          </div>
          <p className="text-xl font-bold text-slate-900 dark:text-white">
            {formatCurrency(stageSummary.lead.value.toString())}
          </p>
        </div>

        <div 
          className={`bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 p-5 cursor-pointer hover:border-indigo-500 ${selectedStage === 'qualified' ? 'border-indigo-500 dark:border-indigo-500' : ''}`}
          onClick={() => setSelectedStage(selectedStage === 'qualified' ? null : 'qualified')}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-900 dark:text-white">Qualified</h3>
            <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 rounded-full text-xs font-medium">
              {stageSummary.qualified.count}
            </span>
          </div>
          <p className="text-xl font-bold text-slate-900 dark:text-white">
            {formatCurrency(stageSummary.qualified.value.toString())}
          </p>
        </div>

        <div 
          className={`bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 p-5 cursor-pointer hover:border-purple-500 ${selectedStage === 'proposal' ? 'border-purple-500 dark:border-purple-500' : ''}`}
          onClick={() => setSelectedStage(selectedStage === 'proposal' ? null : 'proposal')}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-900 dark:text-white">Proposal</h3>
            <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-xs font-medium">
              {stageSummary.proposal.count}
            </span>
          </div>
          <p className="text-xl font-bold text-slate-900 dark:text-white">
            {formatCurrency(stageSummary.proposal.value.toString())}
          </p>
        </div>

        <div 
          className={`bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 p-5 cursor-pointer hover:border-green-500 ${selectedStage === 'closed' ? 'border-green-500 dark:border-green-500' : ''}`}
          onClick={() => setSelectedStage(selectedStage === 'closed' ? null : 'closed')}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-900 dark:text-white">Closed</h3>
            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-xs font-medium">
              {stageSummary.closed.count}
            </span>
          </div>
          <p className="text-xl font-bold text-slate-900 dark:text-white">
            {formatCurrency(stageSummary.closed.value.toString())}
          </p>
        </div>
      </div>

      {/* Search and Add Deal */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="w-full md:w-96">
          <Input
            placeholder="Search deals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add Deal</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Deal</DialogTitle>
              <DialogDescription>
                Create a new deal and add it to your sales pipeline.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="customerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer</FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(parseInt(value));
                          handleSelectCustomer(parseInt(value));
                        }}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a customer" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {customers?.map(customer => (
                            <SelectItem key={customer.id} value={customer.id.toString()}>
                              {customer.name} - {customer.companyName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deal Title</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g., Enterprise CRM Implementation" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Company name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stage</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a stage" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="lead">Lead</SelectItem>
                          <SelectItem value="qualified">Qualified</SelectItem>
                          <SelectItem value="proposal">Proposal</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Value (INR)</FormLabel>
                      <FormControl>
                        <Input placeholder="50000" {...field} />
                      </FormControl>
                      <FormDescription>Enter the deal value in Indian Rupees</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="probability"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Probability (%)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" max="100" placeholder="20" {...field} />
                      </FormControl>
                      <FormDescription>Estimate the probability of closing this deal (0-100%)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Save Deal</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Deals Table */}
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
                <TableHead>Deal</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Probability</TableHead>
                <TableHead>Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDeals?.map((deal) => (
                <TableRow key={deal.id}>
                  <TableCell className="font-medium">{deal.title}</TableCell>
                  <TableCell>{deal.companyName}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStageColor(deal.stage)}`}>
                      {deal.stage.charAt(0).toUpperCase() + deal.stage.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>{formatCurrency(deal.value)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="w-16 bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mr-2">
                        <div 
                          className={`${deal.stage === 'closed' ? 'bg-accent' : 'bg-secondary'} h-1.5 rounded-full`} 
                          style={{ width: `${deal.probability}%` }}>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{deal.probability}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(deal.updatedAt).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
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

export default PipelineView;
