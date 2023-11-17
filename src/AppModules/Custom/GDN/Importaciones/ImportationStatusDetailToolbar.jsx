import React from "react";
import { Button, Group, Stack, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";

const ImportationStatusDetailToolbar = ({ back = null, title }) => {
  const { t } = useTranslation();

  return (
    <Stack spacing={"xs"}>
      <Group position="apart">
        <Group>
          <Text size={"md"} weight={600}>{title}</Text>
        </Group>
        <Button onClick={back} disabled={back === null ? true : false}>
          <Text>{t("button.back")}</Text>
        </Button>
      </Group>
    </Stack>
  );
};

export default ImportationStatusDetailToolbar;
