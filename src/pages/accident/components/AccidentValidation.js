import { z } from "zod";


export const FaultTypeEnum = z.enum(["CLIENT", "THIRD_PARTY", "UNKNOWN"]);
export const AccidentStatusEnum = z.enum(["REPORTED", "IN_PROGRESS", "REPAIRED", "CLOSED"]);


export const accidentSchema = z.object({
  vehicleId: z.number(),
  clientId: z.number().nullable().optional(),

  accidentDate: z.string().datetime(), 
  location: z.string().min(1, "Location is required"),
  description: z.string().optional(),
  repairCost: z.number().optional(),
  fault: FaultTypeEnum.default("UNKNOWN"),
  damagePhotos: z.string().optional(), 
  status: AccidentStatusEnum.default("REPORTED"),

  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});
export const accidentUpdateSchema = accidentSchema.partial();
