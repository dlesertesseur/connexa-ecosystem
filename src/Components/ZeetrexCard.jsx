import {
  Group,
  Image,
  Paper,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import React from "react";

const ZeetrexCard = () => {
  const theme = useMantineTheme();
  const bgColor = theme.colors.gray[1];
  return (
    <Stack radius="md" p={"xs"}>
      <Paper withBorder bg={bgColor} p={"xs"}>
        <Group position="apart">
          <Image
            src="/connexa/zeetrex.png"
            alt="logo"
            width={100}
            component="a"
            href="http://www.zeetrex.com"
            target="_blank"
          />
          <Text size={"xs"} weight={100}>
            © 2023 zeeTrex
          </Text>
        </Group>
      </Paper>
    </Stack>
  );
};

export default ZeetrexCard;
