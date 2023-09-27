import React from "react";
import { Button, Group, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";

const FormSelectorToolbar = ({ onBack }) => {
  const { t } = useTranslation();
  return (
    <Group position="right">
      <Button onClick={onBack}>
        <Text>{t("button.back")}</Text>
      </Button>
    </Group>
  );
};

export default FormSelectorToolbar;
