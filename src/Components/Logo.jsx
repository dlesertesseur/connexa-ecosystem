import React from "react";
import { Group, Image } from "@mantine/core";

const Logo = ({width = 80}) => {
  return (
    <Group position="center" mx={"xs"}>
      <Image src="/connexa/logo.png" alt="image" width={width} />
    </Group>
  );
};

export default Logo;
