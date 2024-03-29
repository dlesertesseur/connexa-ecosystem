import React from "react";
import ZeetrexCard from "./ZeetrexCard";
import OrganizationCard from "./OrganizationCard";
import { Stack } from "@mantine/core";
import { useWindowSize } from "../Hook";
import CustomOptionsAccordion from "./CustomOptionsAccordion";

const CustomMenu = () => {
  const wSize = useWindowSize();

  return (
    <Stack
      justify="space-between"
      spacing="xs"
      h={"100%"}
      onContextMenu={(e) => {
        e.preventDefault();
      }}
    >
      <OrganizationCard />
      {/* <CustomOptions /> */}
      <CustomOptionsAccordion />
      <ZeetrexCard />
    </Stack>
  );
};

export default CustomMenu;
