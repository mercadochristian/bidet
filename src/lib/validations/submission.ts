import { z } from 'zod'

export const submissionSchema = z
  .object({
    nickname: z.string().min(1, 'Nickname is required').max(30, 'Nickname must be 30 characters or less'),
    locationId: z.string().uuid().optional(),
    newLocationName: z.string().optional(),
    newLocationAddress: z.string().optional(),
    lat: z.number().optional(),
    lng: z.number().optional(),
    placeType: z.string().optional(),
    hasBidet: z.boolean({ error: 'Please select yes or no' }),
    bidetType: z.enum(['spray_hose', 'built_in_seat', 'standalone', 'other']).optional(),
    cleanliness: z.number().min(1).max(5).optional(),
    isPaid: z.boolean().optional(),
    notes: z.string().max(500, 'Notes must be 500 characters or less').optional(),
  })
  .superRefine((data, ctx) => {
    const hasExisting = !!data.locationId
    const hasNew = !!data.newLocationName && !!data.newLocationAddress

    if (!hasExisting && !hasNew) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please select an existing location or provide a new location name and address',
        path: ['locationId'],
      })
    }

    if (!hasExisting && data.newLocationName && !data.newLocationAddress) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Address is required for new locations',
        path: ['newLocationAddress'],
      })
    }

    if (!hasExisting && !data.newLocationName && data.newLocationAddress) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Name is required for new locations',
        path: ['newLocationName'],
      })
    }
  })

export type SubmissionFormData = z.infer<typeof submissionSchema>
