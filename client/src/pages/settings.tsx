import React from 'react';
import Layout from '@/components/layout/Layout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTheme } from '@/context/ThemeContext';

const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage your application preferences</p>
        </div>
        
        <Tabs defaultValue="account">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Update your personal information and preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" defaultValue="Alex Morgan" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="alex@example.com" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input id="role" defaultValue="Product Manager" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                  <Label htmlFor="two-factor">Two-factor authentication</Label>
                  <Switch id="two-factor" />
                </div>
                
                <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-4">
                  <Label htmlFor="api-access">API Access</Label>
                  <Switch id="api-access" defaultChecked />
                </div>
                
                <div className="flex justify-end">
                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize the appearance of the application.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Theme</Label>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Select light or dark theme for the application.
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="theme-toggle">
                      {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                    </Label>
                    <Switch
                      id="theme-toggle"
                      checked={theme === 'dark'}
                      onCheckedChange={toggleTheme}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-4">
                  <div>
                    <Label className="text-base">Compact View</Label>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Reduce the spacing between elements for a more compact UI.
                    </p>
                  </div>
                  <Switch id="compact-view" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Manage your notification preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Email Notifications</Label>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Receive email notifications for important events.
                    </p>
                  </div>
                  <Switch id="email-notifications" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-4">
                  <div>
                    <Label className="text-base">Push Notifications</Label>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Receive push notifications in the browser.
                    </p>
                  </div>
                  <Switch id="push-notifications" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-4">
                  <div>
                    <Label className="text-base">New Customer Alerts</Label>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Get notified when a new customer signs up.
                    </p>
                  </div>
                  <Switch id="new-customer-alerts" />
                </div>
                
                <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-4">
                  <div>
                    <Label className="text-base">Deal Updates</Label>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Get notified about changes to important deals.
                    </p>
                  </div>
                  <Switch id="deal-updates" defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
