import { useRoute } from "@react-navigation/native";
import { ScrollView, View, Text } from "react-native";
import dayjs from "dayjs";
import { BackButton } from "../components/BackButton";
import { ProgressBar } from "../components/ProgressBar";
import { CheckBox, checkProps } from "../components/CheckBox";
import { HabitEmpty } from "../components/HabitEmpty";
import { useEffect, useState } from "react";
import { Loading } from "../components/Loading";
import { api } from "../lib/axios";
import { generateProgressPorcentage } from "../utils/generateProgressPorcentage";
import clsx from "clsx";
import { HoldItem } from "react-native-hold-menu";

interface Params {
  date: string;
}

interface habitDayProps {
  possibleHabits: {
    id: string;
    title: string;
  }[];
  completedHabits: string[];
}

export function Habit() {
  const [loading, setLoading] = useState(true);
  const [dayHabit, setDayHabit] = useState<habitDayProps>();
  const [newPossibleHabits, setNewPossiblehabits] = useState<string[]>();

  const route = useRoute();
  const { date } = route.params as Params;

  const parsedDate = dayjs(date);
  const isDateInPast = parsedDate.endOf("day").isBefore(new Date());
  const dayOfWeek = parsedDate.format("dddd");
  const dayOfMonth = parsedDate.format("DD/MM");

  const habitsProgress = dayHabit?.possibleHabits.length
    ? generateProgressPorcentage(
        dayHabit.completedHabits.length,
        dayHabit.possibleHabits.length
      )
    : 0;

  async function handleRemoveHabits(habitId: string) {
    try {
      await api.delete(`habits/${habitId}/delete`);
      console.log(dayHabit?.possibleHabits);

      setDayHabit((prev) => {
        if (!prev) {
          return;
        }
        const newHabits = JSON.parse(JSON.stringify(prev.possibleHabits));
        return {
          possibleHabits: newHabits.filter(
            (habit: { id: string }) => habit.id !== habitId
          ),
          completedHabits: prev.completedHabits,
        };
      });
    } catch (error) {
      console.error(error);
    }
  }
  async function handleToggleHabits(habitId: string) {
    try {
      await api.patch(`habits/${habitId}/toggle`);
      const isAlreadyCompleted = dayHabit?.completedHabits.includes(habitId);

      let completedHabits: string[] = [];
      if (isAlreadyCompleted) {
        completedHabits = dayHabit!.completedHabits.filter(
          (id) => id !== habitId
        );
      } else {
        completedHabits = [...dayHabit!.completedHabits, habitId];
      }
      setDayHabit({
        possibleHabits: dayHabit!.possibleHabits,
        completedHabits,
      });
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    setLoading(true);
    api
      .get("day", {
        params: {
          date: date,
        },
      })
      .then((response) => setDayHabit(response.data))
      .finally(() => setLoading(false))
      .finally(() => {
        if (loading) {
          return <Loading />;
        }
      });
  }, []);

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <BackButton />
        <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
          {dayOfWeek}
        </Text>
        <Text className=" text-white font-extrabol text-3xl">{dayOfMonth}</Text>
        <ProgressBar progress={habitsProgress} />

        <View
          className={clsx("mt-6", {
            ["opacity-50"]:
              dayHabit?.possibleHabits &&
              isDateInPast &&
              dayHabit?.possibleHabits.length > 0,
          })}
        >
          {dayHabit?.possibleHabits && dayHabit?.possibleHabits?.length > 0 ? (
            dayHabit?.possibleHabits.map((habit) => {
              return (
                <CheckBox
                  key={habit.id}
                  title={habit.title}
                  checked={dayHabit.completedHabits.includes(habit.id)}
                  onPress={() => handleToggleHabits(habit.id)}
                  disabled={isDateInPast}
                  onRemove={() => handleRemoveHabits(habit.id)}
                />
              );
            })
          ) : (
            <HabitEmpty />
          )}
        </View>
        {dayHabit?.possibleHabits &&
          isDateInPast &&
          dayHabit?.possibleHabits.length > 0 && (
            <Text className="mt-10 text-center text-white">
              Voc?? n??o pode editar h??bitos passados
            </Text>
          )}
      </ScrollView>
    </View>
  );
}
