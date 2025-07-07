import React from 'react'

const brands = ['/home-page/suzuki.png', '/home-page/nestle.jpg', '/home-page/engro.png', '/home-page/akram.png', '/home-page/gul.png', '/home-page/khaddi.png', '/home-page/mughal.png', '/home-page/universe.png', '/home-page/jazz.png', '/home-page/cola.jpg', '/home-page/nestle.jpg', '/home-page/suzuki.png',]

const Brands = () => {
    return (
        <div className='my-8 border border-black/50 rounded p-4 md:py-8 md:px-12 bg-white'>
            <div className='grid grid-cols-2 md:grid-cols-6 gap-4'>
                {brands.map((brand, index) => (
                    <div key={index} className='border-[1px] border-black/50 rounded-[5px] h-[80%] xl:h-[125px] w-full xl:w-[200px]'>
                        <img className='h-full w-full object-contain' src={brand} alt="brands" />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Brands