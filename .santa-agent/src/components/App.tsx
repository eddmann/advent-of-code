import React, { useState, useEffect, useCallback } from "react";
import { Box, Text } from "ink";
import { Spinner } from "@inkjs/ui";
import { ProgressTable } from "./ProgressTable.tsx";
import { LogPanel } from "./LogPanel.tsx";
import type { LogEntry } from "./LogPanel.tsx";
import type { SolutionTask } from "../discovery.ts";
import type { AgentEvent } from "../agent.ts";
import { discoverTasks, getExistingSantaSolutions } from "../discovery.ts";
import { readSourceSolutions } from "../source-reader.ts";
import { fetchPuzzleData } from "../aoc-client.ts";
import { runAgent } from "../agent.ts";
import { ensureSantaCli, ensureTinsel, formatSantaFile } from "../tools.ts";
import { mkdirSync, existsSync, unlinkSync } from "fs";
import { dirname } from "path";

interface Props {
  year?: number;
  day?: number;
  concurrency?: number;
  dryRun?: boolean;
}

export function App({ year, day, concurrency = 3, dryRun = false }: Props) {
  const [tasks, setTasks] = useState<SolutionTask[]>([]);
  const [existingDays, setExistingDays] = useState<
    { year: number; day: number }[]
  >([]);
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  const [runningTasks, setRunningTasks] = useState<string[]>([]);
  const [totalCost, setTotalCost] = useState(0);
  const [startTime] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [done, setDone] = useState(false);

  const addLog = useCallback(
    (event: AgentEvent, task?: string) => {
      setLogEntries((prev) => [
        ...prev,
        { timestamp: new Date(), event, task },
      ]);
    },
    []
  );

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  // Main orchestration loop
  useEffect(() => {
    async function run() {
      await Promise.all([ensureSantaCli(), ensureTinsel()]);

      const discovered = discoverTasks(year, day);
      const existing = getExistingSantaSolutions();
      setTasks(discovered);
      setExistingDays(existing);

      if (discovered.length === 0) {
        addLog({
          type: "text",
          content: "No tasks to process — all solutions exist or no source available",
        });
        setDone(true);
        return;
      }

      addLog({
        type: "text",
        content: `Found ${discovered.length} solutions to generate`,
      });

      if (dryRun) {
        for (const task of discovered) {
          addLog(
            {
              type: "text",
              content: `Would generate: ${task.targetPath} from ${task.sourceFiles.length} source file(s)`,
            },
            `${task.year}/d${task.day}`
          );
        }
        setDone(true);
        return;
      }

      const aocToken = process.env.AOC_SESSION;
      if (!aocToken) {
        addLog({
          type: "error",
          content: "AOC_SESSION environment variable not set!",
        });
        setDone(true);
        return;
      }

      async function processTask(task: SolutionTask) {
        const taskLabel = `${task.year}/d${String(task.day).padStart(2, "0")}`;
        setRunningTasks((prev) => [...prev, taskLabel]);

        task.status = "running";
        setTasks([...discovered]);

        try {
          const source = readSourceSolutions(task.sourceFiles, task.testFiles);
          addLog(
            {
              type: "text",
              content: `Reading ${source.language} source (${task.sourceFiles.length} files)`,
            },
            taskLabel
          );

          addLog(
            { type: "text", content: "Fetching puzzle from AoC..." },
            taskLabel
          );
          const puzzleData = await fetchPuzzleData(
            task.year,
            task.day,
            aocToken
          );

          const targetDir = dirname(task.targetPath);
          if (!existsSync(targetDir)) {
            mkdirSync(targetDir, { recursive: true });
          }

          addLog(
            { type: "text", content: "Starting agent..." },
            taskLabel
          );

          let agentSucceeded = false;

          for await (const event of runAgent(
            task,
            source,
            puzzleData.prose,
            puzzleData.submittedAnswers
          )) {
            addLog(event, taskLabel);

            if (event.type === "result") {
              if (event.cost) setTotalCost((prev) => prev + event.cost!);
              agentSucceeded = event.content === "completed";
            }
          }

          if (agentSucceeded && existsSync(task.targetPath)) {
            const fmt = formatSantaFile(task.targetPath);
            if (!fmt.ok) {
              addLog({ type: "error", content: `fmt: ${fmt.error}` }, taskLabel);
            }
            task.status = "pass";
          } else {
            if (existsSync(task.targetPath)) {
              unlinkSync(task.targetPath);
            }
            task.status = "fail";
          }
        } catch (error: any) {
          addLog(
            {
              type: "error",
              content: error.message || String(error),
            },
            taskLabel
          );
          task.status = "fail";
        }

        setRunningTasks((prev) => prev.filter((t) => t !== taskLabel));
        setTasks([...discovered]);
      }

      // Worker pool: run up to `concurrency` tasks at a time
      const queue = [...discovered];
      const workers: Promise<void>[] = [];

      for (let i = 0; i < Math.min(concurrency, queue.length); i++) {
        workers.push((async () => {
          while (queue.length > 0) {
            const task = queue.shift()!;
            await processTask(task);
          }
        })());
      }

      await Promise.all(workers);
      setDone(true);
    }

    run();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const passCount = tasks.filter((t) => t.status === "pass").length;
  const failCount = tasks.filter((t) => t.status === "fail").length;
  const pendingCount = tasks.filter(
    (t) => t.status === "pending" || t.status === "running"
  ).length;
  const elapsedStr = `${Math.floor(elapsed / 60)}m ${elapsed % 60}s`;

  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1}>
        <Text bold color="magenta">
          santa-agent
        </Text>
      </Box>

      <ProgressTable tasks={tasks} existingDays={existingDays} />

      <Box marginY={1} flexDirection="column">
        {runningTasks.length > 0 ? (
          <Box>
            <Spinner label={`Generating ${runningTasks.join(", ")}...`} />
          </Box>
        ) : done ? (
          <Text color="green" bold>
            Complete!
          </Text>
        ) : (
          <Text dimColor>Initializing...</Text>
        )}

        <Box marginTop={1} gap={2}>
          <Text dimColor>cost</Text>
          <Text>${totalCost.toFixed(4)}</Text>
          <Text dimColor>elapsed</Text>
          <Text>{elapsedStr}</Text>
          <Text dimColor>|</Text>
          <Text color="green">{passCount} passed</Text>
          <Text color="red">{failCount} failed</Text>
          <Text dimColor>{pendingCount} pending
          </Text>
        </Box>
      </Box>

      <LogPanel entries={logEntries} />
    </Box>
  );
}
