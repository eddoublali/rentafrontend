import { z } from 'zod';

export const infractionSchema = z.object({
  vehicleId: z.coerce
    .number()
    .int({ message: "Vehicle ID must be a whole number." })
    .min(1, { message: "Vehicle ID is required." }),

  clientId: z.coerce
    .number()
    .int({ message: "Client ID must be a whole number." })
    .min(1, { message: "Client ID is required." }),

  infractionType: z
    .string()
    .min(1, { message: "Infraction type is required." }),

  fineAmount: z.coerce
    .number()
    .min(0, { message: "Fine amount must be zero or greater." }),

  infractionDate: z.coerce.date({
    errorMap: () => ({ message: "Please select a valid date." }),
  }),

  status: z.enum(['PENDING', 'PAID', 'UNPAID'], {
    errorMap: () => ({ message: "Status must be PENDING, PAID, or UNPAID." }),
  }).default('PENDING'),
});
