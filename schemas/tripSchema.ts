import { z } from 'zod';

// Ce schéma est utilisé pour la DB locale SQLite. À retirer pour la DB cloud.
// Schéma pour la DB locale SQLite
const tripSchema = z.object({
  id: z.string(),
  ownerId: z.string(), // references User.uid
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  type: z.enum(['personal', 'business']).default('personal'),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
  positionsCount: z.number().min(0).default(0),
});

// Schéma pour la DB cloud (Firebase)
const tripLocalDBSchema = tripSchema.extend({
  sync: z.boolean().default(false),
});

export type Trip = z.infer<typeof tripSchema>;
export type tripLocalDBSchema = z.infer<typeof tripLocalDBSchema>;
export { tripLocalDBSchema, tripSchema };
export function toTripLocalDBSchema(trip: Trip): tripLocalDBSchema {
  return {
  ...trip,
  sync: false
};
}
