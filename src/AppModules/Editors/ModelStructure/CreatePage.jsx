import ResponceNotification from "../../../Modal/ResponceNotification";
import Editor from "./Editor";
import { Button, Group, LoadingOverlay, Stack } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useContext } from "react";
import { AbmStateContext } from "./Context";
import { useWindowSize } from "../../../Hook";
import { HEADER_HIGHT } from "../../../Constants";
import { createRack } from "../../../DataAccess/Racks";

export function CreatePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const { refresh, site, floor, initilizeContext, modelStructure } = useContext(AbmStateContext);
  const [errorMessage, setErrorMessage] = useState(null);
  const [working, setWorking] = useState(false);
  const wSize = useWindowSize();

  const onSave = async () => {
    const params = {
      token: user.token,
      data: modelStructure,
      siteId: site,
      floorId: floor
    };

    setWorking(true);

    try {
      const ret = await createRack(params);
      if (ret.error) {
        setWorking(false);
        setErrorMessage(ret.message);
      } else {
        setErrorMessage(null);
        setWorking(false);
        refresh();
        navigate("../");
      }
    } catch (error) {
      setErrorMessage(error);
    }
    setWorking(false);
  };

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

      <LoadingOverlay overlayOpacity={0.5} visible={working} />

      <Group position="center" spacing={0} h={wSize.height - HEADER_HIGHT}>
        <Editor structure={modelStructure} />
      </Group>

      <Group position="right" mt="xs" mb="xs" width="100%">
        <Button
          onClick={() => {onSave()}}
        >
          {t("button.accept")}
        </Button>
        <Button
          onClick={(event) => {
            initilizeContext();
            navigate(-1);
          }}
        >
          {t("button.cancel")}
        </Button>
      </Group>
    </Stack>
  );
}
