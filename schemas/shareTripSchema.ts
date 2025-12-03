import { z } from "zod";

// Ce schéma est utilisé pour la DB locale SQLite. À retirer pour la DB cloud.
// Schéma pour la DB locale SQLite
const tripSchema = z.object({
  tripId: z.string(),
  ownerId: z.string(),
  targetUserId: z.string(),
  targetEmail: z.email({ message: "L'adresse courriel n'est pas valide." }),
  sharedAt: z.date().default(() => new Date()),
});

export type ShareTrip = z.infer<typeof tripSchema>;
