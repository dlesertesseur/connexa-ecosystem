import React from "react";
import { Group, Image} from "@mantine/core";

const Logo = () => {
  return (
    <Group position="center" mx={"xs"}>
      <Image src="/connexa/logo.png" alt="image" width={80} />
    </Group>
  );
};

export default Logo;
