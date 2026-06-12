import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import {PropertyPolicy} from "~/types";

export const createPropertySchema = toTypedSchema(z.object({
    name: z.string('Мінімум 3 символи').min(3, 'Мінімум 3 символи'),
    slug: z.string('Slug обовʼязковий').min(2, 'Slug обовʼязковий').regex(/^[a-z0-9-]+$/, 'Тільки a-z, 0-9, дефіс'),
    description: z.string().optional(),
    city: z.string('Місто обовʼязкове').min(3, 'Місто обовʼязкове'),
    address: z.string('Адреса обовʼязкова').min(3, 'Адреса обовʼязкова'),
    latitude: z.number(),
    longitude: z.number(),
    policy: z.enum(PropertyPolicy),
}))