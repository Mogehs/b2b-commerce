import React from 'react'

const cards = [
    { title1: "Low MOQ", title2: "Minimum Order Quality" },
    { title1: "OEM Services", title2: "Original Equipment Manufacture" },
    { title1: "Private Labeling", title2: "Private Label Manufactures" },
    { title1: "Ready to Ship", title2: "Deliver on time, every day" },
];

const lgCards = Array.from({ length: 21 }, () => ({
    img: "/home-page/dslr.png",
    text: "DSLR Camera",
}));

const BrandingCards = () => {
    return (
        <div className='my-8'>
            <div className='px-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8'>
                    {cards.map((card, i) => (
                        <div key={i} className='bg-white space-y-4 py-6 text-center' >
                            <p className='text-nowrap md:text-[20px] font-bold'>{card.title1}</p>
                            <p className='text-nowrap'>{card.title2}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className='grid grid-cols-2 md:grid-cols-5 lg:grid-cols-7 gap-8 my-6'>
                {lgCards.map((lcard, index) => (
                    <div key={index} className='flex flex-col gap-2'>
                        <img className='bg-white w-full h-32 object-contain' src={lcard.img} alt={lcard.text} />
                        <p className='bg-white text-center text-nowrap font-semibold'>{lcard.text}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default BrandingCards