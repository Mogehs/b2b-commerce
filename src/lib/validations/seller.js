import { z } from "zod";

const phoneRegex = /^[\+]?[0-9]{10,15}$/;

const urlSchema = z.string().url("Invalid URL").optional().or(z.literal(""));

export const sellerApplicationSchema = z.object({
  name: z
    .string()
    .min(2, "Store name must be at least 2 characters")
    .max(100, "Store name must be less than 100 characters")
    .trim(),

  business: z
    .string()
    .min(2, "Business type is required")
    .max(50, "Business type must be less than 50 characters")
    .trim(),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be less than 1000 characters")
    .trim(),

  address: z
    .string()
    .min(10, "Address must be at least 10 characters")
    .max(500, "Address must be less than 500 characters")
    .trim(),

  products: z
    .string()
    .min(2, "Product types are required")
    .max(200, "Product types must be less than 200 characters")
    .trim(),

  offers: z
    .string()
    .min(2, "Offers description is required")
    .max(500, "Offers description must be less than 500 characters")
    .trim(),

  landmark: z
    .string()
    .min(2, "Landmark is required")
    .max(100, "Landmark must be less than 100 characters")
    .trim(),

  email: z
    .string()
    .email("Invalid email address")
    .max(100, "Email must be less than 100 characters"),

  phone: z
    .string()
    .regex(phoneRegex, "Invalid phone number format")
    .min(10, "Phone number must be at least 10 digits"),

  phone2: z
    .string()
    .regex(phoneRegex, "Invalid phone number format")
    .optional()
    .or(z.literal("")),

  phone3: z
    .string()
    .regex(phoneRegex, "Invalid phone number format")
    .optional()
    .or(z.literal("")),

  whatsapp: z
    .string()
    .regex(phoneRegex, "Invalid WhatsApp number format")
    .min(10, "WhatsApp number is required"),

  whatsapp2: z
    .string()
    .regex(phoneRegex, "Invalid WhatsApp number format")
    .optional()
    .or(z.literal("")),

  website: urlSchema,
  facebook: urlSchema,
  instagram: urlSchema,
  twitter: urlSchema,
  linkedin: urlSchema,

  imageUrl: z
    .string()
    .url("Please provide a valid image URL")
    .min(1, "Image URL is required")
    .refine((url) => {
      // Check if URL ends with image extension
      const imageExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
      const lowerUrl = url.toLowerCase();
      return (
        imageExtensions.some((ext) => lowerUrl.includes(ext)) ||
        lowerUrl.includes("imgur.com") ||
        lowerUrl.includes("cloudinary.com") ||
        lowerUrl.includes("unsplash.com") ||
        lowerUrl.includes("pexels.com")
      );
    }, "URL should point to an image (jpg, png, webp, gif) or be from a trusted image hosting service"),
});

export const locationSchema = z.object({
  address: z.string().min(1, "Address is required"),
  coordinates: z.object({
    type: z.literal("Point"),
    coordinates: z.array(z.number()).length(2, "Invalid coordinates"),
  }),
  placeId: z.string().optional(),
  formattedAddress: z.string().optional(),
  addressComponents: z
    .object({
      streetNumber: z.string().optional(),
      route: z.string().optional(),
      locality: z.string().optional(),
      sublocality: z.string().optional(),
      administrativeAreaLevel1: z.string().optional(),
      administrativeAreaLevel2: z.string().optional(),
      country: z.string().optional(),
      postalCode: z.string().optional(),
    })
    .optional(),
  viewport: z
    .object({
      northeast: z.object({
        lat: z.number(),
        lng: z.number(),
      }),
      southwest: z.object({
        lat: z.number(),
        lng: z.number(),
      }),
    })
    .optional(),
});

export const serviceRadiusSchema = z
  .number()
  .min(1, "Service radius must be at least 1 km")
  .max(100, "Service radius cannot exceed 100 km");

export const approveApplicationSchema = z.object({
  adminNotes: z
    .string()
    .max(500, "Admin notes must be less than 500 characters")
    .optional(),
});

export const rejectApplicationSchema = z.object({
  reason: z
    .string()
    .min(10, "Rejection reason must be at least 10 characters")
    .max(500, "Reason must be less than 500 characters"),
  adminNotes: z
    .string()
    .max(500, "Admin notes must be less than 500 characters")
    .optional(),
  allowResubmission: z.boolean().default(true),
});
