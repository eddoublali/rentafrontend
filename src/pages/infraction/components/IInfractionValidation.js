import { z } from 'zod';
import { t } from 'i18next';

export const infractionSchema = z.object({
  vehicleId: z.coerce
    .number()
    .int({ message: t('infraction.validation.vehicleId.int') })
    .min(1, { message: t('infraction.validation.vehicleId.required') }),

  clientId: z.coerce
    .number()
    .int({ message: t('infraction.validation.clientId.int') })
    .min(1, { message: t('infraction.validation.clientId.required') }),

  infractionType: z
    .string()
    .min(1, { message: t('infraction.validation.infractionType.required') }),

  fineAmount: z.coerce
    .number()
    .min(0, { message: t('infraction.validation.fineAmount.min') }),

  infractionDate: z.coerce.date({
    errorMap: () => ({ message: t('infraction.validation.infractionDate.invalid') }),
  }),

  status: z.enum(['PENDING', 'PAID', 'UNPAID'], {
    errorMap: () => ({ message: t('infraction.validation.status.invalid') }),
  }).default('PENDING'),
});
