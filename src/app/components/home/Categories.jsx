import React from 'react'

const categories = [
    { img: "/home-page/furniture.png", title: "Furniture" },
    { img: "/home-page/shirts.png", title: "Man Shirts" },
    { img: "/home-page/beauty.png", title: "Beauty" },
    { img: "/home-page/grocery.png", title: "Groceries" },
    { img: "/home-page/laptop.png", title: "Laptop" },
    { img: "/home-page/clothing.png", title: "Clothing" },
]

const Categories = () => {
    return (
        <div className='my-8 p-4 bg-white'>
            <div className='grid grid-cols-1 md:grid-cols-6 gap-4'>
                {categories.map((category, i) => (
                    <div className='flex flex-col gap-2' key={i}>
                        <img className='rounded h-full' src={category.img} alt={category.title} />
                        <p className='text-center md:text-[16px] lg:text-[22.6px] text-nowrap'>{category.title}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Categories