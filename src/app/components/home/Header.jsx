import React from 'react'
import { RxHamburgerMenu } from "react-icons/rx";
import { PiGreaterThanLight } from "react-icons/pi";

const Header = () => {
    return (
        <div className='flex items-center gap-4 p-2 bg-white border border-b-[#ACAAAA] border-t-[#F1F1F1] my-2 font-semibold ps-6 md:ps-20'>
            <RxHamburgerMenu />
            <p>Explore By Categories</p>
            <PiGreaterThanLight />
        </div>
    )
}

export default Header