import { redirect } from "next/navigation";
import { getCustomerSession, getCustomerOrders } from "@/lib/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Package, Calendar, DollarSign, ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function OrdersPage() {
  const session = await getCustomerSession();

  // Middleware handles authentication, but we still need the session for the component
  if (!session) {
    redirect("/account/login");
  }

  const orders = await getCustomerOrders(session.customerId);

  if (!orders) {
    redirect("/account/login");
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "fulfilled":
        return "default";
      case "unfulfilled":
        return "secondary";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
          <p className="text-gray-600 mt-2">View and track your past orders</p>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No orders yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start shopping to see your order history here
              </p>
              <Button asChild>
                <Link href="/products">Start Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        Order #{order.name}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {order.totalPriceSet?.shopMoney?.amount}{" "}
                          {order.totalPriceSet?.shopMoney?.currencyCode}
                        </span>
                      </CardDescription>
                    </div>
                    <Badge variant={getStatusColor(order.fulfillmentStatus)}>
                      {order.fulfillmentStatus}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Order items */}
                    <div className="space-y-3">
                      {order.lineItems?.nodes?.map(
                        (item: any, index: number) => (
                          <div
                            key={index}
                            className="flex items-center justify-between py-2"
                          >
                            <div className="flex items-center space-x-3">
                              {item.variant?.image && (
                                <img
                                  src={item.variant.image.url}
                                  alt={item.title}
                                  className="w-12 h-12 object-cover rounded"
                                />
                              )}
                              <div>
                                <p className="font-medium">{item.title}</p>
                                <p className="text-sm text-gray-600">
                                  Qty: {item.quantity}
                                </p>
                              </div>
                            </div>
                            <p className="font-medium">
                              {item.originalTotalSet?.shopMoney?.amount}{" "}
                              {item.originalTotalSet?.shopMoney?.currencyCode}
                            </p>
                          </div>
                        )
                      )}
                    </div>

                    <Separator />

                    {/* Order actions */}
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        {order.lineItems?.nodes?.length || 0} items
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        {order.fulfillmentStatus === "FULFILLED" && (
                          <Button variant="outline" size="sm">
                            Track Package
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

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
