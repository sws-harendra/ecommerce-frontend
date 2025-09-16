// components/OrderDetailsModal.tsx
import { X } from "lucide-react";
import { Order } from "../dashboard/orders/page";
import { getImageUrl } from "@/app/utils/getImageUrl";

interface OrderDetailsModalProps {
  order: Order;
  onClose: () => void;
}

const OrderDetailsModal = ({ order, onClose }: OrderDetailsModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Order Details #{order.id}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Order Information</h3>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Order ID:</span> #{order.id}
                </p>
                <p>
                  <span className="font-medium">Date:</span>{" "}
                  {new Date(order.createdAt).toLocaleString()}
                </p>
                <p>
                  <span className="font-medium">Status:</span>{" "}
                  <span className="capitalize">{order.status}</span>
                </p>
                <p>
                  <span className="font-medium">Payment Status:</span>{" "}
                  <span className="capitalize">{order.paymentStatus}</span>
                </p>
                <p>
                  <span className="font-medium">Payment Method:</span>{" "}
                  {order.paymentMethod.toUpperCase()}
                </p>
                <p>
                  <span className="font-medium">Total Amount:</span>
                  {order.totalAmount.toFixed(2)}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Shipping Address</h3>
              {order.OrderAddress && (
                <div className="space-y-2">
                  <p>{order.OrderAddress.address1}</p>
                  {order.OrderAddress.address2 && (
                    <p>{order.OrderAddress.address2}</p>
                  )}
                  <p>
                    {order.OrderAddress.city}, {order.OrderAddress.zipCode}
                  </p>
                  {order.OrderAddress.country && (
                    <p>{order.OrderAddress.country}</p>
                  )}
                  <p>
                    <span className="font-medium">Address Type:</span>{" "}
                    {order.OrderAddress.addressType}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="text-lg font-medium mb-4">Order Items</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Product</th>
                    <th className="px-4 py-2 text-left">Price</th>
                    <th className="px-4 py-2 text-left">Quantity</th>
                    <th className="px-4 py-2 text-left">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {order.OrderItems.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          {/* Show variant image if exists, otherwise product image */}
                          <img
                            src={getImageUrl(
                              item.variant?.image || item.Product.images?.[0]
                            )}
                            alt={item.Product.name}
                            className="w-12 h-12 object-cover rounded mr-3"
                          />
                          <div>
                            <p className="font-medium">{item.Product.name}</p>
                            {item?.variantname && (
                              <p className="text-sm text-gray-500">
                                Variant: {item?.variantname}
                              </p>
                            )}
                            <p className="text-sm text-gray-500">
                              SKU: {item.variant?.sku || item.Product.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        ₹
                        {parseFloat(item.variant?.price || item.price).toFixed(
                          2
                        )}
                      </td>
                      <td className="px-4 py-3">{item.quantity}</td>
                      <td className="px-4 py-3">
                        ₹{parseFloat(item.subtotal).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment Information */}
          {order.Payments && order.Payments.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-4">Payment Information</h3>
              <div className="border rounded-lg p-4">
                {order.Payments.map((payment) => (
                  <div key={payment.id} className="grid grid-cols-2 gap-4">
                    <p>
                      <span className="font-medium">Payment ID:</span>{" "}
                      {payment.id}
                    </p>
                    <p>
                      <span className="font-medium">Amount:</span>
                      {payment.amount.toFixed(2)}
                    </p>
                    <p>
                      <span className="font-medium">Method:</span>{" "}
                      {payment.method}
                    </p>
                    <p>
                      <span className="font-medium">Status:</span>{" "}
                      {payment.status}
                    </p>
                    <p>
                      <span className="font-medium">Transaction ID:</span>{" "}
                      {payment.transactionId || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Date:</span>{" "}
                      {new Date(payment.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end p-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
