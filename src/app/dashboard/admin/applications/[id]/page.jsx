"use client";
import { useParams, useRouter } from "next/navigation";

const mockApplications = [
  {
    id: "1",
    name: "Alpha Store",
    business: "Retail",
    products: "Groceries, Stationery",
    offers: "Discounts on bulk",
    image: "/uploads/store1.jpg",
    website: "https://alphastore.com",
    email: "alpha@example.com",
    phone: "+1234567890",
    phone2: "+1234567891",
    phone3: "",
    whatsapp: "+923001112233",
    whatsapp2: "",
    landmark: "Near City Mall",
    status: "Pending",
    description: "Looking to expand reach via B2B platform.",
  },
  {
    id: "2",
    name: "Beta Mart",
    business: "Wholesale",
    products: "Electronics, Mobile Accessories",
    offers: "Free shipping on orders over $500",
    image: "https://media.istockphoto.com/id/1149521311/photo/factory-warehouse-interior.jpg?s=1024x1024&w=is&k=20&c=4rkFp9CxX_Iia8AyH4WGNyKz6TzTo0ObDPdvXPmwTx4=",
    website: "https://betamart.com",
    email: "beta@example.com",
    phone: "+9876543210",
    phone2: "098098098098",
    phone3: "09809809890",
    whatsapp: "+923004445566",
    whatsapp2: "+923007778899",
    landmark: "Opposite Metro Station",
    status: "Approved",
    description: "Looking for B2B partners and product showcase.",
  },
];


export default function ApplicationDetail() {
    const { id } = useParams();
    const router = useRouter();
    const data = mockApplications.find((item) => item.id === id);

    if (!data) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-600 font-semibold text-xl">
                Application not found.
            </div>
        );
    }

    const handleAction = (status) => {
        alert(`Application marked as ${status}`);
        router.push("/dashboard/admin");
    };

    return (
        <div className="min-h-screen bg-[#F1F1F1] p-6">
            <h1 className="text-2xl font-bold text-[#000000] mb-6">
                Seller Application Detail
            </h1>

            <div className="bg-white shadow-md rounded-lg p-6 space-y-4 text-[#000000]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Store Name" value={data.name} />
                    <Field label="Business Type" value={data.business} />
                    <Field label="Type of Products" value={data.products} />
                    <Field label="Offers" value={data.offers} />
                    <Field label="Website" value={data.website} isLink />
                    <Field label="Email" value={data.email} />
                    <Field label="Phone Number" value={data.phone} />
                    <Field label="Phone Number #2" value={data.phone2} />
                    <Field label="Phone Number #3" value={data.phone3} />
                    <Field label="WhatsApp Number" value={data.whatsapp} />
                    <Field label="WhatsApp Number #2" value={data.whatsapp2} />
                    <Field label="Landmark Nearby" value={data.landmark} />
                    <Field label="Status" value={data.status} />
                </div>

                <div>
                    <p className="font-semibold">Description:</p>
                    <p className="text-sm text-gray-700">{data.description}</p>
                </div>

                {data.image && (
                    <div className="mt-4">
                        <p className="font-semibold mb-1">Title Picture:</p>
                        <img
                            src={data.image}
                            alt="Store Title"
                            className="w-full max-w-sm rounded-lg border border-gray-300"
                        />
                    </div>
                )}

                <div className="mt-6 flex gap-4">
                    <button
                        onClick={() => handleAction("Approved")}
                        className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
                    >
                        Approve
                    </button>
                    <button
                        onClick={() => handleAction("Rejected")}
                        className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700"
                    >
                        Reject
                    </button>
                </div>
            </div>
        </div>
    );
}

const Field = ({ label, value, isLink }) => {
    if (!value) return null;
    return (
        <div>
            <p className="font-semibold">{label}</p>
            {isLink ? (
                <a href={value} className="text-blue-600 underline text-sm" target="_blank">
                    {value}
                </a>
            ) : (
                <p className="text-sm text-gray-700">{value}</p>
            )}
        </div>
    );
};
