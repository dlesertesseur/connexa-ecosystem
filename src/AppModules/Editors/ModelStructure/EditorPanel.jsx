import ResponceNotification from "../../../Modal/ResponceNotification";
import Editor from "./Editor";
import EditorToolbar from "./EditorToolbar";
import { LoadingOverlay, Button, Stack, Group } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useContext } from "react";
import { AbmStateContext } from "./Context";
import { findRackById } from "../../../DataAccess/Racks";
import { useWindowSize } from "../../../Hook";
import { HEADER_HIGHT } from "../../../Constants";

export function EditorPanel() {
  const wSize = useWindowSize();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const { site, floor, selectedRowId } = useContext(AbmStateContext);
  const [errorMessage, setErrorMessage] = useState(null);
  const [working, setWorking] = useState(false);
  const [modelStructure, setModelStructure] = useState(null);
  const [transforOption, setTransforOption] = useState(null);

  const getData = async () => {
    const params = {
      token: user.token,
      siteId: site.id,
      floorId: floor.id,
      rackId: selectedRowId,
    };

    setWorking(true);
    const ret = await findRackById(params);
    setModelStructure(ret);
    setWorking(false);
  };

  useEffect(() => {
    getData();
  }, [selectedRowId]);

  return (
    <Stack
      justify="stretch"
      spacing="xs"
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

      <LoadingOverlay overlayOpacity={0.5} visible={errorMessage} />

      <EditorToolbar structure={modelStructure} transforOption={transforOption} setTransforOption={setTransforOption} />
      <Group position="center" spacing={0} h={wSize.height - (HEADER_HIGHT + 54)}>
        <Editor structure={modelStructure} transforOption={transforOption} />
      </Group>

      <Group position="right" mt="xs" mb="xs" width="100%">
        <Button
          onClick={(event) => {
            navigate(-1);
          }}
        >
          {t("button.close")}
        </Button>
      </Group>
    </Stack>
  );
}
