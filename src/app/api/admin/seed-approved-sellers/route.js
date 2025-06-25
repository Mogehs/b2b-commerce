import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import SellerApplication from "@/models/SellerApplication";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST() {
  try {
    await dbConnect();

    // Create sample users for sellers
    const sampleSellers = [
      {
        name: "John Smith",
        email: "john@techgadgets.com",
        phone: "+1 (555) 123-4567",
        businessName: "TechGadgets Pro",
        category: "Electronics",
        address: "123 Tech Street, San Francisco, CA 94105",
      },
      {
        name: "Sarah Johnson",
        email: "sarah@officesolutions.com",
        phone: "+1 (555) 987-6543",
        businessName: "Office Solutions",
        category: "Office Supplies",
        address: "456 Business Ave, New York, NY 10001",
      },
      {
        name: "Michael Chen",
        email: "michael@industrialtools.com",
        phone: "+1 (555) 456-7890",
        businessName: "Industrial Tools Co.",
        category: "Industrial Equipment",
        address: "789 Industrial Blvd, Chicago, IL 60601",
      },
    ];

    const createdSellers = [];

    for (const sellerData of sampleSellers) {
      // Check if user already exists
      let user = await User.findOne({ email: sellerData.email });

      if (!user) {
        // Create user
        const hashedPassword = await bcrypt.hash("password123", 12);
        user = new User({
          name: sellerData.name,
          email: sellerData.email,
          password: hashedPassword,
          phone: sellerData.phone,
          role: "seller",
        });
        await user.save();
      }

      // Check if seller application already exists
      let sellerApp = await SellerApplication.findOne({ user: user._id });

      if (!sellerApp) {
        // Create seller application
        sellerApp = new SellerApplication({
          user: user._id,
          status: "approved",
          applicationData: {
            businessName: sellerData.businessName,
            category: sellerData.category,
            location: {
              address: sellerData.address,
              coordinates: {
                type: "Point",
                coordinates: [-122.4194, 37.7749], // San Francisco coordinates as default
              },
            },
            description: `${sellerData.businessName} is a leading provider in ${sellerData.category}.`,
            businessType: "retail",
            expectedMonthlyVolume: "1000-5000",
            businessRegistrationNumber:
              "REG" + Math.random().toString(36).substr(2, 9).toUpperCase(),
          },
          adminNotes: "Auto-approved sample seller for testing",
        });
        await sellerApp.save();
      }

      createdSellers.push({
        user: user,
        application: sellerApp,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Sample approved sellers created successfully",
      sellers: createdSellers.length,
    });
  } catch (error) {
    console.error("Error creating sample sellers:", error);
    return NextResponse.json(
      { error: "Failed to create sample sellers", details: error.message },
      { status: 500 }
    );
  }
}
