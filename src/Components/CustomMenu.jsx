import React from "react";
import CustomOptions from "./CustomOptions";
import ZeetrexCard from "./ZeetrexCard";
import OrganizationCard from "./OrganizationCard";
import { Stack } from "@mantine/core";
import { useWindowSize } from "../Hook";

const CustomMenu = () => {
  const wSize = useWindowSize();

  return (
    <Stack justify="space-between" spacing="xs" h={"100%"}>
      <OrganizationCard />
      <CustomOptions />
      <ZeetrexCard />
    </Stack>
  );
};

export default CustomMenu;
