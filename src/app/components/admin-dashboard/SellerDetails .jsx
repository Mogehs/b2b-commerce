const SellerDetails = ({ seller }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                    <div className="space-y-3">
                        <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="text-sm font-medium text-gray-900">{seller.email}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="text-sm font-medium text-gray-900">{seller.phone}</p>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Store Information</h3>
                    <div className="space-y-3">
                        <div>
                            <p className="text-sm text-gray-500">Registration Date</p>
                            <p className="text-sm font-medium text-gray-900">{seller.registrationDate}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Category</p>
                            <p className="text-sm font-medium text-gray-900">{seller.storeCategory}</p>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Performance</h3>
                    <div className="space-y-3">
                        <div>
                            <p className="text-sm text-gray-500">Total Revenue</p>
                            <p className="text-sm font-medium text-gray-900">{seller.revenue}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Customer Rating</p>
                            <p className="text-sm font-medium text-gray-900">{seller.rating}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 flex flex-wrap gap-3">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm cursor-pointer">
                    View Products
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm cursor-pointer">
                    Send Message
                </button>
                <button className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors text-sm cursor-pointer">
                    Suspend Account
                </button>
                <button className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm cursor-pointer">
                    View Analytics
                </button>
            </div>
        </div>
    );
};

export default SellerDetails;