import { addDoc, collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Button, FlatList, Text, TextInput, View } from "react-native";
import { db } from "../../firebaseConfig";

//Cette fonction a une erreur a cause du manque de permissions dans firestore rules
export default function FirestoreDemo() {
  const [name, setName] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  async function addUser() {
    console.log("Adding user:", name);
    await addDoc(collection(db, "users"), {
      name,
    });
    console.log("Added user:", name);
    setName("");
    loadUsers();
  }
  async function loadUsers() {
    const snap = await getDocs(collection(db, "users"));
    setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  }
  useEffect(() => {
    loadUsers();
  }, []);
  return (
    <View style={{ padding: 20 }}>
      <TextInput placeholder="Nom" value={name} onChangeText={setName} />
      <Button title="Ajouter" onPress={addUser} />
      <FlatList
        data={users}
        renderItem={({ item }) => <Text>{item.name}</Text>}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
