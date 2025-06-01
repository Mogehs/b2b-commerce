import React from 'react'

const regions = [
    { title: "Sindh", cities: "Karachi | Hyderabad | Sukkur | Larkana | Khairpur" },
    { title: "Punjab", cities: "Lahore | Faisalabad | Rawalpindi | Multan | Gujranwala" },
    { title: "Khyber Pakhtunkhwa", cities: "Peshawar | Mardan | Mingora | Kohat | Abbottabad" },
    { title: "Balochistan", cities: "Quetta | Turbat | Khuzdar | Hub | Gwadar" },
    { title: "Gilgit-Baltistan", cities: "Gilgit | Skardu | Khaplu | Dambudas | Shigar" },
    { title: "Azad Jammu and Kashmir", cities: "Muzaffarabad | Mirpur | Rawalakot | Kotli | Bhimber" },
];

const Region = () => {
    return (
        <div className='my-8 flex flex-col gap-4'>
            {regions.map((region, index) => (
                <div key={index} className='bg-white flex md:flex-row flex-col gap-2 md:items-center p-2 md:gap-8'>
                    <p className='font-semibold text-[18px]'>{region.title}:</p>
                    <p className='text-black/50'>{region.cities}</p>
                </div>
            ))}
        </div>
    )
}

export default Region