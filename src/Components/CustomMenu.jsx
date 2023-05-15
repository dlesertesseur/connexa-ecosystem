import React from "react";
import CustomOptions from "./CustomOptions";
import ZeetrexCard from "./ZeetrexCard";
import OrganizationCard from "./OrganizationCard";
import { SimpleGrid } from "@mantine/core";

const CustomMenu = () => {
  return (
    <SimpleGrid cols={1} spacing={"xs"} h={"100%"}>
      <OrganizationCard />
      <CustomOptions />
      <ZeetrexCard />
    </SimpleGrid>
  );
};

export default CustomMenu;
