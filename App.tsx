import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppStack from "./navigation/AppStack";
import { useFonts, Comfortaa_400Regular, Comfortaa_600SemiBold, Comfortaa_700Bold } from "@expo-google-fonts/comfortaa";
import { OpenSans_400Regular, OpenSans_700Bold } from "@expo-google-fonts/open-sans";
import { ActivityIndicator, View } from "react-native";
import { Colors } from "./theme/colors";

export default function App() {
  let [fontsLoaded] = useFonts({
    Comfortaa_Regular: Comfortaa_400Regular,
    Comfortaa_SemiBold: Comfortaa_600SemiBold,
    Comfortaa_Bold: Comfortaa_700Bold,
    OpenSans_Regular: OpenSans_400Regular,
    OpenSans_Bold: OpenSans_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: Colors.pale }}>
        <ActivityIndicator size="large" color={Colors.pale} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <AppStack />
    </NavigationContainer>
  );
}
