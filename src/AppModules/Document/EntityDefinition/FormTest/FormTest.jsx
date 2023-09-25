import React from "react";
import EntityDefinitionHeader from "../EntityDefinitionHeader";
import { Button, Group, Paper, Stack, Text } from "@mantine/core";
import { useContext } from "react";
import { AbmStateContext } from "../Context";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import FormPanel from "./FormPanel";
import FormHeader from "./FormHeader";

const FormTest = ({ back }) => {
  const { selectedRowId } = useContext(AbmStateContext);
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Stack
      spacing={"xs"}
      justify="flex-start"
      sx={(theme) => ({
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
      })}
    >
      <FormHeader entityDefinition={null} text={t("document.entityDefinition.label.formTest")} />

      <Group p={0} position="right">
        <Button onClick={() => navigate(back)}>
          <Text>{t("button.back")}</Text>
        </Button>
      </Group>

      <Group grow>
        <Paper bg={"gray.1"} h={"100%"} p={"xs"} withBorder radius={0}>
          <FormPanel formId={selectedRowId} collection={false} />
        </Paper>
      </Group>
    </Stack>
  );
};

export default FormTest;
