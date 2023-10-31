import { Button, Group, Text } from "@mantine/core";
import React from "react";
import { useTranslation } from "react-i18next";

const HeaderPanel = ({businessProcessInstance, onBack}) => {
  const { t } = useTranslation();
  return (
    <Group position="apart" mt={"xs"}>
      <Text> {businessProcessInstance?.name}</Text>
      <Button size="xs" onClick={onBack}>
        <Text>{t("button.back")}</Text>
      </Button>
    </Group>
  );
};

export default HeaderPanel;
