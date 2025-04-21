// src/validations/reservationSchema.js
import { z } from 'zod';

// Date string transformation
const dateString = z.string().refine((str) => !isNaN(Date.parse(str)), {
  message: "Invalid date",
}).transform((str) => new Date(str));
const ALLOWED_ACCESSORIES = [
    "Climatisation", 
    "Gilet", 
    "Triangle", 
    "Roue de secours", 
    "Post radio", 
    "Siege bebe", 
    "Extincteur"
  ] ;
  
  const ALLOWED_DOCUMENTS = [
    "Carte grise", 
    "Assurance", 
    "Vignette", 
    "Visite technique", 
    "Autorisation", 
    "Contrat"
  ] ;

export const reservationSchema = z.object({
    vehicleId: z.coerce.number().int({ message: "Vehicle is required" }),
    clientId: z.coerce.number().int({ message: "Client is required" }),
    startDate: dateString,
    endDate: dateString,
    totalAmount: z.coerce.number().min(0, { message: "Amount must be at least 0" }),
    deliveryLocation: z.string().min(1, { message: "Required" }),
    returnLocation: z.string().min(1, { message: "Required" }),
    additionalCharge: z.coerce.number().min(0).optional(),
    fuelLevel: z.coerce.number().int().min(0,{ message: "Required" }),
    departureKm: z.coerce.number().int().min(0,{ message: "Required" }),
    secondDriver: z.boolean().default(false),
    clientSeconId: z.coerce.number().int().optional(),
    status: z.enum(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELED']),
    paymentMethod: z.enum(['CASH', 'CREDIT_CARD', 'BANK_TRANSFER']),
    paymentStatus: z.enum(['PENDING', 'PAID', 'FAILED']).default('PENDING'),
    accessories: z.array(z.enum(ALLOWED_ACCESSORIES))
    .max(7, { message: "Maximum 7 accessories allowed" })
    .optional()
    .default([]),
    documents: z.array(z.enum(ALLOWED_DOCUMENTS))
    .optional()
    .default([]),
    note: z.string()
      .max(10000, { message: "Note too long" })
      .optional()
  
  })
  .refine((data) => data.startDate < data.endDate, {
    message: "Start date must be before end date",
    path: ["endDate"], 
  });

