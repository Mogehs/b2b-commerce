"use client";

import React, { useState, useRef } from 'react';
import { RxHamburgerMenu } from "react-icons/rx";
import { PiGreaterThanLight } from "react-icons/pi";

const Header = ({ onCategorySelect }) => {
    const [isHovered, setIsHovered] = useState(false);
    const dropdownRef = useRef(null);
    const timeoutRef = useRef(null);

    // Add "All Products" as the first category
    const categories = [
        "All Products",
        "Industrial Machinery",
        "Safety Equipment",
        "Office Supplies",
        "Raw Materials",
        "Packaging Solutions",
        "Construction Materials",
        "Electrical Components",
        "Medical Equipment",
        "Textiles & Apparel",
        "Beauty & Personal Care",
        "Food Service Equipment",
        "Cleaning Supplies",
        "IT & Networking",
        "Office Furniture",
        "HVAC Systems",
        "Plumbing Supplies",
        "Automotive Parts",
        "Agricultural Equipment",
        "Retail Store Fixtures",
        "Hotel & Restaurant Supplies",
        "Lab Equipment",
        "Power Tools",
        "Material Handling",
        "Security Systems",
        "Signage & Display"
    ];

    const handleMouseEnter = () => {
        clearTimeout(timeoutRef.current);
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsHovered(false);
        }, 300);
    };

    const handleCategoryClick = (category) => {
        onCategorySelect(category);
        setIsHovered(false);
    };

    return (
        <div className="relative">
            <div
                className='flex items-center gap-4 p-2 bg-white border border-b-[#ACAAAA] border-t-[#F1F1F1] my-2 font-semibold ps-6 md:ps-20 cursor-pointer hover:bg-gray-50 transition-colors duration-200'
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <RxHamburgerMenu />
                <p>Explore By Categories</p>
                <PiGreaterThanLight className={`transform transition-transform duration-200 ${isHovered ? 'rotate-90' : ''}`} />
            </div>

            {/* Categories Dropdown */}
            {isHovered && (
                <div
                    ref={dropdownRef}
                    className="absolute z-50 w-full min-h-[50vh] bg-white shadow-lg border border-gray-200 rounded-b-lg"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
                        {categories.map((category, index) => (
                            <div
                                key={index}
                                className="p-2 hover:bg-blue-50 rounded transition-colors duration-200 cursor-pointer"
                                onClick={() => handleCategoryClick(category)}
                            >
                                <h3 className="font-medium text-gray-800 hover:text-blue-600">
                                    {category}
                                </h3>
                            </div>
                        ))}
                    </div>

                    {/* Featured Section */}
                    <div className="border-t border-gray-200 p-4 bg-gray-50">
                        <h3 className="font-medium text-gray-800 mb-2">Popular B2B Categories</h3>
                        <div className="flex flex-wrap gap-2">
                            {["Bulk Office Supplies", "Industrial Safety Gear", "Wholesale Packaging", "Commercial Kitchen Equipment"].map((category, index) => (
                                <div
                                    key={index}
                                    className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm hover:border-blue-400 hover:text-blue-600 cursor-pointer transition-colors duration-200"
                                    onClick={() => handleCategoryClick(category)}
                                >
                                    {category}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Header;
