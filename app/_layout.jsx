import { Stack, Slot } from "expo-router";
import { LoggedUserProvider } from '../context/globalContext'
export default function RootLayout() {
  return (
    <LoggedUserProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false}} />
        <Stack.Screen name="(auth)" options={{ headerShown: false}} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false}} />
      </Stack>
    </LoggedUserProvider>
  );
}
