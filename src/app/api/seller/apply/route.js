import connectMongo from "@/lib/mongoose";
import User from "@/models/User";
import SellerApplication from "@/models/SellerApplication";
import { uploadToCloudinary } from "@/lib/cloudinary";
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
    const location = formData.get("location");
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
      !landmark
    ) {
      return NextResponse.json(
        {
          message: "Please fill in all required fields",
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

    let titleImage = null;
    const imageFile = formData.get("image");

    if (imageFile && imageFile instanceof File) {
      if (imageFile.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          {
            message: "Image file size must be less than 5MB",
          },
          { status: 400 }
        );
      }

      if (!imageFile.type.startsWith("image/")) {
        return NextResponse.json(
          {
            message: "Only image files are allowed",
          },
          { status: 400 }
        );
      }

      try {
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadResult = await uploadToCloudinary(
          buffer,
          "seller-applications",
          {
            public_id: `seller_${userId}_${Date.now()}`,
            overwrite: true,
          }
        );

        titleImage = {
          url: uploadResult.url,
          publicId: uploadResult.publicId,
          width: uploadResult.width,
          height: uploadResult.height,
          format: uploadResult.format,
          bytes: uploadResult.bytes,
        };
      } catch (uploadError) {
        console.error("Image upload error:", uploadError);
        return NextResponse.json(
          {
            message:
              "Failed to upload image. Please try again with a different image.",
          },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        {
          message: "Title image is required",
        },
        { status: 400 }
      );
    }

    const applicationData = {
      businessName,
      location,
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
