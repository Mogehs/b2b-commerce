import React from 'react';

const allProducts = Array.from({ length: 25 }, () => ({
    img: "/home-page/product.jpg",
    title: "Kids Custom Name T Shirt Is Free Delivery All Across Pakistan.....",
    price: "PKR - 1500",
    qty: "Min Qty - 100 Pcs",
    location: "Madina Traders - Lahore",
    btn1: "View Number",
    btn2: "Contact Seller"
}));

// Sample category arrays (same format as allProducts, using different lengths)
const industrialMachinery = Array.from({ length: 10 }, () => ({
    img: "/home-page/product.jpg",
    title: "Industrial Machinery Sample Product",
    price: "PKR - 25,000",
    qty: "Min Qty - 10 Units",
    location: "Heavy Tools Co - Karachi",
    btn1: "View Number",
    btn2: "Contact Seller"
}));

const safetyEquipment = Array.from({ length: 8 }, () => ({
    img: "/home-page/product.jpg",
    title: "Safety Helmet - High Quality",
    price: "PKR - 1,200",
    qty: "Min Qty - 50 Units",
    location: "Safety First Supplies - Faisalabad",
    btn1: "View Number",
    btn2: "Contact Seller"
}));

const officeSupplies = Array.from({ length: 12 }, () => ({
    img: "/home-page/product.jpg",
    title: "Bulk Office Notebooks",
    price: "PKR - 200",
    qty: "Min Qty - 500 Pcs",
    location: "OfficeMart - Islamabad",
    btn1: "View Number",
    btn2: "Contact Seller"
}));

// Add more arrays as needed per category...

const Products = ({ selectedCategory }) => {
    let displayedProducts = [];

    switch (selectedCategory) {
        case "Industrial Machinery":
            displayedProducts = industrialMachinery;
            break;
        case "Safety Equipment":
            displayedProducts = safetyEquipment;
            break;
        case "Office Supplies":
            displayedProducts = officeSupplies;
            break;
        // Add more cases for other categories
        case "All Products":
        default:
            displayedProducts = allProducts;
    }

    return (
        <div className='grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-8 my-8'>
            {displayedProducts.map((product, index) => (
                <div key={index} className='flex overflow-hidden flex-col w-full gap-4'>
                    <div className='w-full'>
                        <img className='rounded-t-xl object-cover w-full' src={product.img} alt={product.title} />
                        <div className='bg-white p-2 flex flex-col gap-2 rounded-b-xl w-full'>
                            <p className='font-semibold'>{product.title}</p>
                            <p className='font-bold'>{product.price}</p>
                            <p className='font-semibold'>{product.qty}</p>
                            <p className='font-semibold'>{product.location}</p>
                        </div>
                    </div>
                    <div className='grid grid-cols-2 gap-4 w-full'>
                        <button className='bg-white text-nowrap text-[14px] font-semibold py-2 px-2 rounded hover:cursor-pointer'>{product.btn1}</button>
                        <button className='bg-white text-nowrap text-[14px] font-semibold py-2 px-2 rounded hover:cursor-pointer'>{product.btn2}</button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Products;
