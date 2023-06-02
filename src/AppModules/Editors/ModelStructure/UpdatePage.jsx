import ResponceNotification from "../../../Modal/ResponceNotification";
import { Button, Group, LoadingOverlay, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useContext } from "react";
import { AbmStateContext } from "./Context";
import { findRackById } from "../../../DataAccess/Racks";
import { useWindowSize } from "../../../Hook";
import { HEADER_HIGHT } from "../../../Constants";
import Editor from "./Editor";

export function UpdatePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const { site, floor, refresh, selectedRowId } = useContext(AbmStateContext);
  const [errorMessage, setErrorMessage] = useState(null);
  const [working, setWorking] = useState(false);
  const [modelStructure, setModelStructure] = useState(null);
  const wSize = useWindowSize();

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

  const onUpdate = async (values) => {
    // const params = {
    //   token: user.token,
    //   data: values,
    //   id: selectedRowId
    // };
    // setWorking(true);
    // try {
    //   const ret = await updateOrganization(params);
    //   if (ret.error) {
    //     setWorking(false);
    //     setErrorMessage(ret.message);
    //   } else {
    //     setErrorMessage(null);
    //     setWorking(false);
    //     refresh();
    //     navigate("../");
    //   }
    // } catch (error) {
    //   setErrorMessage(error);
    // }
    // setWorking(false);
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

      <LoadingOverlay overlayOpacity={0.5} visible={errorMessage} />

      <Group position="center" spacing={0} h={wSize.height - HEADER_HIGHT}>
        <Editor structure={modelStructure} />
      </Group>

      <Group position="right" mt="xs" mb="xs" width="100%">
        <Button>{t("button.accept")}</Button>
        <Button
          onClick={(event) => {
            navigate(-1);
          }}
        >
          {t("button.cancel")}
        </Button>
      </Group>
    </Stack>
  );
}
