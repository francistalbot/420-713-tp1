// Exemple pour RealTime Database
import { getDatabase, onValue, ref, set } from "firebase/database";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { app } from "../firebaseConfig";
 
export default function RealTimeExample() {
 const db = getDatabase(app);
 const [message, setMessageText] = useState("");
 
 useEffect(() => {
   const msgRef = ref(db, "message/");
   onValue(msgRef, (snapshot) => {
     const data = snapshot.val();
     setMessageText(data);
   });
 }, []);
 
 // écrire une donnée :
 useEffect(() => {
   set(ref(db, "message/"), "Bonjour depuis Expo !");
 }, []);
 
 return (
   <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
     <Text>Message dans la Realtime DB :</Text>
     <Text style={{ fontWeight: "bold" }}>{message}</Text>
   </View>
 );
}