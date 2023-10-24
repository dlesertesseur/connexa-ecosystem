import React from "react";
import { Tabs } from "@mantine/core";

const TabLabel = ({ name, label }) => {
  return <Tabs.Tab value={name}>{label}</Tabs.Tab>;
};

export default TabLabel;
