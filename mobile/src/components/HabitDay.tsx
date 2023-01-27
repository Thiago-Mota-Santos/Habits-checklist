import {
  Dimensions,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import { generateProgressPorcentage } from "../utils/generateProgressPorcentage";
import clsx from "clsx";
import dayjs from "dayjs";

const weekDays = 7;
const ScreenHorizontalPadding = (32 * 2) / 5;

export const DayMarginBetween = 8;
export const DaySize =
  Dimensions.get("screen").width / weekDays - (ScreenHorizontalPadding + 5);

interface HabitProps extends TouchableOpacityProps {
  amount?: number;
  completed?: number;
  date: Date;
}

export default function HabitDay({
  amount = 0,
  completed = 0,
  date,
  ...props
}: HabitProps) {
  const percentualProgress =
    amount > 0 ? generateProgressPorcentage(completed, amount) : 0;
  const today = dayjs().startOf("day").toDate();
  const isCurrentDay = dayjs(date).isSame(today);

  return (
    <TouchableOpacity
      className={clsx("rounded-lg border-2 m-1", {
        "bg-zinc-900 border-zinc-900": percentualProgress === 0,
        "bg-violet-900 border-violet-700":
          percentualProgress > 0 && percentualProgress < 20,
        "bg-violet-800 border-violet-600":
          percentualProgress >= 20 && percentualProgress < 40,
        "bg-violet-700 border-violet-500":
          percentualProgress >= 40 && percentualProgress < 60,
        "bg-violet-600 border-violet-400":
          percentualProgress >= 60 && percentualProgress < 80,
        "bg-violet-500 border-violet-300": percentualProgress >= 80,
        ["border-white border-4"]: isCurrentDay,
      })}
      style={{ width: DaySize, height: DaySize }}
      activeOpacity={0.7}
      {...props}
    />
  );
}
