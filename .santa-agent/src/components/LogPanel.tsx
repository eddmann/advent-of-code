import React from "react";
import { Box, Text } from "ink";
import type { AgentEvent } from "../agent.ts";

interface LogEntry {
  timestamp: Date;
  event: AgentEvent;
  task?: string;
}

interface Props {
  entries: LogEntry[];
  maxLines?: number;
}

function formatEvent(entry: LogEntry): { prefix: string; color: string; text: string } {
  const e = entry.event;

  switch (e.type) {
    case "text":
      return {
        prefix: "Agent",
        color: "white",
        text: e.content.slice(0, 120),
      };
    case "tool_call":
      return {
        prefix: "Tool",
        color: "yellow",
        text: e.content,
      };
    case "tool_result":
      return {
        prefix: "Result",
        color: "gray",
        text: e.content.slice(0, 120),
      };
    case "result":
      return {
        prefix: e.content === "completed" ? "Done" : "Fail",
        color: e.content === "completed" ? "green" : "red",
        text: e.cost
          ? `$${e.cost.toFixed(4)} | ${((e.duration || 0) / 1000).toFixed(1)}s`
          : "",
      };
    case "error":
      return {
        prefix: "Error",
        color: "red",
        text: e.content.slice(0, 120),
      };
    default:
      return { prefix: "???", color: "gray", text: String(e) };
  }
}

export function LogPanel({ entries, maxLines = 12 }: Props) {
  const visible = entries.slice(-maxLines);

  return (
    <Box flexDirection="column" borderStyle="single" paddingX={1}>
      <Text bold>Activity Log</Text>
      {visible.length === 0 ? (
        <Text dimColor>Waiting to start...</Text>
      ) : (
        visible.map((entry, i) => {
          const { prefix, color, text } = formatEvent(entry);
          return (
            <Box key={i}>
              {entry.task && (
                <Text color="cyan">[{entry.task}] </Text>
              )}
              <Text color={color as any}>[{prefix}]</Text>
              <Text> {text}</Text>
            </Box>
          );
        })
      )}
    </Box>
  );
}

export type { LogEntry };
