import React from "react";
import GetDealForm from "./GetInput";
import ContactInfo from "./ContactInfo";

const BPContact = ({ sellerId, sellerData }) => {
  return (
    <div>
      <GetDealForm sellerId={sellerId} />
      <ContactInfo sellerId={sellerId} sellerData={sellerData} />
    </div>
  );
};

export default BPContact;
