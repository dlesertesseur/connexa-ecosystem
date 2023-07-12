import React from "react";
import { Group, Image } from "@mantine/core";
import { config } from "../Constants/config";

const Logo = ({width = 80}) => {
  return (
    <Group position="center" mx={"xs"}>
      <Image src={config.PUBLIC_URL+"/logos/logo.png"} alt="image" width={width} />
    </Group>
  );
};

export default Logo;
