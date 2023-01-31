import "react-native-gesture-handler";
import * as Notifications from "expo-notifications";
import { HoldMenuProvider } from "react-native-hold-menu";
import { Feather } from "@expo/vector-icons";
import "./src/lib/dayjs";
import { StatusBar } from "react-native";
import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from "@expo-google-fonts/inter";
import { Loading } from "./src/components/Loading";
import { Routes } from "./src/routes";
import { useEffect } from "react";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  async function scheduleNotification() {
    const trigger = new Date(Date.now());

    trigger.setHours(trigger.getHours() + 8);
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Olá!",
        body: "Você praticou seus hábitos hoje?",
      },
      trigger,
    });
  }

  useEffect(() => {
    scheduleNotification();
  });

  if (!fontsLoaded) {
    return <Loading />;
  }

  return (
    <HoldMenuProvider theme="dark" iconComponent={Feather}>
      <Routes />
      <StatusBar
        barStyle={"light-content"}
        translucent
        backgroundColor="transparent"
      />
    </HoldMenuProvider>
  );
}
