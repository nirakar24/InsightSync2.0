import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Timeline, TimelineItem, TimelineItemContent, TimelineItemIndicator, TimelineItemTitle } from '@/components/ui/timeline';
import { apiRequest } from '@/lib/queryClient';
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
  category?: string;
  assignedTo?: string;
  resolution?: string;
  dueDate?: string;
  attachments?: string[];
  satisfaction?: number;
  notes?: string;
}

interface Customer {
  id: number;
  name: string;
  email: string;
  companyName: string;
}

interface TeamMember {
  id: number;
  name: string;
  role: string;
}

interface TicketDetailProps {
  ticketId: number;
  isOpen: boolean;
  onClose: () => void;
}

// Form schema for updating ticket
const ticketUpdateSchema = z.object({
  status: z.string(),
  priority: z.string(),
  category: z.string().optional(),
  assignedTo: z.string().optional(),
  resolution: z.string().optional(),
  notes: z.string().optional(),
});

type TicketUpdateSchema = z.infer<typeof ticketUpdateSchema>;

const TicketDetail: React.FC<TicketDetailProps> = ({ ticketId, isOpen, onClose }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  
  // Get ticket data
  const { data: ticketData, isLoading: isLoadingTicket } = useQuery({
    queryKey: [`/api/tickets/${ticketId}`],
    enabled: isOpen && !!ticketId,
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to load ticket data",
        variant: "destructive"
      });
    }
  });

  // Get customer data
  const { data: customerData, isLoading: isLoadingCustomer } = useQuery({
    queryKey: [`/api/customers/${ticketData?.customerId}`],
    enabled: isOpen && !!ticketData?.customerId,
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to load customer data",
        variant: "destructive"
      });
    }
  });

  // Get team members for assignment
  const { data: teamMembers, isLoading: isLoadingTeam } = useQuery({
    queryKey: ['/api/team-members'],
    enabled: isOpen,
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to load team member data",
        variant: "destructive"
      });
    }
  });

  const isLoading = isLoadingTicket || isLoadingCustomer || isLoadingTeam;
  const ticket: Ticket | undefined = ticketData;
  const customer: Customer | undefined = customerData;

  // Update ticket mutation
  const mutation = useMutation({
    mutationFn: async (data: TicketUpdateSchema) => {
      const response = await apiRequest(`/api/tickets/${ticketId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Ticket updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/tickets/${ticketId}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/tickets'] });
      setIsEditing(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update ticket",
        variant: "destructive"
      });
    }
  });

  // Setup form
  const form = useForm<TicketUpdateSchema>({
    resolver: zodResolver(ticketUpdateSchema),
    defaultValues: {
      status: ticket?.status || '',
      priority: ticket?.priority || '',
      category: ticket?.category || '',
      assignedTo: ticket?.assignedTo || '',
      resolution: ticket?.resolution || '',
      notes: ticket?.notes || '',
    },
  });

  // Update form values when ticket data changes
  React.useEffect(() => {
    if (ticket) {
      form.reset({
        status: ticket.status,
        priority: ticket.priority,
        category: ticket.category || '',
        assignedTo: ticket.assignedTo || '',
        resolution: ticket.resolution || '',
        notes: ticket.notes || '',
      });
    }
  }, [ticket, form]);

  // Handle form submission
  const onSubmit = (data: TicketUpdateSchema) => {
    mutation.mutate(data);
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open': return 'bg-red-500 hover:bg-red-600';
      case 'in progress': return 'bg-amber-500 hover:bg-amber-600';
      case 'resolved': return 'bg-green-500 hover:bg-green-600';
      case 'closed': return 'bg-slate-500 hover:bg-slate-600';
      default: return 'bg-blue-500 hover:bg-blue-600';
    }
  };

  // Get priority badge color
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-500 hover:bg-red-600';
      case 'medium': return 'bg-amber-500 hover:bg-amber-600';
      case 'low': return 'bg-green-500 hover:bg-green-600';
      default: return 'bg-blue-500 hover:bg-blue-600';
    }
  };

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

  if (!ticket) {
    return (
      <Dialog open={isOpen} onOpenChange={() => onClose()}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Ticket Not Found</DialogTitle>
            <DialogDescription>
              The requested ticket information could not be loaded.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={onClose}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl flex items-center">
                <span>Ticket #{ticket.ticketId}</span>
                <Badge className={`ml-2 ${getStatusColor(ticket.status)}`}>
                  {ticket.status}
                </Badge>
                <Badge className={`ml-2 ${getPriorityColor(ticket.priority)}`}>
                  {ticket.priority}
                </Badge>
              </DialogTitle>
              <DialogDescription className="mt-1">
                {ticket.title}
              </DialogDescription>
            </div>
            <div>
              {!isEditing && (
                <Button onClick={() => setIsEditing(true)}>Edit Ticket</Button>
              )}
            </div>
          </div>
        </DialogHeader>
        
        {isEditing ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="in progress">In Progress</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
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
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="technical">Technical</SelectItem>
                          <SelectItem value="billing">Billing</SelectItem>
                          <SelectItem value="feature">Feature Request</SelectItem>
                          <SelectItem value="sales">Sales</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="assignedTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assigned To</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select team member" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">Unassigned</SelectItem>
                          {teamMembers?.map((member: TeamMember) => (
                            <SelectItem key={member.id} value={String(member.id)}>
                              {member.name} ({member.role})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="resolution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resolution</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter resolution details" 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Internal Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter internal notes" 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                  disabled={mutation.isPending}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <>
            <Tabs defaultValue="details">
              <TabsList className="mb-4">
                <TabsTrigger value="details">Ticket Details</TabsTrigger>
                <TabsTrigger value="customer">Customer Info</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex flex-col p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <span className="text-sm text-slate-500 dark:text-slate-400">Created</span>
                    <span className="font-medium">
                      {formatDate(ticket.createdAt)}
                    </span>
                  </div>
                  
                  <div className="flex flex-col p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <span className="text-sm text-slate-500 dark:text-slate-400">Last Updated</span>
                    <span className="font-medium">
                      {formatDate(ticket.updatedAt)}
                    </span>
                  </div>
                  
                  <div className="flex flex-col p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <span className="text-sm text-slate-500 dark:text-slate-400">Category</span>
                    <span className="font-medium">
                      {ticket.category || 'Uncategorized'}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[150px] rounded-md border p-4">
                        <p className="text-sm">{ticket.description}</p>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                  
                  {ticket.resolution && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Resolution</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[100px] rounded-md border p-4">
                          <p className="text-sm">{ticket.resolution}</p>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  )}
                  
                  {ticket.notes && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Internal Notes</CardTitle>
                        <CardDescription>Only visible to team members</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[100px] rounded-md border p-4">
                          <p className="text-sm">{ticket.notes}</p>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  )}
                  
                  {ticket.assignedTo && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Assignment</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center">
                          <span className="material-icons text-secondary mr-2">person</span>
                          <span>
                            Assigned to: {
                              teamMembers?.find((m: TeamMember) => String(m.id) === ticket.assignedTo)?.name || 
                              `Team Member #${ticket.assignedTo}`
                            }
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="customer">
                {customer ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Customer Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <span className="material-icons text-secondary mr-2">business</span>
                          <div>
                            <p className="font-medium">{customer.name}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              {customer.companyName}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <span className="material-icons text-secondary mr-2">email</span>
                          <p>{customer.email}</p>
                        </div>
                        
                        <div className="mt-4">
                          <Button variant="outline" size="sm">
                            <span className="material-icons text-sm mr-1">person</span>
                            View Customer Profile
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                        Customer information could not be loaded
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="timeline">
                <Card>
                  <CardHeader>
                    <CardTitle>Ticket Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Timeline>
                      <TimelineItem>
                        <TimelineItemIndicator />
                        <TimelineItemContent>
                          <TimelineItemTitle>Ticket Created</TimelineItemTitle>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {formatDate(ticket.createdAt)}
                          </p>
                          <p className="text-sm mt-1">
                            Ticket #{ticket.ticketId} created with {ticket.priority} priority.
                          </p>
                        </TimelineItemContent>
                      </TimelineItem>
                      
                      {ticket.status !== 'open' && (
                        <TimelineItem>
                          <TimelineItemIndicator />
                          <TimelineItemContent>
                            <TimelineItemTitle>Status Updated</TimelineItemTitle>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              {formatDate(ticket.updatedAt)}
                            </p>
                            <p className="text-sm mt-1">
                              Ticket status changed to <Badge className={getStatusColor(ticket.status)}>{ticket.status}</Badge>
                            </p>
                          </TimelineItemContent>
                        </TimelineItem>
                      )}
                      
                      {ticket.assignedTo && (
                        <TimelineItem>
                          <TimelineItemIndicator />
                          <TimelineItemContent>
                            <TimelineItemTitle>Ticket Assigned</TimelineItemTitle>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              {formatDate(ticket.updatedAt)}
                            </p>
                            <p className="text-sm mt-1">
                              Assigned to {
                                teamMembers?.find((m: TeamMember) => String(m.id) === ticket.assignedTo)?.name || 
                                `Team Member #${ticket.assignedTo}`
                              }
                            </p>
                          </TimelineItemContent>
                        </TimelineItem>
                      )}
                      
                      {ticket.resolution && (
                        <TimelineItem>
                          <TimelineItemIndicator />
                          <TimelineItemContent>
                            <TimelineItemTitle>Resolution Added</TimelineItemTitle>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              {formatDate(ticket.updatedAt)}
                            </p>
                            <p className="text-sm mt-1">
                              Resolution details added to the ticket.
                            </p>
                          </TimelineItemContent>
                        </TimelineItem>
                      )}
                    </Timeline>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            <DialogFooter className="flex items-center justify-between mt-6">
              <div>
                {ticket.status !== 'closed' && (
                  <Button 
                    variant="outline" 
                    className="bg-red-100 hover:bg-red-200 text-red-700 border-red-300"
                    onClick={() => {
                      form.setValue('status', 'closed');
                      mutation.mutate({ ...form.getValues(), status: 'closed' });
                    }}
                  >
                    <span className="material-icons text-sm mr-1">close</span>
                    Close Ticket
                  </Button>
                )}
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" onClick={onClose}>Close View</Button>
                <Button onClick={() => setIsEditing(true)}>Edit Ticket</Button>
              </div>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TicketDetail;