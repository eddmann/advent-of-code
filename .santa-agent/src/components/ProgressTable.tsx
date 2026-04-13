import React from "react";
import { Box, Text } from "ink";
import type { SolutionTask } from "../discovery.ts";

interface Props {
  tasks: SolutionTask[];
  existingDays: { year: number; day: number }[];
}

const STATUS: Record<string, { icon: string; color: string }> = {
  pending:  { icon: "○", color: "gray" },
  running:  { icon: "◉", color: "yellow" },
  pass:     { icon: "●", color: "green" },
  fail:     { icon: "●", color: "red" },
  skip:     { icon: "◌", color: "gray" },
  existing: { icon: "●", color: "cyan" },
  none:     { icon: "·", color: "gray" },
};

export function ProgressTable({ tasks, existingDays }: Props) {
  const years = new Set<number>();
  for (const t of tasks) years.add(t.year);
  for (const e of existingDays) years.add(e.year);
  const sortedYears = [...years].sort();

  const taskMap = new Map<string, SolutionTask>();
  for (const t of tasks) taskMap.set(`${t.year}-${t.day}`, t);

  const existingSet = new Set<string>();
  for (const e of existingDays) existingSet.add(`${e.year}-${e.day}`);

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text bold>Progress</Text>
      </Box>
      {sortedYears.map((year) => (
        <Box key={year}>
          <Text color="cyan">{year} </Text>
          <Box>
            {Array.from({ length: 25 }, (_, i) => {
              const day = i + 1;
              const key = `${year}-${day}`;
              const task = taskMap.get(key);

              const s = existingSet.has(key)
                ? STATUS.existing!
                : task
                  ? STATUS[task.status]!
                  : STATUS.none!;

              return <Text key={day} color={s.color as any}>{s.icon}</Text>;
            })}
          </Box>
        </Box>
      ))}
      <Box marginTop={1}>
        <Text dimColor>
          <Text color="cyan">●</Text> existing  <Text color="green">●</Text> pass  <Text color="red">●</Text> fail  <Text color="yellow">◉</Text> running  <Text color="gray">○</Text> pending  · no source
        </Text>
      </Box>
    </Box>
  );
}
