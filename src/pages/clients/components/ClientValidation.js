import { t } from "i18next";
import { z } from "zod";
const isFutureDate = (val) => {
  if (!val) return true;
  const date = new Date(val);
  return !isNaN(date.getTime()) && date >= new Date();
};

const clientSchema = z.object({
  name: z.string({ required_error: t("errors.required") }).min(3,  t("errors.nameMinLength", { min: 3 })),
  email: z.string({ required_error: t("errors.required") }).email(t("errors.invalidEmail")),
  phone: z.string({ required_error: t("errors.required") }).min(1, t("errors.invalidPhoneNumber")),
  address: z.string({ required_error: t("errors.required") }).min(1, t("errors.invalidAddress")),
  cin: z.string({ required_error: t("errors.required") }).min(1, t("errors.invalidCin")),
  gender: z.enum(["Male", "Female"], { message: t("errors.invalidGender")}).default('Male'),

  cinExpiry: z
    .string()
    .refine(isFutureDate, { message: t("errors.cinexpired") }),

  license: z.string().min(1, t("errors.license")),

  licenseExpiry: z
    .string()
    .refine(isFutureDate, { message: t("errors.licensexpired") }),

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
  ], { message: t("errors.nationality") }),

  passportNumber: z.string().optional(),

  passportExpiry: z
    .string()
    .optional()
    .refine(isFutureDate, { message: t("errors.passportxpired")}),

  birthDate: z
    .string()
    .refine((val) => {
      if (!val) return true;
      const date = new Date(val);
      return !isNaN(date.getTime()) && date <= new Date();
    }, { message:  t("errors.invalidBirthDate") }),

  companyName: z.string().optional(),
  registrationNumber: z.string().optional(),

  clientType: z.enum(["PERSONAL", "ENTERPRISE"]).default("PERSONAL"),

  cinimage: z.string().min(1,t("errors.cinimage") ),
  licenseimage: z.string().min(1,  t("errors.licenseimage")),
});

export default clientSchema;