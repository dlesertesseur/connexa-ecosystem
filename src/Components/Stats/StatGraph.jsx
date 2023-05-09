import React from "react";
import { Paper } from "@mantine/core";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

export function StatGraph({ stat }) {
  return (
    <Paper withBorder radius="md" p="xs" sx={{ width: "100%", height: 400 }} key={stat.label}>
      {/* <Group position="apart">
        <Text
          size="xs"
          color="dimmed"
          mb={"sm"}
          sx={{
            fontWeight: 700,
            textTransform: "uppercase",
          }}
        >
          {stat.title}
        </Text>
      </Group> */}
      <ResponsiveContainer>
        <AreaChart
          title={stat.title}
          data={stat.data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          {/* <Tooltip /> */}
          <Area type="monotone" dataKey="uv" stackId="1" stroke="#8884d8" fill="#8884d8" />
          <Area type="monotone" dataKey="pv" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
          <Area type="monotone" dataKey="amt" stackId="1" stroke="#ffc658" fill="#ffc658" />
        </AreaChart>
      </ResponsiveContainer>
    </Paper>
  );
}
