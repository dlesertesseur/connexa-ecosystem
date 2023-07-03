import ResponceNotification from "../../../../Modal/ResponceNotification";
import { Stack } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import Viewer from "./Viewer";

export function GraphPage({action}) {
  const { t } = useTranslation();
  const [errorMessage, setErrorMessage] = useState(null);

  return (
    <Stack
      justify="stretch"
      spacing={0}
      sx={(theme) => ({
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
        height: "100%",
        width: "100%",
      })}
    >
      <ResponceNotification
        opened={errorMessage ? true : false}
        onClose={() => setErrorMessage(null)}
        code={errorMessage}
        title={t("status.error")}
        text={errorMessage}
      />

      <Viewer action={action}/>
    </Stack>
  );
}
