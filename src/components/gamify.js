import { Box } from "@chakra-ui/react";
import { CircularProgress, CircularProgressLabel } from "@chakra-ui/react";

import { useLiveQuery } from "dexie-react-hooks";
import { getDailyGoals } from "./dailygoal";

export function DailyGoalProgress() {

  //TODO: merge with dialygoalitems?
  const dailyGoalProgress = useLiveQuery(async () => {
    const res = await getDailyGoals();
    if (res.found) {
        //console.log("found");
        //console.log(res.goal)
        return res.goal.progress;
    } else {
        return 0;
    }
  })

  const getColor = (progress) => {
    if (progress < 30) {
      return "orange.400";
    } else if (progress < 70) {
      return "yellow.400";
    } else {
      return "green.400";
    }
  }

  return (
    <Box bg="gray.300" w="200px" borderRadius="md" boxShadow="md" p="6">
      Your Progress Today:
      <CircularProgress value={dailyGoalProgress} size="120px" color={getColor(dailyGoalProgress)}>
        <CircularProgressLabel>{dailyGoalProgress?.toString()}%</CircularProgressLabel>
      </CircularProgress>
    </Box>
  );
}
