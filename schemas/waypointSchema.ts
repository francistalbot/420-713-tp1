import { z } from 'zod';

const waypointSchema = z.object({
  id: z.string(),
  tripid: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  timestamp: z.date().default(new Date()),
});

export type Waypoint = z.infer<typeof waypointSchema>;
export { waypointSchema };

