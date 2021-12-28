import { Box } from "@chakra-ui/react";
import { CircularProgress, CircularProgressLabel } from "@chakra-ui/react";

export function DailyGoalProgress() {
  return (
    <Box bg="gray.300" w="200px" borderRadius="md" boxShadow="md" p="6">
      Your Progress Today:
      <CircularProgress value={30} size="120px" color="green.400">
        <CircularProgressLabel>40%</CircularProgressLabel>
      </CircularProgress>
    </Box>
  );
}
