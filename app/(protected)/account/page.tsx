import { redirect } from "next/navigation";
import {
  getCustomerSession,
  getCustomerByEmail,
  getCustomerOrders,
} from "@/lib/auth";
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
import {
  User,
  Mail,
  Phone,
  Calendar,
  LogOut,
  ShoppingBag,
  DollarSign,
  MapPin,
  Tag,
  Shield,
  CheckCircle,
  XCircle,
  FileText,
  Building,
  CreditCard,
  Package,
  Clock,
  Star,
} from "lucide-react";
import Link from "next/link";
import CustomerEditForm from "@/components/customer-edit-form";

export default async function AccountPage() {
  const session = await getCustomerSession();

  // Middleware handles authentication, but we still need the session for the component
  if (!session) {
    redirect("/account/login");
  }

  // Try to get comprehensive customer data from Admin API using email
  let customer;
  try {
    customer = await getCustomerByEmail(session.email);
    if (customer) {
      // Fetch orders separately
      const orders = await getCustomerOrders(customer.id);
      // Transform REST API orders to match the expected format
      customer.orders = {
        nodes: (orders || []).map((order: any) => ({
          id: order.id.toString(),
          name: order.name,
          createdAt: order.created_at,
          fulfillmentStatus: order.fulfillment_status || "unfulfilled",
          financialStatus: order.financial_status || "pending",
          totalPriceSet: {
            shopMoney: {
              amount: order.total_price,
              currencyCode: order.currency || "USD",
            },
          },
          lineItems: {
            nodes: (order.line_items || []).map((item: any) => ({
              title: item.title,
              quantity: item.quantity,
              variant: {
                image: item.variant?.image
                  ? {
                      url: item.variant.image.src,
                      altText: item.variant.image.alt,
                    }
                  : null,
              },
            })),
          },
        })),
      };
    }
  } catch (error) {
    console.error("Error fetching customer account:", error);
  }

  // If we couldn't get customer data from Admin API, use session data as fallback
  if (!customer) {
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {customer.firstName || customer.email}!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Customer Information */}
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
              <CardContent className="space-y-6">
                <CustomerEditForm customer={customer} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <p className="text-gray-900 flex items-center gap-2">
                      {customer.email}
                      {customer.verifiedEmail && (
                        <span title="Email verified">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </span>
                      )}
                      {customer.verifiedEmail === false && (
                        <span title="Email not verified">
                          <XCircle className="h-4 w-4 text-red-500" />
                        </span>
                      )}
                    </p>
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
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Member Since
                    </label>
                    <p className="text-gray-900">
                      {new Date(customer.createdAt).toLocaleDateString()}
                      {customer.lifetimeDuration && (
                        <span className="text-sm text-gray-500 ml-2">
                          ({customer.lifetimeDuration})
                        </span>
                      )}
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

                {/* Customer Tags */}
                {customer.tags && customer.tags.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                        <Tag className="h-4 w-4" />
                        Tags
                      </label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {customer.tags.map((tag: string, index: number) => (
                          <Badge key={index} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Shopping Statistics */}
            {customer.numberOfOrders !== undefined && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    Shopping Statistics
                  </CardTitle>
                  <CardDescription>
                    Your order history and spending overview
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <ShoppingBag className="h-6 w-6 text-blue-600" />
                        <span className="text-2xl font-bold text-blue-900">
                          {customer.numberOfOrders}
                        </span>
                      </div>
                      <p className="text-sm text-blue-700">Total Orders</p>
                    </div>
                    {customer.amountSpent && (
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <DollarSign className="h-6 w-6 text-green-600" />
                          <span className="text-2xl font-bold text-green-900">
                            {parseFloat(
                              customer.amountSpent.amount
                            ).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-green-700">
                          Total Spent ({customer.amountSpent.currencyCode})
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Address Information */}
            {customer.defaultAddress && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Default Address
                  </CardTitle>
                  <CardDescription>
                    Your primary shipping address
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {customer.defaultAddress.company && (
                      <p className="text-gray-900 font-medium">
                        {customer.defaultAddress.company}
                      </p>
                    )}
                    <p className="text-gray-900">
                      {customer.defaultAddress.firstName}{" "}
                      {customer.defaultAddress.lastName}
                    </p>
                    <p className="text-gray-900">
                      {customer.defaultAddress.address1}
                    </p>
                    {customer.defaultAddress.address2 && (
                      <p className="text-gray-900">
                        {customer.defaultAddress.address2}
                      </p>
                    )}
                    <p className="text-gray-600">
                      {customer.defaultAddress.city},{" "}
                      {customer.defaultAddress.province}{" "}
                      {customer.defaultAddress.zip}
                    </p>
                    <p className="text-gray-600">
                      {customer.defaultAddress.country}
                    </p>
                    {customer.defaultAddress.phone && (
                      <p className="text-gray-600">
                        {customer.defaultAddress.phone}
                      </p>
                    )}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm">
                      Edit Address
                    </Button>
                    {customer.addresses && customer.addresses.length > 1 && (
                      <Button variant="outline" size="sm">
                        View All ({customer.addresses.length})
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Orders */}
            {customer.orders && customer.orders.nodes.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Recent Orders
                  </CardTitle>
                  <CardDescription>Your latest order activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {customer.orders.nodes.slice(0, 3).map((order: any) => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">
                              {order.name}
                            </span>
                            <Badge variant="outline">
                              {order.financialStatus}
                            </Badge>
                            <Badge variant="outline">
                              {order.fulfillmentStatus}
                            </Badge>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {order.lineItems.nodes
                              .slice(0, 2)
                              .map((item: any, index: number) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-1 text-sm text-gray-600"
                                >
                                  <span>{item.title}</span>
                                  <span className="text-gray-400">
                                    ×{item.quantity}
                                  </span>
                                </div>
                              ))}
                            {order.lineItems.nodes.length > 2 && (
                              <span className="text-sm text-gray-400">
                                +{order.lineItems.nodes.length - 2} more
                              </span>
                            )}
                          </div>
                          <span className="font-medium">
                            {parseFloat(
                              order.totalPriceSet.shopMoney.amount
                            ).toLocaleString()}{" "}
                            {order.totalPriceSet.shopMoney.currencyCode}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Link href="/account/orders">
                      <Button variant="outline" className="w-full">
                        View All Orders
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}

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
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Account Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  {customer.verifiedEmail !== undefined && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Email Verified
                      </span>
                      <Badge
                        variant={
                          customer.verifiedEmail ? "default" : "destructive"
                        }
                      >
                        {customer.verifiedEmail ? "Yes" : "No"}
                      </Badge>
                    </div>
                  )}
                  {customer.validEmailAddress !== undefined && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Valid Email</span>
                      <Badge
                        variant={
                          customer.validEmailAddress ? "default" : "destructive"
                        }
                      >
                        {customer.validEmailAddress ? "Yes" : "No"}
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Customer Image */}
            {customer.image?.src && (
              <Card>
                <CardHeader>
                  <CardTitle>Profile Picture</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center">
                    <img
                      src={customer.image.src}
                      alt={customer.image.altText || "Profile"}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Customer Notes */}
            {customer.note && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{customer.note}</p>
                </CardContent>
              </Card>
            )}

            {/* Tax Information */}
            {customer.taxExempt !== undefined && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Tax Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Tax Exempt</span>
                      <Badge
                        variant={customer.taxExempt ? "default" : "secondary"}
                      >
                        {customer.taxExempt ? "Yes" : "No"}
                      </Badge>
                    </div>
                    {customer.taxExemptions &&
                      customer.taxExemptions.length > 0 && (
                        <div>
                          <span className="text-sm text-gray-600">
                            Exemptions:
                          </span>
                          <div className="mt-1 space-y-1">
                            {customer.taxExemptions.map(
                              (exemption: string, index: number) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {exemption}
                                </Badge>
                              )
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Customer Metafields */}
            {customer.metafields && customer.metafields.nodes.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Additional Info
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {customer.metafields.nodes.map((metafield: any) => (
                      <div key={metafield.id} className="text-sm">
                        <span className="font-medium text-gray-600">
                          {metafield.namespace}.{metafield.key}:
                        </span>
                        <span className="ml-2 text-gray-900">
                          {metafield.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

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
