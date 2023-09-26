import React from "react";
import FormPanel from "./FormPanel";
import { Stack } from "@mantine/core";
import { useContext } from "react";
import { AbmStateContext } from "../Context";

const FormTest = () => {
  const { selectedRowId } = useContext(AbmStateContext);

  return (
    <Stack
      spacing={"xs"}
      justify="flex-start"
      sx={(theme) => ({
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
      })}
    >
      <FormPanel formId={selectedRowId} collection={false} parentId={null} />
    </Stack>
  );
};

export default FormTest;
