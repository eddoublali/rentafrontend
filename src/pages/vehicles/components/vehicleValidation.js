import { z } from 'zod';

const validateFile = (file, allowedTypes = ['image/jpeg', 'image/png'], maxSizeMB = 5) => {
  // If no file is provided or it's null/undefined, consider it valid (for optional fields)
  if (!file) return true;
  
  // If it's a string (URL or path), consider it valid (for existing files)
  if (typeof file === 'string') return true;
  
  // If it's a File object, validate its type and size
  if (file instanceof File) {
    if (!allowedTypes.includes(file.type)) return false; // Check file type
    if (file.size > maxSizeMB * 1024 * 1024) return false; // Check file size (in bytes)
    return true;
  }
  
  // If it's neither a string nor a File, it's invalid
  return false;
};

const safeDate = z
  .string()
  .optional()
  .transform((str) => {
    if (!str) return undefined;
    const date = new Date(str);
    return isNaN(date.getTime()) ? undefined : date;
  });

// Step 1: Basic Information
const basicInfoSchema = z.object({
  brand: z.enum(["TOYOTA","HONDA","FORD","MERCEDES","BMW","AUDI","VOLKSWAGEN", "HYUNDAI","KIA","NISSAN","PEUGEOT",
    "RENAULT",
    "FIAT",
    "VOLVO",
    "MAZDA",
    "JEEP",
    "TESLA",
    "SUZUKI",
    "SKODA",
  ]),
  model: z.string().min(6, "Model name must be at least 6 characters"),
  year: z.number().min(1900, "Year must be 1900 or later").max(new Date().getFullYear() + 1, "Year cannot be in the future"),
  category: z.enum([
    "CITADINE",
    "BERLINE",
    "SUV",
    "UTILITAIRE",
  ]),
});

// Step 2: Technical Details
const technicalDetailsSchema = z.object({
  color: z.enum([
    "BLACK", "WHITE", "GREY", "BLUE", "RED",
    "GREEN", "YELLOW", "GOLD",
  ]),
  doors: z.number().min(0, "Doors must be 0 or more"),
  fuelType: z.enum(['GASOLINE', 'DIESEL', 'ELECTRIC', 'HYBRID'], { message: "Invalid fuel type" }),
  chassisNumber: z.string().min(6, "Chassis number must be at least 6 characters"),
  gearbox:z.enum([
    "MANUAL", "AUTOMATIC"
  ]),
});

// Step 3: Registration & Pricing
const registrationPricingSchema = z.object({
  mileage: z.number().min(0, "Mileage must be 0 or more"),
  plateNumber: z.string().min(6, "Plate number must be at least 6 characters"),
  dailyPrice: z.number().min(0, "Daily price must be 0 or more"),
  status: z.enum(['AVAILABLE', 'RENTED', 'MAINTENANCE'], { message: "Invalid status" }).default('AVAILABLE'),
});

// Step 4: Vehicle Image (optional, but we'll validate if present)
const vehicleImageSchema = z.object({
  image: z
    .any()
    .refine((file) => validateFile(file, ['image/jpeg', 'image/png'], 5), "Image must be a JPEG or PNG file under 5MB")
    
});

// Step 5: Maintenance
const maintenanceSchema = z.object({
  oilChange: safeDate,
  timingBelt: safeDate,
  purchaseDate: safeDate,
  purchasePrice: z.number().min(0, "Purchase price must be 0 or more").optional(),
  advancePayment: z.number().min(0, "Advance payment must be 0 or more").optional(),
  monthlyPayment: z.number().min(0, "Monthly payment must be 0 or more").optional(),
  remainingMonths: z.number().min(0, "Remaining months must be 0 or more").optional(),
  paymentDay: z.number().min(1, "Payment day must be between 1 and 31").max(31, "Payment day must be between 1 and 31").optional(),
});

// Step 6: Documents
const documentsSchema = z.object({
  registrationCard: z
    .any()
    .refine((file) => validateFile(file, ['image/jpeg', 'image/png', 'application/pdf'], 5), "File must be a JPEG, PNG, or PDF under 5MB")
    .optional(),
    insurance: z
    .any()
    .refine((file) => validateFile(file, ['image/jpeg', 'image/png', 'application/pdf'], 5), "File must be a JPEG, PNG, or PDF under 5MB")
    .optional(),
    technicalVisit: z
    .any()
    .refine((file) => validateFile(file, ['image/jpeg', 'image/png', 'application/pdf'], 5), "File must be a JPEG, PNG, or PDF under 5MB")
    .optional(),
    authorization: z
    .any()
    .refine((file) => validateFile(file, ['image/jpeg', 'image/png', 'application/pdf'], 5), "File must be a JPEG, PNG, or PDF under 5MB")
    .optional(),
    taxSticker: z
    .any()
    .refine((file) => validateFile(file, ['image/jpeg', 'image/png', 'application/pdf'], 5), "File must be a JPEG, PNG, or PDF under 5MB")
    .optional(),
});

// Full schema for final validation
export const vehicleSchema = z.object({
  brand:   z.enum(["TOYOTA","HONDA","FORD","MERCEDES","BMW","AUDI","VOLKSWAGEN", "HYUNDAI","KIA","NISSAN","PEUGEOT",
    "RENAULT",
    "FIAT",
    "VOLVO",
    "MAZDA",
    "JEEP",
    "TESLA",
    "SUZUKI",
    "SKODA",
  ]),
  model: z.string().min(6, "Model name must be at least 6 characters"),
  category:z.enum([
    "CITADINE",
    "BERLINE",
    "SUV",
    "UTILITAIRE",
  ]),
  plateNumber: z.string().min(6, "Plate number must be at least 6 characters"),
  chassisNumber: z.string().min(6, "Chassis number must be at least 6 characters"),
  year: z.number().min(1900, "Year must be 1900 or later").max(new Date().getFullYear() + 1, "Year cannot be in the future"),
  color:  z.enum([
    "BLACK", "WHITE", "GREY", "BLUE", "RED",
    "GREEN", "YELLOW", "GOLD",
  ]),
  doors: z.number().min(0, "Doors must be 0 or more"),
  fuelType: z.enum(['GASOLINE', 'DIESEL', 'ELECTRIC', 'HYBRID'], { message: "Invalid fuel type" }).default('GASOLINE'),
  gearbox: z.enum([
    "MANUAL", "AUTOMATIC"
  ]),
  mileage: z.number().min(0, "Mileage must be 0 or more"),
  status: z.enum(['AVAILABLE', 'RENTED', 'MAINTENANCE']).default('AVAILABLE'),

  dailyPrice: z.number().min(0, "Daily price must be 0 or more"),
  
  // Modified to properly handle existing images (string URLs) and new File objects
  image: z
    .any()
    .refine((file) => validateFile(file, ['image/jpeg', 'image/png'], 5), "Image must be a JPEG or PNG file under 5MB")
    ,
    
  // Dates
  oilChange: safeDate,
  timingBelt: safeDate,
  purchaseDate: safeDate,
  
  // Financial fields
  purchasePrice: z.number().min(0, "Purchase price must be 0 or more").optional(),
  advancePayment: z.number().min(0, "Advance payment must be 0 or more").optional(),
  remainingMonths: z.number().min(0, "Remaining months must be 0 or more").optional(),
  monthlyPayment: z.number().min(0, "Monthly payment must be 0 or more").optional(),
  paymentDay: z.number().min(1, "Payment day must be between 1 and 31").max(31, "Payment day must be between 1 and 31").optional(),
  
  // Documents - make sure field names match what's used in your form
  registrationDoc: z
    .any()
    .refine((file) => validateFile(file, ['image/jpeg', 'image/png', 'application/pdf'], 5), "File must be a JPEG, PNG, or PDF under 5MB")
    .optional(),
  insuranceDoc: z
    .any()
    .refine((file) => validateFile(file, ['image/jpeg', 'image/png', 'application/pdf'], 5), "File must be a JPEG, PNG, or PDF under 5MB")
    .optional(),
  purchaseDoc: z
    .any()
    .refine((file) => validateFile(file, ['image/jpeg', 'image/png', 'application/pdf'], 5), "File must be a JPEG, PNG, or PDF under 5MB")
    .optional(),
  authorization: z
    .any()
    .refine((file) => validateFile(file, ['image/jpeg', 'image/png', 'application/pdf'], 5), "File must be a JPEG, PNG, or PDF under 5MB")
    .optional(),
  taxSticker: z
    .any()
    .refine((file) => validateFile(file, ['image/jpeg', 'image/png', 'application/pdf'], 5), "File must be a JPEG, PNG, or PDF under 5MB")
    .optional(),
});

// Export the update schema (all fields optional for updates)
export const vehicleUpdateSchema = vehicleSchema.partial();

// Export step schemas for step-by-step validation
export const stepSchemas = [
  basicInfoSchema,
  technicalDetailsSchema,
  registrationPricingSchema,
  vehicleImageSchema,
  maintenanceSchema,
  documentsSchema,
];