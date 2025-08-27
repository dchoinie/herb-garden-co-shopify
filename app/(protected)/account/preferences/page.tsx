import { redirect } from "next/navigation";
import { getCustomerSession, getCustomerAccount } from "@/lib/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Bell,
  Mail,
  Shield,
  ArrowRight,
  User,
  Smartphone,
  Globe,
} from "lucide-react";
import Link from "next/link";

export default async function PreferencesPage() {
  const session = await getCustomerSession();

  // Middleware handles authentication, but we still need the session for the component
  if (!session) {
    redirect("/account/login");
  }

  const customer = await getCustomerAccount(session.customerId);

  if (!customer) {
    redirect("/account/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Account Preferences
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Notification Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Choose how you want to receive updates about your orders and
                  account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Email Notifications</Label>
                      <p className="text-sm text-gray-600">
                        Receive order updates and account notifications via
                        email
                      </p>
                    </div>
                    <Switch defaultChecked={customer.acceptsMarketing} />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">
                        Marketing Communications
                      </Label>
                      <p className="text-sm text-gray-600">
                        Receive updates about new products, sales, and special
                        offers
                      </p>
                    </div>
                    <Switch defaultChecked={customer.acceptsMarketing} />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">SMS Notifications</Label>
                      <p className="text-sm text-gray-600">
                        Get order updates and delivery notifications via text
                        message
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>

                <div className="pt-4">
                  <Button variant="outline" size="sm">
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Privacy & Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Privacy & Security
                </CardTitle>
                <CardDescription>
                  Manage your account security and privacy settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">
                      Two-Factor Authentication
                    </Label>
                    <p className="text-sm text-gray-600">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Enable
                  </Button>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Password</Label>
                    <p className="text-sm text-gray-600">
                      Update your account password
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Change
                  </Button>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Account Deletion</Label>
                    <p className="text-sm text-gray-600">
                      Permanently delete your account and all associated data
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Data & Export */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Data & Export
                </CardTitle>
                <CardDescription>
                  Download your data or manage your information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Export My Data</Label>
                    <p className="text-sm text-gray-600">
                      Download a copy of your account data
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Export
                  </Button>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Data Usage</Label>
                    <p className="text-sm text-gray-600">
                      View how your data is being used
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Current Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Current Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Email</span>
                  <Badge variant="outline">{customer.email}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Marketing</span>
                  <Badge
                    variant={
                      customer.acceptsMarketing ? "default" : "secondary"
                    }
                  >
                    {customer.acceptsMarketing ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Member Since</span>
                  <span className="text-sm font-medium">
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/account">
                  <Button variant="outline" className="w-full justify-start">
                    <User className="mr-2 h-4 w-4" />
                    Account Details
                  </Button>
                </Link>
                <Link href="/account/orders">
                  <Button variant="outline" className="w-full justify-start">
                    <Mail className="mr-2 h-4 w-4" />
                    Order History
                  </Button>
                </Link>
                <Link href="/account/addresses">
                  <Button variant="outline" className="w-full justify-start">
                    <Smartphone className="mr-2 h-4 w-4" />
                    Manage Addresses
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Back to account */}
        <div className="mt-8">
          <Link href="/account">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowRight className="h-4 w-4 rotate-180" />
              Back to Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
