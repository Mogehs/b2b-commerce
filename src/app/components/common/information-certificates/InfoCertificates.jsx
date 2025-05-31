import React from "react";

const InfoCertificates = () => {
  return (
    <>
      <div className="mt-5 bg-white rounded-lg max-w-6xl mx-auto shadow-sm p-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Basic Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-10">
          {[
            ["Business Type", "Manfucturer,Whole Seller,Importer Exporter"],
            ["Business Legal Status", "Sole Propriter"],
            ["Year of Established", "1988"],
            ["Type Of Products", "Jackets, Bags, Laptops etc"],
            ["Main Market", "USA, UK, Spain, Pakistan"],
            ["Yearly Revenue", "230000/- Lakh"],
          ].map(([label, value], i) => (
            <div key={i} className="flex flex-col">
              <span className="text-gray-500 text-sm">{label}</span>
              <span className="text-gray-900 font-medium">{value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 bg-white rounded-lg max-w-6xl mx-auto shadow-sm p-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Registeration And Certifications
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-10">
          {[
            ["National Tax Number", "2020"],
            ["Professional Tax", "2020"],
            ["ISO - 9001", "2020"],
            ["Chamber of Commerce", "2020"],
          ].map(([label, value], i) => (
            <div key={i} className="flex flex-col">
              <span className="text-gray-500 text-sm">{label}</span>
              <span className="text-gray-900 font-medium">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default InfoCertificates;
