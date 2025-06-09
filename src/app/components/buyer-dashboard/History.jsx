"use client";
import React, { useState } from "react";
import { FaBox, FaTruck, FaEye, FaPlus, FaMinus } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";

const initialOrders = [
  {
    id: "1001",
    date: "2025-06-06",
    status: "Delivered",
    product: {
      name: "Wireless Headphones",
      image: "/dashboardhistory/h1.webp",
      price: 60.0,
      quantity: 2,
      description: "High quality wireless headphones with noise cancellation.",
      trackingInfo: "Delivered on June 5th, 2025 via FedEx.",
    },
  },
  {
    id: "1002",
    date: "2025-05-25",
    status: "Shipped",
    product: {
      name: "Smart Watch",
      image: "/dashboardhistory/h2.webp",
      price: 75.0,
      quantity: 1,
      description: "Smart watch with health tracking features.",
      trackingInfo: "Shipped on May 24th, 2025 via UPS.",
    },
  },
  {
    id: "1003",
    date: "2025-05-10",
    status: "Cancelled",
    product: {
      name: "Gaming Keyboard",
      image: "/dashboardhistory/h3.jpg",
      price: 100.0,
      quantity: 2,
      description: "Mechanical gaming keyboard with RGB lighting.",
      trackingInfo: "Order was cancelled before shipment.",
    },
  },
  {
    id: "1004",
    date: "2025-04-28",
    status: "Delivered",
    product: {
      name: "USB-C Charger",
      image: "/dashboardhistory/h4.webp",
      price: 15.0,
      quantity: 3,
      description: "Fast charging USB-C wall charger.",
      trackingInfo: "Delivered on April 27th, 2025 via DHL.",
    },
  },
  {
    id: "1005",
    date: "2025-04-10",
    status: "Shipped",
    product: {
      name: "Bluetooth Speaker",
      image: "/dashboardhistory/h5.webp",
      price: 150.0,
      quantity: 2,
      description: "Portable Bluetooth speaker with deep bass.",
      trackingInfo: "Shipped on April 9th, 2025 via USPS.",
    },
  },
];

const StatusIcon = ({ status }) => {
  if (status === "Delivered") return <FaBox className="text-green-500" />;
  if (status === "Shipped") return <FaTruck className="text-yellow-500" />;
  return <MdOutlineCancel className="text-red-500" />;
};

const HistoryPage = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [openDetailsId, setOpenDetailsId] = useState(null);
  const [openTrackingId, setOpenTrackingId] = useState(null);

  const increaseQuantity = (orderId) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              product: {
                ...order.product,
                quantity: order.product.quantity + 1,
              },
            }
          : order
      )
    );
  };

  const decreaseQuantity = (orderId) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId && order.product.quantity > 1
          ? {
              ...order,
              product: {
                ...order.product,
                quantity: order.product.quantity - 1,
              },
            }
          : order
      )
    );
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-[#C9AF2F]">Order History</h2>
      {orders.map((order) => {
        const total = (order.product.price * order.product.quantity).toFixed(2);
        const isDetailsOpen = openDetailsId === order.id;
        const isTrackingOpen = openTrackingId === order.id;

        return (
          <div
            key={order.id}
            className="bg-white rounded-2xl shadow-md p-4 mb-6 border border-gray-200"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
              <div className="flex items-center gap-3">
                <StatusIcon status={order.status} />
                <span className="text-sm text-gray-500">
                  Order ID: <strong>{order.id}</strong>
                </span>
                <span className="text-sm text-gray-500">| {order.date}</span>
              </div>
              <span
                className={`text-sm px-3 py-1 rounded-full ${
                  order.status === "Delivered"
                    ? "bg-green-100 text-green-700"
                    : order.status === "Shipped"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {order.status}
              </span>
            </div>

            <div className="flex gap-4">
              {/* Fixed size container for image */}
              <div className="flex-shrink-0 w-20 h-20">
                <img
                  src={order.product.image}
                  alt={order.product.name}
                  className="w-full h-full object-cover rounded-lg border"
                />
              </div>

              {/* Product info + controls + details/tracking */}
              <div className="flex-1 flex flex-col">
                <h4 className="text-lg font-semibold text-[#C9AF2F]">{order.product.name}</h4>

                <div className="flex items-center gap-3 mt-1">
                  <p className="text-sm text-gray-600">
                    Price: ${order.product.price.toFixed(2)}
                  </p>

                  <div className="flex items-center border border-gray-300 rounded">
                    <button
                      onClick={() => decreaseQuantity(order.id)}
                      className="px-2 py-1 hover:bg-gray-200 rounded-l"
                      aria-label="Decrease quantity"
                    >
                      <FaMinus className="text-xs" />
                    </button>
                    <span className="px-3 py-1">{order.product.quantity}</span>
                    <button
                      onClick={() => increaseQuantity(order.id)}
                      className="px-2 py-1 hover:bg-gray-200 rounded-r"
                      aria-label="Increase quantity"
                    >
                      <FaPlus className="text-xs" />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mt-2">Total: ${total}</p>

                <div className="mt-3 flex gap-3">
                  <button
                    className="flex items-center gap-2 text-blue-600 hover:underline text-sm cursor-pointer"
                    onClick={() =>
                      setOpenDetailsId(isDetailsOpen ? null : order.id)
                    }
                  >
                    <FaEye />
                    View Details
                  </button>
                  <button
                    className="flex items-center gap-2 text-gray-600 hover:underline text-sm cursor-pointer"
                    onClick={() =>
                      setOpenTrackingId(isTrackingOpen ? null : order.id)
                    }
                  >
                    <FaTruck />
                    Track Order
                  </button>
                </div>

                {/* Details and Tracking info side by side */}
                {(isDetailsOpen || isTrackingOpen) && (
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 border border-gray-300 rounded p-3 text-gray-700">
                    {isDetailsOpen && (
                      <div>
                        <h5 className="font-semibold mb-2 text-[#C9AF2F]">Product Details:</h5>
                        <p>{order.product.description}</p>
                      </div>
                    )}
                    {isTrackingOpen && (
                      <div>
                        <h5 className="font-semibold mb-2 text-[#C9AF2F]">Tracking Info:</h5>
                        <p>{order.product.trackingInfo}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HistoryPage;
