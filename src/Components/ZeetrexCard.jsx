import { Group, Image, Paper, Stack, Text, useMantineTheme } from "@mantine/core";
import React from "react";
import { useTranslation } from "react-i18next";
import { config } from "../Constants/config";

const ZeetrexCard = () => {
  const { t } = useTranslation();
  const theme = useMantineTheme();
  const bgColor = theme.colors.gray[1];
  return (
    <Stack radius="md" p={"xs"}>
      <Paper withBorder bg={bgColor} p={"xs"}>
        <Group position="apart">
          <Image
            src={config.PUBLIC_URL+"/logos/zeetrex.png"}
            alt="logo"
            width={100}
            component="a"
            href={t("label.url")}
            target="_blank"
          />
          <Text size={"xs"} weight={500} color="gray">
            {t("label.copyright")}
          </Text>
        </Group>
      </Paper>
    </Stack>
  );
};

export default ZeetrexCard;
