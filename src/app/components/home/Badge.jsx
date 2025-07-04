import React from 'react'

const Badge = ({first, second, handleCardClick}) => {
    return (
        <div className='w-full my-0'>
            <div className='flex items-center justify-between w-full p-4 bg-white'>
                <p className='font-bold md:text-[24px]'>{first}</p>
                <p className='text-black/50 md:text-[20px] hover:cursor-pointer' onClick={handleCardClick}>{second}</p>

            </div>
        </div>
    )
}

export default Badge