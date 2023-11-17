import { Flex, Group, Stack, Text } from "@mantine/core";
import React from "react";
import ImportarionCard from "./ImportarionCard";

const ImportationsPanel = ({ statuses }) => {
  return (
    <Flex wrap={"wrap"} gap={"xs"} justify="center">
      {statuses?.map((s) => (
        <ImportarionCard key={s} status={s} />
      ))}
    </Flex>
  );
};

export default ImportationsPanel;
