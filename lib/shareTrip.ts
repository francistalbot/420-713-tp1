import { db } from "@/lib/firebaseConfig";
import { ShareTrip } from "@/schemas/shareTripSchema";
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  writeBatch,
} from "firebase/firestore";

export async function shareTrip(
  ownerId: string,
  tripId: number,
  email: string
) {
  const userQuery = query(
    collection(db, "users"),
    where("email", "==", email.trim().toLowerCase())
  );
  const snapshot = await getDocs(userQuery);
  if (snapshot.empty) {
    throw new Error("Utilisateur cible introuvable.");
  }
  const targetUserId = snapshot.docs[0].data().uid;

  const shareTrip: ShareTrip = {
    tripId: tripId.toString(),
    ownerId: ownerId.toString(),
    targetUserId: targetUserId,
    targetEmail: email.trim().toLowerCase(),
    sharedAt: new Date(),
  };
  const docRef = await addDoc(collection(db, "sharedTrips"), shareTrip);
  const sharedTripsSnapshot = await getDocs(
    query(collection(db, "sharedTrips"))
  );
  return true;
}

export async function getSharedTripsForUser(tripId: number, userId: string) {
  const sharedTripsQuery = query(
    collection(db, "sharedTrips"),
    where("targetUserId", "==", userId.toString()),
    where("tripId", "==", tripId.toString())
  );
  const snapshot = await getDocs(sharedTripsQuery);
  const sharedTrips: ShareTrip[] = [];
  snapshot.forEach((doc) => {
    sharedTrips.push(doc.data() as ShareTrip);
  });
  return sharedTrips;
}

export async function deleteSharedTrip(
  tripId: number,
  ownerId: string,
  targetUserId: string
) {
  console.log(
    "deleteSharedTrip called with tripId:",
    tripId,
    "ownerId:",
    ownerId
  );
  /* */ const sharedTripsQuery = query(
    collection(db, "sharedTrips"),
    where("ownerId", "==", ownerId.toString()),
    where("tripId", "==", tripId.toString()),
    where("targetUserId", "==", targetUserId.toString())
  );
  const snapshot = await getDocs(sharedTripsQuery);
  const batch = writeBatch(db);
  snapshot.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();
}
