import { z } from "zod";
const isFutureDate = (val) => {
  if (!val) return true;
  const date = new Date(val);
  return !isNaN(date.getTime()) && date >= new Date();
};

const clientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  cin: z.string().min(1, "CIN is required"),
  gender: z.enum(["Male", "Female"], { message: "Invalid gender selection" }).default('Male'),

  cinExpiry: z
    .string()
    .refine(isFutureDate, { message: "CIN is expired or invalid date" }),

  license: z.string().min(1, "License is required"),

  licenseExpiry: z
    .string()
    .refine(isFutureDate, { message: "License is expired or invalid date" }),

  blacklisted: z.coerce.boolean().default(false),

  nationality: z.enum([
    "Moroccan",
    "Algerian",
    "Tunisian",
    "French",
    "Spanish",
    "Italian",
    "German",
    "American",
    "British",
    "Canadian",
  ], { message: "Invalid nationality selected" }),

  passportNumber: z.string().optional(),

  passportExpiry: z
    .string()
    .optional()
    .refine(isFutureDate, { message: "Passport is expired or invalid date" }),

  birthDate: z
    .string()
    .refine((val) => {
      if (!val) return true;
      const date = new Date(val);
      return !isNaN(date.getTime()) && date <= new Date();
    }, { message: "Birth date must be in the past" }),

  companyName: z.string().optional(),
  registrationNumber: z.string().optional(),

  clientType: z.enum(["PERSONAL", "ENTERPRISE"]).default("PERSONAL"),

  cinimage: z.string().min(1, "CIN image is required"),
  licenseimage: z.string().min(1, "License image is required"),
});

export default clientSchema;