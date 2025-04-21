import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import TicketList from '@/components/support/TicketList';
import TicketDetail from '@/components/support/TicketDetail';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const Support: React.FC = () => {
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const { toast } = useToast();
  
  // Get all tickets
  const { data: ticketsData } = useQuery({
    queryKey: ['/api/tickets']
  });

  const handleTicketClick = (ticketId: number) => {
    setSelectedTicketId(ticketId);
    setIsDetailOpen(true);
  };

  const handleDetailClose = () => {
    setIsDetailOpen(false);
  };

  // Count tickets by status
  const countTicketsByStatus = (status: string) => {
    if (!ticketsData) return 0;
    return ticketsData.filter((ticket: any) => ticket.status.toLowerCase() === status.toLowerCase()).length;
  };

  // Count tickets by priority
  const countTicketsByPriority = (priority: string) => {
    if (!ticketsData) return 0;
    return ticketsData.filter((ticket: any) => ticket.priority.toLowerCase() === priority.toLowerCase()).length;
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Support Tickets</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage and resolve customer support issues</p>
          </div>
          
        </div>
        
        {/* Ticket Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Open Tickets</p>
                  <p className="text-2xl font-bold">{countTicketsByStatus('open')}</p>
                </div>
                <Badge className="bg-red-500 hover:bg-red-600">Open</Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">In Progress</p>
                  <p className="text-2xl font-bold">{countTicketsByStatus('in progress')}</p>
                </div>
                <Badge className="bg-amber-500 hover:bg-amber-600">In Progress</Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">High Priority</p>
                  <p className="text-2xl font-bold">{countTicketsByPriority('high')}</p>
                </div>
                <Badge className="bg-red-500 hover:bg-red-600">High</Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Resolved</p>
                  <p className="text-2xl font-bold">{countTicketsByStatus('resolved')}</p>
                </div>
                <Badge className="bg-green-500 hover:bg-green-600">Resolved</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Tickets</TabsTrigger>
            <TabsTrigger value="open">Open</TabsTrigger>
            <TabsTrigger value="inProgress">In Progress</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <TicketList onTicketClick={handleTicketClick} />
          </TabsContent>
          
          <TabsContent value="open">
            <TicketList onTicketClick={handleTicketClick} statusFilter="open" />
          </TabsContent>
          
          <TabsContent value="inProgress">
            <TicketList onTicketClick={handleTicketClick} statusFilter="in progress" />
          </TabsContent>
          
          <TabsContent value="resolved">
            <TicketList onTicketClick={handleTicketClick} statusFilter="resolved" />
          </TabsContent>
        </Tabs>
        
        {/* Ticket Detail Modal */}
        {selectedTicketId && (
          <TicketDetail 
            ticketId={selectedTicketId} 
            isOpen={isDetailOpen} 
            onClose={handleDetailClose} 
          />
        )}
      </div>
    </Layout>
  );
};

export default Support;
