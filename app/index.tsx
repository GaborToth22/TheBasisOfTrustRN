import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center", 
      }}
    >
      <Text>The Basis Of Trust React Native</Text>
      <StatusBar style="auto" />
      <Link href="/login" style={{ color: "blue"}}>Login</Link>
    </View>
  );
}
