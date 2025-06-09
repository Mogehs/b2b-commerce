const cards = [
  {
    title: "New Orders",
    subtitle: "3 Need Processing",
    highlight: true,
    total: 156,
  },
  {
    title: "Inventory Status",
    subtitle: "4 Low Stock",
    highlight: true,
    total: 42,
  },
  {
    title: "Customer Inquiries",
    subtitle: "5 Unread",
    highlight: true,
    total: 78,
  },
  { title: "Product Performance", total: "View Analytics" },
  {
    title: "Payment Status",
    subtitle: "2 Pending",
    highlight: true,
    total: "$12,450",
  },
  { title: "Shipping Status", subtitle: "7 Ready", highlight: true, total: 37 },
];

export default function Dashboard() {
  return (
    <div className="bg-[#f1f1f1] text-black flex flex-col items-center justify-start p-6 space-y-6">
      {/* Profile Info */}
      <div className="bg-white w-full max-w-6xl p-6 font-sans rounded-md border border-[#ACAAAA]">
        <div className="flex flex-col md:flex-row md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-black">Akhtar Hussain</h2>
            <p className="text-sm text-gray-700 mt-1">Supplier Dashboard</p>
            <p className="text-sm text-gray-700 mt-4">
              Business Active Since 2021
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="flex items-center">
              <span className="text-green-600 font-medium">Store Status: </span>
              <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                Online
              </span>
            </div>
            <p className="mt-2 text-sm">Fulfillment Rate: 98%</p>
            <p className="text-sm">Order Processing: 1.5 days avg</p>
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-white w-full max-w-6xl p-6 font-sans rounded-md border border-[#ACAAAA]">
        <h3 className="text-lg font-semibold mb-4">Business Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-3 rounded-md">
            <p className="text-sm text-gray-600">Monthly Revenue</p>
            <p className="text-xl font-bold text-blue-700">$12,450</p>
            <p className="text-xs text-blue-600">+15% from last month</p>
          </div>
          <div className="bg-green-50 p-3 rounded-md">
            <p className="text-sm text-gray-600">Order Completion</p>
            <p className="text-xl font-bold text-green-700">94%</p>
            <p className="text-xs text-green-600">+3% from last month</p>
          </div>
          <div className="bg-purple-50 p-3 rounded-md">
            <p className="text-sm text-gray-600">Supplier Rating</p>
            <p className="text-xl font-bold text-purple-700">4.8/5</p>
            <div className="flex text-yellow-500 text-xs">★★★★★</div>
          </div>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="w-full max-w-6xl">
        <h3 className="text-lg font-semibold mb-4">Business Operations</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between h-28 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div>
                <h2 className="text-sm text-gray-600 font-semibold mb-1">
                  {card.title}
                </h2>
                {card.highlight && (
                  <p className="text-sm text-red-600 font-medium">
                    {card.subtitle}
                  </p>
                )}
              </div>
              <div className="text-sm text-gray-500">
                {typeof card.total === "string" && !card.total.startsWith("$")
                  ? card.total
                  : `Total - ${card.total}`}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white w-full max-w-6xl p-6 font-sans rounded-md border border-[#ACAAAA]">
        <h3 className="text-lg font-semibold mb-4">Recent Business Activity</h3>
        <ul className="space-y-3">
          <li className="border-b pb-2">
            <p className="text-sm font-medium">
              New order #6723 received - 3 items for $450
            </p>
            <p className="text-xs text-gray-500">10 minutes ago</p>
          </li>
          <li className="border-b pb-2">
            <p className="text-sm font-medium">
              Inventory alert: "Black T-shirts" low stock (5 remaining)
            </p>
            <p className="text-xs text-gray-500">2 hours ago</p>
          </li>
          <li className="border-b pb-2">
            <p className="text-sm font-medium">
              Payment received for order #6720 - $325
            </p>
            <p className="text-xs text-gray-500">Yesterday</p>
          </li>
          <li>
            <p className="text-sm font-medium">
              Shipment #5490 delivered successfully
            </p>
            <p className="text-xs text-gray-500">2 days ago</p>
          </li>
        </ul>
      </div>
    </div>
  );
}
