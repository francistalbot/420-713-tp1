import * as Location from "expo-location";
let timer: NodeJS.Timer | null = null;

export async function startTracking(cb: (pos:{lat:number,lng:number,ts:string})=>void) {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") throw new Error("Permission refusée");
  if (timer) return;
  timer = setInterval(async () => {
    const loc = await Location.getCurrentPositionAsync({});
    const ts = formatDate(new Date());
    cb({ lat: loc.coords.latitude, lng: loc.coords.longitude, ts });
  }, 5000);
}

export function stopTracking() {
  if (timer) { clearInterval(timer); timer = null; }
}
