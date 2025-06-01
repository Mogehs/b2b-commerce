import React from "react";

const ContactInfo = () => {
  return (
    <div className="max-w-3xl mx-auto p-4 bg-white font-sans">
      {/* Title */}
      <h1 className="text-2xl font-bold mb-4">Madina Traders</h1>

      {/* Table-like layout */}
      <div className="grid grid-cols-4 gap-0 text-sm">
        {/* Row 1 */}
        <div className="col-span-2 border-b border-r border-gray-300 p-2 flex">
          <span className="font-medium w-20">website:</span>
          <span>www.abc.com</span>
        </div>
        <div className="col-span-2 border-b border-gray-300 p-2 flex">
          <span className="font-medium w-24">Whatsapp #:</span>
          <span>+92-321-1234567</span>
        </div>

        {/* Row 2 */}
        <div className="col-span-2 border-b border-r border-gray-300 p-2 flex">
          <span className="font-medium w-20">E-mail:</span>
          <span>abc@gmail.com</span>
        </div>
        <div className="col-span-2 border-b border-gray-300 p-2 flex">
          <span className="font-medium w-24">Whatsapp # 2:</span>
          <span>+92-321-1234567</span>
        </div>

        {/* Row 3 */}
        <div className="col-span-2 border-b border-r border-gray-300 p-2 flex">
          <span className="font-medium w-20">Phone #:</span>
          <span>+92-321-1234567</span>
        </div>
        <div className="col-span-2 border-b border-gray-300 p-2"></div>

        {/* Row 4 */}
        <div className="col-span-2 border-b border-r border-gray-300 p-2 flex">
          <span className="font-medium w-20">Phone # 2:</span>
          <span>+92-321-1234567</span>
        </div>
        <div className="col-span-2 border-b border-gray-300 p-2 flex">
          <span className="font-medium w-24">Address:</span>
          <span>
            122-S Bazar Area, Laal Building, Pindi Road, Rawalpindi Cantt
          </span>
        </div>

        {/* Row 5 */}
        <div className="col-span-2 border-b border-r border-gray-300 p-2 flex">
          <span className="font-medium w-20">Phone # 3:</span>
          <span>+92-321-1234567</span>
        </div>
        <div className="col-span-2 border-b border-gray-300 p-2 flex">
          <span className="font-medium w-24">Land Mark Near:</span>
          <span>Laal Hawaii</span>
        </div>
      </div>

      {/* Follow Us */}
      <div className="mt-4 text-center">
        <p className="font-medium">Follow Us</p>
      </div>
    </div>
  );
};

export default ContactInfo;
