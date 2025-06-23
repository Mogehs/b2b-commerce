'use client';
import { useState } from 'react';
import SellerDetails from './SellerDetails ';

const ApprovedSellersPage = () => {
  const [expandedSeller, setExpandedSeller] = useState(null);
  const toggleSellerDetails = (sellerId) => {
    setExpandedSeller(expandedSeller === sellerId ? null : sellerId);
  };
  // Dummy data for approved sellers
  const approvedSellers = [
    {
      id: 1,
      storeName: 'TechGadgets Pro',
      sellerName: 'John Smith',
      email: 'john@techgadgets.com',
      phone: '+1 (555) 123-4567',
      totalProducts: 42,
      registrationDate: '2023-01-15',
      storeCategory: 'Electronics',
      status: 'Active',
      revenue: '$12,450',
      rating: '4.8/5'
    },
    {
      id: 2,
      storeName: 'Office Solutions',
      sellerName: 'Sarah Johnson',
      email: 'sarah@officesolutions.com',
      phone: '+1 (555) 987-6543',
      totalProducts: 28,
      registrationDate: '2023-02-20',
      storeCategory: 'Office Supplies',
      status: 'Active',
      revenue: '$8,720',
      rating: '4.5/5'
    },
    {
      id: 3,
      storeName: 'Industrial Tools Co.',
      sellerName: 'Michael Chen',
      email: 'michael@industrialtools.com',
      phone: '+1 (555) 456-7890',
      totalProducts: 75,
      registrationDate: '2023-03-10',
      storeCategory: 'Industrial Equipment',
      status: 'Active',
      revenue: '$24,300',
      rating: '4.9/5'
    },
    {
      id: 4,
      storeName: 'Business Furniture',
      sellerName: 'Emily Wilson',
      email: 'emily@businessfurniture.com',
      phone: '+1 (555) 789-0123',
      totalProducts: 36,
      registrationDate: '2023-04-05',
      storeCategory: 'Furniture',
      status: 'Active',
      revenue: '$15,600',
      rating: '4.7/5'
    },
    {
      id: 5,
      storeName: 'Safety First Equipment',
      sellerName: 'David Brown',
      email: 'david@safetyfirst.com',
      phone: '+1 (555) 234-5678',
      totalProducts: 19,
      registrationDate: '2023-05-12',
      storeCategory: 'Safety Equipment',
      status: 'Active',
      revenue: '$6,890',
      rating: '4.6/5'
    }
  ];





  return (
    <div className="min-h-screen bg-gray-50">

      {/* Main Content */}
      <main className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Approved Sellers</h2>
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer">
                Export
              </button>
            </div>
          </div>
          {/* SellerTable */}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Store Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Seller Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Products
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {approvedSellers.map((seller) => [
                  <tr key={`${seller.id}-main`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-medium">
                            {seller.storeName.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{seller.storeName}</div>
                          <div className="text-sm text-gray-500">{seller.storeCategory}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{seller.sellerName}</div>
                      <div className="text-sm text-gray-500">{seller.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{seller.totalProducts}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{seller.revenue}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                    ${seller.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {seller.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => toggleSellerDetails(seller.id)}
                        className={`mr-2 ${expandedSeller === seller.id ? 'text-blue-600 cursor-pointer' : 'text-gray-600'} hover:text-blue-900 cursor-pointer`}
                      >
                        {expandedSeller === seller.id ? 'Hide Details' : 'View Details'}
                      </button>
                      {/* <button className="text-gray-600 hover:text-gray-900">
                        Edit
                      </button> */}
                    </td>
                  </tr>,
                  expandedSeller === seller.id && (
                    <tr key={`${seller.id}-details`}>
                      <td colSpan="6" className="px-6 py-4 bg-gray-50">
                        <SellerDetails seller={seller} />
                      </td>
                    </tr>
                  )
                ])}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};


export default ApprovedSellersPage;