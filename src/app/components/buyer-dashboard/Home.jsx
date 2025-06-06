// components/Dashboard.js
const cards = [
  { title: "Messages", subtitle: "1 New Message", highlight: true },
  { title: "Favourite Products" },
  { title: "Favourite Supplier" },
  { title: "My Reviews" },
  { title: "My RFQ" },
  { title: "My History" },
];

export default function Dashboard() {
  return (
    <div className=" bg-[#f1f1f1] text-black flex flex-col items-center justify-start p-6 space-y-6">
      {/* Profile Info */}
      <div className="bg-white w-full max-w-6xl p-6 font-sans rounded-md border border-[#ACAAAA]">
        <h2 className="text-2xl font-bold text-black">Akhtar Hussain</h2>
        <p className="text-sm text-gray-700 mt-4">
          Member Since March, 2021 (1y - 5M)
        </p>
      </div>

      {/* Dashboard Cards */}
      <div className="w-full max-w-4xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between h-28"
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
              <div className="text-sm text-gray-500">Total - 310</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
