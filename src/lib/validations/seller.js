import { z } from "zod";

// Phone number validation regex (adjust for your country)
const phoneRegex = /^[\+]?[0-9]{10,15}$/;

// URL validation that allows empty strings
const urlSchema = z.string().url("Invalid URL").optional().or(z.literal(""));

export const sellerApplicationSchema = z.object({
  // Basic business information
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

  // Contact information
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

  // Website
  website: urlSchema,

  // Social media links
  facebook: urlSchema,
  instagram: urlSchema,
  twitter: urlSchema,
  linkedin: urlSchema,

  // File upload
  image: z
    .any()
    .refine((files) => files?.length > 0, "Title image is required")
    .refine(
      (files) => files?.[0]?.size <= 5 * 1024 * 1024,
      "Image size must be less than 5MB"
    )
    .refine(
      (files) =>
        ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
          files?.[0]?.type
        ),
      "Only .jpg, .jpeg, .png and .webp formats are supported"
    ),
});

// Location validation schema (for frontend use)
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

// Service radius validation
export const serviceRadiusSchema = z
  .number()
  .min(1, "Service radius must be at least 1 km")
  .max(100, "Service radius cannot exceed 100 km");

// Admin review validation schemas
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
