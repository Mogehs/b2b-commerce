import Store from "@/models/Store";
import User from "@/models/User";

export async function createStoreFromApplication(application) {
  try {
    const { applicationData } = application;

    // Create store from application data
    const storeData = {
      owner: application.user,
      name: applicationData.businessName,
      description: applicationData.businessDescription,
      businessType: applicationData.businessType,
      location: {
        address: applicationData.location.address,
        coordinates: applicationData.location.coordinates,
        formattedAddress: applicationData.location.formattedAddress,
        placeId: applicationData.location.placeId,
      },
      serviceRadius: applicationData.serviceRadius,
      address: applicationData.businessAddress,
      landmark: applicationData.landmark,
      email: applicationData.businessEmail,
      phone: applicationData.businessPhone,
      secondaryPhones: applicationData.secondaryPhones || [],
      whatsappNumbers: applicationData.whatsappNumbers || [],
      website: applicationData.businessWebsite,
      productCategories: applicationData.productCategories || [],
      offers: applicationData.offers,
      bannerImage: applicationData.titleImage,
      socialLinks: applicationData.socialMedia,
      originalApplication: application._id,
      approvedAt: new Date(),
    };

    const store = new Store(storeData);
    await store.save();

    // Update user role to seller
    await User.findByIdAndUpdate(application.user, {
      role: "seller",
      store: store._id,
    });

    return store;
  } catch (error) {
    console.error("Error creating store from application:", error);
    throw error;
  }
}
