import { t } from 'i18next';
import { z } from 'zod';


const dateString = z.string().refine((str) => !isNaN(Date.parse(str)), {
  message: t("errors.datemessage"),
}).transform((str) => new Date(str));
// const ALLOWED_ACCESSORIES = [
//     "Climatisation", 
//     "Gilet", 
//     "Triangle", 
//     "Roue de secours", 
//     "Post radio", 
//     "Siege bebe", 
//     "Extincteur"
//   ] ;
  
//   const ALLOWED_DOCUMENTS = [
//     "Carte grise", 
//     "Assurance", 
//     "Vignette", 
//     "Visite technique", 
//     "Autorisation", 
//     "Contrat"
//   ] ;

  const ALLOWED_ACCESSORIES = [
    t("accessories.climatisation"), 
    t("accessories.vest"),
    t("accessories.triangle"),
    t("accessories.spareTire"),
    t("accessories.radio"),
    t("accessories.babySeat"),
    t("accessories.fireExtinguisher"),
  ];

  const ALLOWED_DOCUMENTS = [
    t("documents.registrationCard"),
    t("documents.insurance"),
    t("documents.vignette"),
    t("documents.technicalVisit"),
    t("documents.authorization"),
    t("documents.contract"),
  ];


export const reservationSchema = z.object({
    vehicleId:  z.coerce.number().int().min(1,{ message:  t("errors.vehicleRequired") }),
    clientId:   z.coerce.number().int().min(1,{ message:  t("errors.clientRequired") }),
    startDate: dateString,
    endDate: dateString,
    totalAmount: z.coerce.number().min(0, { message: t("errors.minZero") }),
    deliveryLocation: z.string().min(1, { message: t("errors.locationRequired") }),
    returnLocation: z.string().min(1, { message: t("errors.locationRequired") }),
    additionalCharge: z.coerce.number().min(0).optional(),
    fuelLevel: z.coerce.number().int().min(1,{ message:  t("errors.invalidFuelLevel") }),
    departureKm: z.coerce.number().int().min(1,{ message:  t("errors.invalidKm") }),
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
  }).superRefine((data, ctx) => {
    if (data.secondDriver && !data.clientSecondId) {
      ctx.addIssue({
        path: ["clientSecondId"],
        code: z.ZodIssueCode.custom,
        message: "Second Client  driver is required",
      });
    }
  });;

