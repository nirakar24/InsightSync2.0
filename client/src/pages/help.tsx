import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Help: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Help Center</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Get help with using InsightSync CRM</p>
        </div>
        
        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Input 
              type="search" 
              placeholder="Search for help topics..." 
              className="w-full pl-10 pr-4 py-3 text-base"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
              <span className="material-icons">search</span>
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quick Start Guides</CardTitle>
              <CardDescription>Essential guides to get you started</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-secondary hover:underline flex items-center">
                    <span className="material-icons text-sm mr-2">article</span>
                    Getting Started with InsightSync
                  </a>
                </li>
                <li>
                  <a href="#" className="text-secondary hover:underline flex items-center">
                    <span className="material-icons text-sm mr-2">article</span>
                    Setting Up Your First Pipeline
                  </a>
                </li>
                <li>
                  <a href="#" className="text-secondary hover:underline flex items-center">
                    <span className="material-icons text-sm mr-2">article</span>
                    Managing Customer Data
                  </a>
                </li>
                <li>
                  <a href="#" className="text-secondary hover:underline flex items-center">
                    <span className="material-icons text-sm mr-2">article</span>
                    Creating Effective Reports
                  </a>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Video Tutorials</CardTitle>
              <CardDescription>Learn by watching our tutorial videos</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-secondary hover:underline flex items-center">
                    <span className="material-icons text-sm mr-2">play_circle</span>
                    Dashboard Overview (5:32)
                  </a>
                </li>
                <li>
                  <a href="#" className="text-secondary hover:underline flex items-center">
                    <span className="material-icons text-sm mr-2">play_circle</span>
                    Sales Pipeline Management (8:14)
                  </a>
                </li>
                <li>
                  <a href="#" className="text-secondary hover:underline flex items-center">
                    <span className="material-icons text-sm mr-2">play_circle</span>
                    Customer Segmentation (6:45)
                  </a>
                </li>
                <li>
                  <a href="#" className="text-secondary hover:underline flex items-center">
                    <span className="material-icons text-sm mr-2">play_circle</span>
                    Support Ticket Workflow (7:21)
                  </a>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription>Quick answers to common questions</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>How do I add a new customer?</AccordionTrigger>
                <AccordionContent>
                  You can add a new customer by navigating to the Customers page and clicking on the "Add Customer" button. Fill in the required information in the form that appears and click "Save Customer".
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2">
                <AccordionTrigger>How can I track my sales pipeline?</AccordionTrigger>
                <AccordionContent>
                  The Sales Pipeline page provides a visual representation of your sales process. You can view deals by stage, add new deals, and track their progress. The dashboard also shows a summary of your pipeline data.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3">
                <AccordionTrigger>How do I export reports?</AccordionTrigger>
                <AccordionContent>
                  You can export reports by clicking the "Export Report" button in the top right corner of the Dashboard. This will download a CSV file with the current data shown in your dashboard.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4">
                <AccordionTrigger>Can I customize the dashboard view?</AccordionTrigger>
                <AccordionContent>
                  Yes, you can customize your dashboard view by going to Settings &gt; Appearance. You can change the theme, layout, and visible metrics to suit your preferences.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5">
                <AccordionTrigger>How do I create and manage support tickets?</AccordionTrigger>
                <AccordionContent>
                  Navigate to the Support page to view, create, and manage support tickets. You can create a new ticket by clicking the "Create Ticket" button, assigning it to a customer, and filling in the details.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Need More Help?</CardTitle>
            <CardDescription>Contact our support team for assistance</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row items-center gap-4">
            <Button className="w-full md:w-auto">
              <span className="material-icons mr-2">email</span>
              Email Support
            </Button>
            <Button variant="outline" className="w-full md:w-auto">
              <span className="material-icons mr-2">chat</span>
              Live Chat
            </Button>
            <Button variant="outline" className="w-full md:w-auto">
              <span className="material-icons mr-2">phone</span>
              Call Support
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Help;
