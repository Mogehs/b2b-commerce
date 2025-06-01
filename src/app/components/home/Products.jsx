import React from 'react'

const products = Array.from({ length: 25 }, () => ({
    img: "/home-page/product.jpg",
    title: "Kids Custom Name T Shirt Is Free Delivery All Across Pakistan.....",
    price: "PKR - 1500",
    qty: "Min Qty - 100 Pcs",
    location: "Madina Traders - Lahore",
    btn1: "View Number",
    btn2: "Contact Seller"
}));

const Products = () => {
    return (
        <div className='grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-8 my-8'>
            {products.map((product, index) => (
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
    )
}

export default Products