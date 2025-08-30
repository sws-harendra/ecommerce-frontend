// components/EditOrder.tsx
"use client";

import React, { useState, useEffect } from "react";
import { X, Save, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/lib/store/store";
import {
  fetchOrderById,
  updateOrder,
} from "@/app/lib/store/features/orderSlice";

interface EditOrderProps {
  orderId: string;
  onClose?: () => void; // Optional callback for when editing is done
}

const EditOrder: React.FC<EditOrderProps> = ({ orderId, onClose }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { currentOrder, status, error } = useAppSelector(
    (state) => state.order
  );

  const [formData, setFormData] = useState({
    status: "",
    paymentStatus: "",
    paymentMethod: "",
    totalAmount: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateError, setUpdateError] = useState("");
  const loading = status === "loading";

  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderById(orderId));
    }
  }, [dispatch, orderId]);

  useEffect(() => {
    if (currentOrder && currentOrder.id === parseInt(orderId)) {
      setFormData({
        status: currentOrder.status || "",
        paymentStatus: currentOrder.paymentStatus || "",
        paymentMethod: currentOrder.paymentMethod || "",
        totalAmount: currentOrder.totalAmount || 0,
      });
    }
  }, [currentOrder, orderId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "totalAmount" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUpdateError("");

    try {
      if (orderId) {
        await dispatch(updateOrder({ orderId, orderData: formData })).unwrap();

        // Call onClose if provided, otherwise navigate back
        // if (onClose) {
        //   onClose();
        // } else {
        //   router.push("/admin/orders");
        // }
      }
    } catch (err: any) {
      setUpdateError(err.message || "Failed to update order");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading order details...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  }

  if (!currentOrder || currentOrder.id !== parseInt(orderId)) {
    return <div className="p-8 text-center">Order not found</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Order #{currentOrder.id}</h1>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Order Information</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {updateError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {updateError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Order Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Payment Status
              </label>
              <select
                name="paymentStatus"
                value={formData.paymentStatus}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Payment Status</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Payment Method
              </label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Payment Method</option>
                <option value="cod">Cash on Delivery</option>
                <option value="card">Credit/Debit Card</option>
                <option value="paypal">PayPal</option>
                <option value="bank_transfer">Bank Transfer</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Total Amount (₹)
              </label>
              <input
                type="number"
                name="totalAmount"
                value={formData.totalAmount}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Order Summary</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Order Date</p>
                  <p className="font-medium">
                    {new Date(currentOrder.createdAt!).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Customer</p>
                  <p className="font-medium">User #{currentOrder.userId}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Items</p>
                {currentOrder.OrderItems?.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex justify-between py-2 border-b"
                  >
                    <div>
                      <p className="font-medium">{item.Product?.name}</p>
                      <p className="text-sm text-gray-600">
                        {item.quantity} × ₹{item.price?.toFixed(2)}
                      </p>
                    </div>
                    <p className="font-medium"> ₹{item.subtotal?.toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total</span>
                <span>₹{currentOrder.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => router.push("/admin/orders")}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? "Updating..." : "Update Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditOrder;
