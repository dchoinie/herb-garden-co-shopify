import { getCustomerSession } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, Calendar, DollarSign, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// This would typically fetch from Shopify's Customer Orders API
// For now, we'll show a placeholder
const mockOrders = [
  {
    id: 'gid://shopify/Order/123456789',
    name: '#1001',
    createdAt: '2024-01-15T10:30:00Z',
    totalPrice: { amount: '29.99', currencyCode: 'USD' },
    fulfillmentStatus: 'FULFILLED',
    financialStatus: 'PAID',
  },
  {
    id: 'gid://shopify/Order/123456790',
    name: '#1002',
    createdAt: '2024-01-10T14:20:00Z',
    totalPrice: { amount: '45.50', currencyCode: 'USD' },
    fulfillmentStatus: 'UNFULFILLED',
    financialStatus: 'PAID',
  },
];

export default async function OrdersPage() {
  const session = await getCustomerSession();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/account" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Account
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-2">
            View your order history and track current orders
          </p>
        </div>

        {mockOrders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-600 mb-6">
                You haven't placed any orders yet. Start shopping to see your order history here.
              </p>
              <Link href="/">
                <Button>Start Shopping</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {mockOrders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        {order.name}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {order.totalPrice.amount} {order.totalPrice.currencyCode}
                        </span>
                      </CardDescription>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Badge 
                        variant={order.fulfillmentStatus === 'FULFILLED' ? 'default' : 'secondary'}
                      >
                        {order.fulfillmentStatus === 'FULFILLED' ? 'Shipped' : 'Processing'}
                      </Badge>
                      <Badge 
                        variant={order.financialStatus === 'PAID' ? 'default' : 'destructive'}
                      >
                        {order.financialStatus === 'PAID' ? 'Paid' : 'Pending'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
