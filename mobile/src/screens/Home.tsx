import { api } from "../lib/axios";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import HabitDay, { DaySize } from "../components/HabitDay";
import Header from "../components/Header";
import { generateRangeBetweenDays } from "../utils/generateRangeBetweenDays";
import { Loading } from "../components/Loading";
import dayjs from "dayjs";

const weekdays = ["D", "S", "T", "Q", "Q", "S", "S"];

const summaryDays = generateRangeBetweenDays();

const minumumdays = 18 * 5;
const diferencedays = minumumdays - summaryDays.length;

type SummaryProps = {
  id: string;
  date: Date;
  completed: number;
  amount: number;
}[];

export function Home() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<SummaryProps | null>(null);
  const { navigate } = useNavigation();

  useFocusEffect(
    useCallback(() => {
      api
        .get("summary")
        .then((response) => {
          setSummary(response.data), setLoading(true);
        })
        .catch((error) => {
          Alert.alert("Ops", "Os dados não foram carregados"),
            console.log(error);
        })
        .finally(() => setLoading(false));
    }, [])
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <Header />
      <View className="flex-row mt-6 mb-2">
        {weekdays.map((date, i) => {
          return (
            <Text
              key={`${date} + ${i}`}
              className=" text-zinc-400 text-xl font-bold text-center mr-2"
              style={{ width: DaySize }}
            >
              {date}
            </Text>
          );
        })}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="flex-row flex-wrap">
          {summaryDays.map((date) => {
            const dayWithHabits = summary?.find((day) => {
              return dayjs(date).isSame(day.date, "day");
            });

            return (
              <HabitDay
                key={date.toISOString()}
                onPress={() => navigate("habit", { date: date.toISOString() })}
                date={date}
                amount={dayWithHabits?.amount}
                completed={dayWithHabits?.completed}
              />
            );
          })}

          {diferencedays > 0 &&
            Array.from({ length: diferencedays }).map((_, i) => {
              return (
                <View
                  key={i}
                  className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40"
                  style={{ width: DaySize, height: DaySize }}
                />
              );
            })}
        </View>
      </ScrollView>
    </View>
  );
}
