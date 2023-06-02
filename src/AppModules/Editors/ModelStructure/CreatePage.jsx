import ResponceNotification from "../../../Modal/ResponceNotification";
import Editor from "./Editor";
import { Button, Group, LoadingOverlay, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useContext } from "react";
import { AbmStateContext } from "./Context";
import { useWindowSize } from "../../../Hook";
import { HEADER_HIGHT } from "../../../Constants";
import StructureBuilder from "../../../Components/Builder3d/StructureBuilder";

export function CreatePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const { setReload } = useContext(AbmStateContext);
  const [errorMessage, setErrorMessage] = useState(null);
  const [working, setWorking] = useState(false);
  const [modelStructure, setModelStructure] = useState(null);
  const wSize = useWindowSize();

  const form = useForm({
    initialValues: {
      name: "",
      description: "",
    },

    validate: {
      name: (val) => (val ? null : t("validation.required")),
      description: (val) => (val ? null : t("validation.required")),
    },
  });

  const onCreate = async (values) => {
    const model = StructureBuilder.createShelving(values); 
    setModelStructure(model);
    
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
        <Editor structure={modelStructure} onCreate={onCreate} />
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
