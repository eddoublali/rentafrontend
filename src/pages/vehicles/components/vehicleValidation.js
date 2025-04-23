import { t } from 'i18next';
import { z } from 'zod';

const validateFile = (file, allowedTypes = ['image/jpeg', 'image/png'], maxSizeMB = 5) => {
  if (!file) return true;
  if (typeof file === 'string') return true;
  if (file instanceof File) {
    if (!allowedTypes.includes(file.type)) return false;
    if (file.size > maxSizeMB * 1024 * 1024) return false;
    return true;
  }
  return false;
};

const safeDate = z
  .string()
  .transform((str) => {
    if (!str) return undefined;
    const date = new Date(str);
    return isNaN(date.getTime()) ? undefined : date;
  });

// Step 1: Basic Information
const basicInfoSchema = z.object({
  brand: z.enum(["TOYOTA", "HONDA", "FORD", "MERCEDES", "BMW", "AUDI", "VOLKSWAGEN", "HYUNDAI", "KIA", "NISSAN", "PEUGEOT",
    "RENAULT",
    "FIAT",
    "VOLVO",
    "MAZDA",
    "JEEP",
    "TESLA",
    "SUZUKI",
    "SKODA",
  ], { message: t("errors.required") }),
  model: z.string({ required_error: t("errors.required") }).min(6, { message: t("errors.Modelerror") }),
  year: z.number({ required_error: t("errors.required") }).min(1900, { message: t("errors.yearerror") }).max(new Date().getFullYear() + 1, { message: t("errors.yearnotvalid") }),
  category: z.enum([
    "CITADINE",
    "BERLINE",
    "SUV",
    "UTILITAIRE",
  ], { message: t("errors.required") }),
});

// Step 2: Technical Details
const technicalDetailsSchema = z.object({
  color: z.enum([
    "BLACK", "WHITE", "GREY", "BLUE", "RED",
    "GREEN", "YELLOW", "GOLD",
  ], { message: t("errors.required") }),
  doors: z.number({ required_error: t("errors.required") }).min(0, { message: t("errors.doors") }),
  fuelType: z
      .enum(['GASOLINE', 'DIESEL', 'ELECTRIC', 'HYBRID'], {
        errorMap: () => ({ message: t("errors.fuelerror") })
      })
      .default('GASOLINE'),
        chassisNumber: z.string({ required_error: t("errors.required") }).min(6, { message: t("errors.chassisnumbererror") }),
  gearbox: z.enum([
    "MANUAL", "AUTOMATIC"
  ], { message: t("errors.required") }),
});

// Step 3: Registration & Pricing
const registrationPricingSchema = z.object({
  mileage: z.number({ required_error: t("errors.required") }).min(0, { message: t("errors.melage") }),
  plateNumber: z.string({ required_error: t("errors.required") }).min(6, { message: t("errors.Platenumber") }),
  dailyPrice: z.number({ required_error: t("errors.required") }).min(0, { message: t("errors.dailyprice") }),
  status: z.enum(['AVAILABLE', 'RENTED', 'MAINTENANCE'], { message: t("errors.statuserror") }).default('AVAILABLE'),
});

// Step 4: Vehicle Image (optional, but we'll validate if present)
const vehicleImageSchema = z.object({
  image: z
    .any()
    .refine((file) => validateFile(file, ['image/jpeg', 'image/png'], 5), t("errors.imageerror"))

});

// Step 5: Maintenance
const maintenanceSchema = z.object({
  oilChange: safeDate,
  timingBelt: safeDate,
  purchaseDate: safeDate,
  purchasePrice: z.number({ required_error: t("errors.required") }).min(0, t("errors.Purchase")),
  advancePayment: z.number({ required_error: t("errors.required") }).min(0, t("errors.Advance")),
  monthlyPayment: z.number({ required_error: t("errors.required") }).min(0, t("errors.Monthly")),
  remainingMonths: z.number({ required_error: t("errors.required") }).min(0, t("errors.Remaining")),
  paymentDay: z.number({ required_error: t("errors.required") }).min(1, t("errors.Payment")).max(31, t("errors.Payment")),
});

// Step 6: Documents
const documentsSchema = z.object({
  registrationCard: z
    .any()
    .refine((file) => validateFile(file, ['image/jpeg', 'image/png', 'application/pdf'], 5), t("errors.imageerror"))
    .optional(),
  insurance: z
    .any()
    .refine((file) => validateFile(file, ['image/jpeg', 'image/png', 'application/pdf'], 5), t("errors.imageerror"))
    .optional(),
  technicalVisit: z
    .any()
    .refine((file) => validateFile(file, ['image/jpeg', 'image/png', 'application/pdf'], 5), t("errors.imageerror"))
    .optional(),
  authorization: z
    .any()
    .refine((file) => validateFile(file, ['image/jpeg', 'image/png', 'application/pdf'], 5), t("errors.imageerror"))
    .optional(),
  taxSticker: z
    .any()
    .refine((file) => validateFile(file, ['image/jpeg', 'image/png', 'application/pdf'], 5), t("errors.imageerror"))
    .optional(),
});

// Full schema for final validation
export const vehicleSchema = z.object({
  brand: z.enum(["TOYOTA", "HONDA", "FORD", "MERCEDES", "BMW", "AUDI", "VOLKSWAGEN", "HYUNDAI", "KIA", "NISSAN", "PEUGEOT",
    "RENAULT",
    "FIAT",
    "VOLVO",
    "MAZDA",
    "JEEP",
    "TESLA",
    "SUZUKI",
    "SKODA",
  ], { message: t("errors.required") }),
  model: z.string({ required_error: t("errors.required") }).min(6, { message: t("errors.Modelerror") }),
  category: z.enum([
    "CITADINE",
    "BERLINE",
    "SUV",
    "UTILITAIRE",
  ], { message: t("errors.required") }),

  plateNumber: z.string({ required_error: t("errors.required") }).min(6, { message: t("errors.Platenumber") }),
  chassisNumber: z.string({ required_error: t("errors.required") }).min(6, { message: t("errors.chassisnumbererror") }),
  year: z.number({ required_error: t("errors.required") }).min(1900, { message: t("errors.yearerror") }).max(new Date().getFullYear() + 1, { message: t("errors.yearnotvalid") }),
  color: z.enum([
    "BLACK", "WHITE", "GREY", "BLUE", "RED",
    "GREEN", "YELLOW", "GOLD",
  ], { message: t("errors.required") }),
  doors: z.number({ required_error: t("errors.required") }).min(0, { message: t("errors.doors") }),
  fuelType: z.enum(['GASOLINE', 'DIESEL', 'ELECTRIC', 'HYBRID'], { message: t("errors.fuelerror") }) .default('GASOLINE'),
  gearbox: z.enum([
    "MANUAL", "AUTOMATIC"
  ], { message: t("errors.required") }),
  mileage: z.number({ required_error: t("errors.required") }).min(0, { message: t("errors.melage") }),
  status: z.enum(['AVAILABLE', 'RENTED', 'MAINTENANCE'], { message: t("errors.statuserror") }).default('AVAILABLE'),

  dailyPrice: z.number({ required_error: t("errors.required") }).min(0, { message: t("errors.dailyprice") }),

  // Modified to properly handle existing images (string URLs) and new File objects
  image: z
    .any()
    .refine((file) => validateFile(file, ['image/jpeg', 'image/png'], 5), t("errors.imageerror"))
  ,
  oilChange: safeDate,
  timingBelt: safeDate,
  purchaseDate: safeDate,

  purchasePrice: z.number({ required_error: t("errors.required") }).min(0, t("errors.Purchase")),
  advancePayment: z.number({ required_error: t("errors.required") }).min(0, t("errors.Advance")),
  monthlyPayment: z.number({ required_error: t("errors.required") }).min(0, t("errors.Monthly")),
  remainingMonths: z.number({ required_error: t("errors.required") }).min(0, t("errors.Remaining")),
  paymentDay: z.number({ required_error: t("errors.required") }).min(1, t("errors.Payment")).max(31, t("errors.Payment")),

  registrationDoc: z
    .any()
    .refine((file) => validateFile(file, ['image/jpeg', 'image/png', 'application/pdf'], 5), t("errors.imageerror"))
    .optional(),
  insuranceDoc: z
    .any()
    .refine((file) => validateFile(file, ['image/jpeg', 'image/png', 'application/pdf'], 5), t("errors.imageerror"))
    .optional(),
  purchaseDoc: z
    .any()
    .refine((file) => validateFile(file, ['image/jpeg', 'image/png', 'application/pdf'], 5), t("errors.imageerror"))
    .optional(),
  authorization: z
    .any()
    .refine((file) => validateFile(file, ['image/jpeg', 'image/png', 'application/pdf'], 5), t("errors.imageerror"))
    .optional(),
  taxSticker: z
    .any()
    .refine((file) => validateFile(file, ['image/jpeg', 'image/png', 'application/pdf'], 5), t("errors.imageerror"))
    .optional(),
});


export const vehicleUpdateSchema = vehicleSchema.partial();


export const stepSchemas = [
  basicInfoSchema,
  technicalDetailsSchema,
  registrationPricingSchema,
  vehicleImageSchema,
  maintenanceSchema,
  documentsSchema,
];