import React from 'react'

const Badge = ({first, second}) => {
    return (
        <div className='w-full my-8'>
            <div className='flex items-center justify-between w-full p-4 bg-white'>
                <p className='font-bold md:text-[24px]'>{first}</p>
                <p className='text-black/50 md:text-[20px]'>{second}</p>

            </div>
        </div>
    )
}

export default Badge