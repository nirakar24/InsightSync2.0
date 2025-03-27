import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Check } from 'lucide-react';

const About: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
            InsightSync CRM
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            The intelligent CRM system for modern businesses in India
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Why InsightSync?</CardTitle>
              <CardDescription>A comprehensive solution for customer relationship management</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                InsightSync is a powerful, data-driven CRM platform designed specifically for Indian businesses. 
                From startups to large enterprises, InsightSync helps you transform customer interactions into 
                meaningful relationships and sustainable growth.
              </p>
              <p className="mb-4">
                In today's competitive market, understanding your customers isn't just good practice—it's 
                essential for survival. InsightSync provides deep insights into customer behavior, 
                sales performance, and market trends, empowering you to make informed decisions that drive revenue.
              </p>
              <p>
                With our advanced analytics, predictive churn analysis, and comprehensive customer lifecycle tracking, 
                you'll stay ahead of the competition and maximize customer retention.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Key Highlights</CardTitle>
              <CardDescription>What sets us apart</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="mr-2 mt-1 text-green-500"><Check size={16} /></span>
                  <span>Advanced churn prediction with 90% accuracy</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1 text-green-500"><Check size={16} /></span>
                  <span>360° customer profiles with lifetime value tracking</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1 text-green-500"><Check size={16} /></span>
                  <span>Intelligent sales pipeline with win probability</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1 text-green-500"><Check size={16} /></span>
                  <span>Team performance analytics with actionable insights</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1 text-green-500"><Check size={16} /></span>
                  <span>Integrated support ticket management</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1 text-green-500"><Check size={16} /></span>
                  <span>INR-focused pricing and localized for Indian businesses</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="features" className="mb-12">
          <TabsList className="mb-6">
            <TabsTrigger value="features">Core Features</TabsTrigger>
            <TabsTrigger value="technology">Technology</TabsTrigger>
            <TabsTrigger value="methodology">Methodology</TabsTrigger>
          </TabsList>
          
          <TabsContent value="features">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Intelligent Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Our interactive dashboard provides a comprehensive overview of your business performance.
                    Track key metrics like revenue trends, customer acquisition, churn rates, and sales pipeline
                    at a glance. The dashboard dynamically updates with real-time data, ensuring you always have
                    the latest insights at your fingertips.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Customer Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Maintain detailed profiles for each customer, including contact information, purchase history,
                    support tickets, and interaction logs. Our system automatically calculates customer lifetime value
                    and churn risk, helping you identify your most valuable clients and those at risk of leaving.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Product Catalog</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Manage your product offerings with our comprehensive catalog system. Track inventory levels,
                    monitor performance metrics, and analyze sales trends by product category. Set reorder thresholds
                    and receive notifications when stock levels are low.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Sales Pipeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Track potential deals from lead to closure with our intuitive pipeline management system.
                    Our AI-powered win probability calculator helps you focus on the most promising opportunities,
                    while stage-by-stage analytics identify bottlenecks in your sales process.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Support Ticketing</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Efficiently manage customer support requests with our integrated ticketing system.
                    Assign tickets to team members, set priorities, track resolution times, and measure
                    customer satisfaction. The system automatically links tickets to customer profiles
                    for a complete view of the relationship.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Team Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Measure and improve team performance with detailed analytics. Track individual and
                    department metrics, identify top performers, and understand workload distribution.
                    Our system helps managers provide targeted coaching and optimize resource allocation.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="technology">
            <Card>
              <CardHeader>
                <CardTitle>Built on Modern Technology</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-6">
                  InsightSync is built using cutting-edge technology to ensure performance, scalability, and security:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Frontend</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="mr-2 mt-1 text-blue-500">→</span>
                        <span>React.js for a responsive, component-based UI</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 mt-1 text-blue-500">→</span>
                        <span>Tailwind CSS for consistent, beautiful styling</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 mt-1 text-blue-500">→</span>
                        <span>Recharts for interactive data visualization</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 mt-1 text-blue-500">→</span>
                        <span>React Query for efficient data fetching</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Backend</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="mr-2 mt-1 text-blue-500">→</span>
                        <span>Express.js for a robust API framework</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 mt-1 text-blue-500">→</span>
                        <span>PostgreSQL database for reliable data storage</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 mt-1 text-blue-500">→</span>
                        <span>Drizzle ORM for type-safe database operations</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 mt-1 text-blue-500">→</span>
                        <span>TypeScript for enhanced code quality and developer experience</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="methodology">
            <Card>
              <CardHeader>
                <CardTitle>Our Data Science Approach</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-6">
                  InsightSync leverages advanced analytics and data science methodologies to provide actionable insights:
                </p>
                
                <Accordion type="single" collapsible className="mb-6">
                  <AccordionItem value="clv">
                    <AccordionTrigger>
                      <span className="text-lg font-medium">Customer Lifetime Value Calculation</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-4">
                        Our customer lifetime value (CLV) model combines historical purchase data with predictive analytics 
                        to estimate the total revenue a customer will generate throughout their relationship with your business.
                      </p>
                      <p className="mb-4">
                        <strong>Formula:</strong> CLV = (Average Order Value × Purchase Frequency × Customer Lifespan) - Acquisition Cost
                      </p>
                      <p className="mb-4">
                        We enhance this calculation by incorporating:
                      </p>
                      <ul className="list-disc pl-6 mb-4 space-y-1">
                        <li>Product category affinity analysis</li>
                        <li>Seasonal buying pattern adjustment</li>
                        <li>Recency, frequency, monetary (RFM) segmentation</li>
                        <li>Support and service interaction costs</li>
                      </ul>
                      <p>
                        This comprehensive approach provides a more accurate CLV estimation than traditional methods, 
                        allowing for better customer segmentation and marketing resource allocation.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="churn">
                    <AccordionTrigger>
                      <span className="text-lg font-medium">Churn Risk Analysis</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-4">
                        Our churn prediction system uses a multi-factor model to identify customers at risk of leaving.
                        The model considers over 20 different signals to calculate a holistic churn risk score.
                      </p>
                      <p className="mb-4">
                        <strong>Key factors in our churn analysis:</strong>
                      </p>
                      <ul className="list-disc pl-6 mb-4 space-y-1">
                        <li>Purchase recency and frequency decline</li>
                        <li>Support ticket volume and sentiment</li>
                        <li>Engagement with communications</li>
                        <li>Product usage patterns (for subscription services)</li>
                        <li>Competitive market factors</li>
                        <li>Customer satisfaction metrics</li>
                      </ul>
                      <p className="mb-4">
                        The system calculates both an overall churn rate for your business (currently at 15%) and 
                        individual risk scores for each customer. High-risk customers (top 10%) are flagged for 
                        intervention.
                      </p>
                      <p>
                        Our predictive model is continuously refined through machine learning, becoming more accurate
                        over time as it incorporates the outcomes of retention initiatives.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="sales">
                    <AccordionTrigger>
                      <span className="text-lg font-medium">Sales Performance Analytics</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-4">
                        Our sales analytics engine provides comprehensive visibility into your revenue generation,
                        from lead acquisition through deal closure and beyond.
                      </p>
                      <p className="mb-4">
                        <strong>Sales pipeline analysis includes:</strong>
                      </p>
                      <ul className="list-disc pl-6 mb-4 space-y-1">
                        <li>Stage-by-stage conversion rates</li>
                        <li>Deal velocity measurements</li>
                        <li>Win/loss ratio analysis</li>
                        <li>Deal size distribution</li>
                        <li>Sale cycle duration tracking</li>
                      </ul>
                      <p className="mb-4">
                        <strong>Win probability calculation:</strong>
                      </p>
                      <p className="mb-4">
                        Our system calculates deal win probability using a combination of:
                      </p>
                      <ul className="list-disc pl-6 mb-4 space-y-1">
                        <li>Historical performance data for similar deals</li>
                        <li>Current stage in the sales process</li>
                        <li>Engagement level of the prospect</li>
                        <li>Competitive factors in the deal</li>
                        <li>Sales rep's historical performance</li>
                      </ul>
                      <p>
                        This gives your team an objective measure to prioritize opportunities and forecast revenue
                        with greater accuracy.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="products">
                    <AccordionTrigger>
                      <span className="text-lg font-medium">Product Performance Metrics</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-4">
                        Our product analytics provide deep insights into your portfolio performance, helping you
                        optimize inventory, pricing, and product development.
                      </p>
                      <p className="mb-4">
                        <strong>We measure and track:</strong>
                      </p>
                      <ul className="list-disc pl-6 mb-4 space-y-1">
                        <li>Product profitability analysis</li>
                        <li>Inventory turnover rates</li>
                        <li>Demand forecasting accuracy</li>
                        <li>Cross-selling opportunities</li>
                        <li>Price sensitivity by market segment</li>
                        <li>Product affinity grouping</li>
                      </ul>
                      <p className="mb-4">
                        Our system automatically identifies:
                      </p>
                      <ul className="list-disc pl-6 mb-4 space-y-1">
                        <li>Top-performing products based on revenue, volume, and profit margin</li>
                        <li>Products with rising or falling demand trends</li>
                        <li>Inventory risk factors (excess stock, stockout risk)</li>
                        <li>Seasonal performance patterns</li>
                      </ul>
                      <p>
                        This comprehensive view helps you make data-driven decisions about product mix,
                        pricing strategy, and inventory management.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                
                <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3">Continuous Improvement Philosophy</h3>
                  <p className="mb-4">
                    InsightSync isn't just a static tool—it's an evolving platform that gets better with use.
                    Our system incorporates machine learning algorithms that improve prediction accuracy over time
                    by learning from your business outcomes.
                  </p>
                  <p>
                    We regularly update our analytics models based on the latest research in customer behavior,
                    sales psychology, and business intelligence, ensuring you always have access to cutting-edge
                    insights for your business.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Designed for Indian Businesses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-6">
              InsightSync is specifically tailored for the unique challenges and opportunities of the Indian market:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">INR-First Approach</h3>
                <p>
                  All financial metrics and reporting are in Indian Rupees, with formatting that matches Indian numerical conventions.
                  Pricing analysis takes into account the unique price sensitivity factors in the Indian market.
                </p>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Local Business Practices</h3>
                <p>
                  The system accommodates common Indian business practices, including relationship-based selling,
                  multi-tier distribution networks, and the importance of personal connections in B2B sales.
                </p>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Market-Specific Analytics</h3>
                <p>
                  Our analytics engine incorporates factors specific to Indian markets, such as seasonal buying
                  patterns around major festivals and regional market variations across different states.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="text-center p-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white mb-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Transform Your Customer Relationships?</h2>
          <p className="text-lg mb-6 max-w-3xl mx-auto">
            Join the hundreds of Indian businesses that have improved customer retention by 25% and
            increased sales efficiency by 40% with InsightSync CRM.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="px-6 py-3 bg-white text-blue-600 rounded-md font-medium hover:bg-blue-50 transition-colors">
              Request a Demo
            </button>
            <button className="px-6 py-3 bg-transparent border border-white rounded-md font-medium hover:bg-white/10 transition-colors">
              View Pricing
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">97%</div>
            <p className="text-slate-600 dark:text-slate-400">Customer satisfaction rate</p>
          </div>
          <div className="text-center p-6">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">₹2.4 Cr+</div>
            <p className="text-slate-600 dark:text-slate-400">Annual revenue impact for average client</p>
          </div>
          <div className="text-center p-6">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">35%</div>
            <p className="text-slate-600 dark:text-slate-400">Average increase in customer retention</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;