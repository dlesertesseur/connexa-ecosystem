import { Button, Group, Text } from "@mantine/core";
import React from "react";
import { useTranslation } from "react-i18next";

const BusinessProcessModelInboxToolbar = ({rowSelected, onCreate}) => {
  const { t } = useTranslation();

  return (
    <Group spacing={"lg"}>
      <Button disabled={!rowSelected} onClick={onCreate}>
        <Text>{t("businessProcessModelInbox.buttons.create")}</Text>
      </Button>
    </Group>
  );
};

export default BusinessProcessModelInboxToolbar;
