import connectMongo from "@/lib/mongoose";
import User from "@/models/User";
import SellerApplication from "@/models/SellerApplication";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectMongo();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const existingApplication = await SellerApplication.findOne({
      user: userId,
    });
    if (existingApplication) {
      if (existingApplication.status === "pending") {
        return NextResponse.json(
          {
            message: "You already have a pending application",
          },
          { status: 409 }
        );
      }
      if (existingApplication.status === "approved") {
        return NextResponse.json(
          {
            message: "You are already an approved seller",
          },
          { status: 409 }
        );
      }
      if (
        existingApplication.status === "rejected" &&
        !existingApplication.resubmissionAllowed
      ) {
        return NextResponse.json(
          {
            message: "Resubmission not allowed for this application",
          },
          { status: 409 }
        );
      }
    }

    const formData = await request.formData();
    const businessName = formData.get("name");
    const imageUrl = formData.get("imageUrl"); // Get image URL instead of file
    let location;
    try {
      location = JSON.parse(formData.get("location"));
    } catch (error) {
      console.error("Error parsing location data:", error);
      return NextResponse.json(
        {
          message: "Invalid location data format",
        },
        { status: 400 }
      );
    }

    // Get service radius
    const serviceRadius = parseInt(formData.get("serviceRadius"), 10) || 10;
    const businessType = formData.get("business");
    const businessDescription = formData.get("description");
    const businessAddress = formData.get("address");
    const businessPhone = formData.get("phone");
    const businessEmail = formData.get("email");
    const businessWebsite = formData.get("website") || "";
    const productCategories =
      formData
        .get("products")
        ?.split(",")
        .map((item) => item.trim())
        .filter(Boolean) || [];
    const offers = formData.get("offers") || "";
    const landmark = formData.get("landmark");

    const phone2 = formData.get("phone2");
    const phone3 = formData.get("phone3");
    const whatsapp = formData.get("whatsapp");
    const whatsapp2 = formData.get("whatsapp2");

    const secondaryPhones = [phone2, phone3].filter(Boolean);
    const whatsappNumbers = [whatsapp, whatsapp2].filter(Boolean);

    const socialMedia = {
      facebook: formData.get("facebook") || "",
      instagram: formData.get("instagram") || "",
      twitter: formData.get("twitter") || "",
      linkedin: formData.get("linkedin") || "",
    };

    if (
      !businessName ||
      !location ||
      !businessType ||
      !businessDescription ||
      !businessAddress ||
      !businessPhone ||
      !businessEmail ||
      !landmark ||
      !imageUrl
    ) {
      return NextResponse.json(
        {
          message: "Please fill in all required fields including image URL",
        },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(businessEmail)) {
      return NextResponse.json(
        {
          message: "Please provide a valid email address",
        },
        { status: 400 }
      );
    }

    // Validate image URL
    try {
      new URL(imageUrl);
    } catch (error) {
      return NextResponse.json(
        {
          message: "Please provide a valid image URL",
        },
        { status: 400 }
      );
    }

    // Check if URL appears to be an image
    const imageExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
    const lowerUrl = imageUrl.toLowerCase();
    const isValidImageUrl =
      imageExtensions.some((ext) => lowerUrl.includes(ext)) ||
      lowerUrl.includes("imgur.com") ||
      lowerUrl.includes("cloudinary.com") ||
      lowerUrl.includes("unsplash.com") ||
      lowerUrl.includes("pexels.com");

    if (!isValidImageUrl) {
      return NextResponse.json(
        {
          message:
            "URL should point to an image file or be from a trusted image hosting service",
        },
        { status: 400 }
      );
    }

    const titleImage = {
      url: imageUrl,
      publicId: null, // Not applicable for external URLs
      width: null, // Will be determined when displayed
      height: null, // Will be determined when displayed
      format: null, // Will be determined when displayed
      bytes: null, // Not applicable for external URLs
    };
    const applicationData = {
      businessName,
      location,
      serviceRadius, // Add the service radius to application data
      businessType,
      businessDescription,
      businessAddress,
      businessPhone,
      secondaryPhones,
      businessEmail,
      businessWebsite,
      productCategories,
      offers,
      whatsappNumbers,
      landmark,
      titleImage,
      socialMedia,
    };

    let application;
    if (existingApplication && existingApplication.status === "rejected") {
      application = await SellerApplication.findByIdAndUpdate(
        existingApplication._id,
        {
          status: "pending",
          applicationData,
          reason: null,
          adminNotes: null,
          reviewedBy: null,
          reviewedAt: null,
          $inc: { submissionCount: 1 },
        },
        { new: true }
      );
    } else {
      application = new SellerApplication({
        user: userId,
        applicationData,
      });

      await application.save();

      await User.findByIdAndUpdate(userId, {
        sellerApplication: application._id,
      });
    }

    return NextResponse.json(
      {
        message: "Application submitted successfully",
        application: {
          id: application._id,
          status: application.status,
          submittedAt: application.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting seller application:", error);

    return NextResponse.json(
      {
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
