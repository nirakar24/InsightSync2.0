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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Textarea
} from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface Ticket {
  id: number;
  ticketId: string;
  customerId: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
}

interface Customer {
  id: number;
  name: string;
  companyName: string;
  avatar: string;
}

const formSchema = z.object({
  customerId: z.number({
    required_error: "Please select a customer",
  }),
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  priority: z.string({
    required_error: "Please select a priority level",
  }),
  status: z.string().default("open"),
  ticketId: z.string().optional(), // Will be generated on the server
});

const TicketList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const { data: tickets, isLoading: ticketsLoading } = useQuery<Ticket[]>({
    queryKey: ['/api/tickets'],
  });

  const { data: customers, isLoading: customersLoading } = useQuery<Customer[]>({
    queryKey: ['/api/customers'],
  });

  const isLoading = ticketsLoading || customersLoading;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      status: "open",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      // Generate a ticket ID in the format TK-XXXX
      // This will be overwritten by the server, but helps with form validation
      const ticketData = {
        ...data,
        ticketId: `TK-${Math.floor(1000 + Math.random() * 9000)}`
      };
      
      await apiRequest('POST', '/api/tickets', ticketData);
      queryClient.invalidateQueries({ queryKey: ['/api/tickets'] });
      toast({
        title: "Ticket created",
        description: "The support ticket has been created successfully.",
      });
      form.reset();
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create ticket. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getCustomerInfo = (customerId: number) => {
    return customers?.find(customer => customer.id === customerId);
  };

  const filteredTickets = tickets?.filter(ticket => {
    const matchesSearch = 
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.ticketId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter ? ticket.status === statusFilter : true;
    const matchesPriority = priorityFilter ? ticket.priority === priorityFilter : true;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-red-500';
      case 'in progress':
        return 'bg-amber-500';
      case 'resolved':
        return 'bg-green-500';
      case 'closed':
        return 'bg-slate-500';
      default:
        return 'bg-slate-500';
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      case 'in progress':
        return 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300';
      case 'resolved':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'closed':
        return 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      case 'medium':
        return 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300';
      case 'low':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300';
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    let interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
      return interval === 1 ? '1d ago' : `${interval}d ago`;
    }
    
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
      return interval === 1 ? '1h ago' : `${interval}h ago`;
    }
    
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
      return interval === 1 ? '1m ago' : `${interval}m ago`;
    }
    
    return 'just now';
  };

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <div className="flex flex-wrap gap-4">
        <div className="w-full md:w-96">
          <Input
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            variant={statusFilter === null ? "default" : "outline"}
            onClick={() => setStatusFilter(null)}
            className="text-xs h-9"
          >
            All Status
          </Button>
          <Button
            variant={statusFilter === "open" ? "default" : "outline"}
            onClick={() => setStatusFilter("open")}
            className="text-xs h-9"
          >
            Open
          </Button>
          <Button
            variant={statusFilter === "in progress" ? "default" : "outline"}
            onClick={() => setStatusFilter("in progress")}
            className="text-xs h-9"
          >
            In Progress
          </Button>
          <Button
            variant={statusFilter === "resolved" ? "default" : "outline"}
            onClick={() => setStatusFilter("resolved")}
            className="text-xs h-9"
          >
            Resolved
          </Button>
          <Button
            variant={statusFilter === "closed" ? "default" : "outline"}
            onClick={() => setStatusFilter("closed")}
            className="text-xs h-9"
          >
            Closed
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            variant={priorityFilter === null ? "default" : "outline"}
            onClick={() => setPriorityFilter(null)}
            className="text-xs h-9"
          >
            All Priority
          </Button>
          <Button
            variant={priorityFilter === "high" ? "default" : "outline"}
            onClick={() => setPriorityFilter("high")}
            className="text-xs h-9"
          >
            High
          </Button>
          <Button
            variant={priorityFilter === "medium" ? "default" : "outline"}
            onClick={() => setPriorityFilter("medium")}
            className="text-xs h-9"
          >
            Medium
          </Button>
          <Button
            variant={priorityFilter === "low" ? "default" : "outline"}
            onClick={() => setPriorityFilter("low")}
            className="text-xs h-9"
          >
            Low
          </Button>
        </div>
        
        <div className="ml-auto">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>Create Ticket</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Support Ticket</DialogTitle>
                <DialogDescription>
                  Create a new support ticket for customer issue resolution.
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
                          onValueChange={(value) => field.onChange(parseInt(value))}
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
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Brief description of the issue" {...field} />
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
                          <Textarea 
                            placeholder="Detailed description of the issue" 
                            className="h-20"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit">Create Ticket</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Tickets Table */}
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
                <TableHead>Ticket</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Issue</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets?.map((ticket) => {
                const customer = getCustomerInfo(ticket.customerId);
                return (
                  <TableRow key={ticket.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <span className={`w-2 h-2 rounded-full ${getStatusColor(ticket.status)} mr-2`}></span>
                        <span className="font-medium">{ticket.ticketId}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {customer && (
                        <div className="flex items-center">
                          <img
                            src={customer.avatar}
                            alt={`${customer.name} avatar`}
                            className="w-6 h-6 rounded-full mr-2"
                          />
                          <div>
                            <div className="font-medium text-sm">{customer.name}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">{customer.companyName}</div>
                          </div>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-md truncate">{ticket.title}</div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusTextColor(ticket.status)}`}>
                        {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{getTimeAgo(ticket.createdAt)}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {new Date(ticket.createdAt).toLocaleDateString('en-IN')}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default TicketList;
