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
import { User, Mail, Phone, Calendar, LogOut } from "lucide-react";
import Link from "next/link";

export default async function AccountPage() {
  const session = await getCustomerSession();

  // Middleware handles authentication, but we still need the session for the component
  if (!session) {
    redirect("/account/login");
  }

  // Check if we have a real Shopify customer ID or a temporary one
  const isRealCustomerId =
    session.customerId.startsWith("gid://shopify/Customer/") &&
    !session.customerId.includes("Customer/175633"); // Our fake IDs start with timestamp

  let customer;
  if (isRealCustomerId) {
    customer = await getCustomerAccount(session.customerId);
    if (!customer) {
      redirect("/account/login");
    }
  } else {
    // Use session data for temporary accounts (from activation)
    customer = {
      id: session.customerId,
      email: session.email,
      firstName: session.firstName || "",
      lastName: session.lastName || "",
      phone: "",
      acceptsMarketing: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {customer.firstName || customer.email}!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Customer Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Account Information
                </CardTitle>
                <CardDescription>
                  Your personal details and account settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      First Name
                    </label>
                    <p className="text-gray-900">
                      {customer.firstName || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Last Name
                    </label>
                    <p className="text-gray-900">
                      {customer.lastName || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      Email
                    </label>
                    <p className="text-gray-900">{customer.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      Phone
                    </label>
                    <p className="text-gray-900">
                      {customer.phone || "Not provided"}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Marketing Preferences
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant={
                          customer.acceptsMarketing ? "default" : "secondary"
                        }
                      >
                        {customer.acceptsMarketing
                          ? "Subscribed"
                          : "Not subscribed"}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Update Preferences
                  </Button>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Member Since
                    </label>
                    <p className="text-gray-900">
                      {new Date(customer.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Last Updated
                    </label>
                    <p className="text-gray-900">
                      {new Date(customer.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Manage your account and orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link href="/account/orders">
                    <Button variant="outline" className="w-full justify-start">
                      View Orders
                    </Button>
                  </Link>
                  <Link href="/account/addresses">
                    <Button variant="outline" className="w-full justify-start">
                      Manage Addresses
                    </Button>
                  </Link>
                  <Link href="/account/password">
                    <Button variant="outline" className="w-full justify-start">
                      Change Password
                    </Button>
                  </Link>
                  <Link href="/account/preferences">
                    <Button variant="outline" className="w-full justify-start">
                      Account Preferences
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Status */}
            <Card>
              <CardHeader>
                <CardTitle>Account Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <Badge variant="default">Active</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Logout */}
            <Card>
              <CardHeader>
                <CardTitle>Account Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <form action="/api/auth/logout" method="POST">
                  <Button
                    type="submit"
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
