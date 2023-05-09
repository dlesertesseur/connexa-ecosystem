import React, { useEffect } from "react";
import {
  Modal,
  Button,
  Group,
  useMantineTheme,
  Stack,
  Textarea,
  Select,
  NumberInput,
  SegmentedControl,
  Center,
  Box,
  ColorInput,
} from "@mantine/core";
import { t } from "i18next";
import { IconAlignCenter, IconAlignRight, IconAlignLeft } from "@tabler/icons";
import { useForm } from "@mantine/form";
import { colorList } from "../../Util";

const TextEditor = ({ data, opened, setOpened, updateMarker }) => {
  const theme = useMantineTheme();

  const form = useForm({
    initialValues: {
      text: "",
      stroke: "",
      align: "",
      fontSize: 0,
      fontFamily: "",
    },

    validate: {
      text: (val) => (val ? null : t("validation.required")),
      stroke: (val) => (val ? null : t("validation.required")),
      align: (val) => (val ? null : t("validation.required")),
      fontSize: (val) => (val ? null : t("validation.required")),
      fontFamily: (val) => (val ? null : t("validation.required")),
    },
  });

  useEffect(() => {
    if (data) {
      form.setFieldValue("text", data.text);
      form.setFieldValue("stroke", data.stroke);
      form.setFieldValue("align", data.align);
      form.setFieldValue("fontSize", data.fontSize);
      form.setFieldValue("fontFamily", data.fontFamily);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const onAccept = (values) => {
    updateMarker(data.id, values);
    setOpened(false);
  };

  return (
    <Modal
      onClose={() => {
        setOpened(false);
      }}
      opened={opened}
      size={"xs"}
      title={t("dialog.textEditor.title")}
      overlayColor={theme.colorScheme === "dark" ? theme.colors.dark[9] : theme.colors.gray[2]}
      overlayOpacity={0.55}
      overlayBlur={3}
      centered
    >
      <form
        onSubmit={form.onSubmit((values) => {
          console.log("values -> ", values);
          onAccept(values);
        })}
      >
        <Stack spacing={"xs"}>
          <Textarea label={t("label.markerText")} minRows={2} {...form.getInputProps("text")} />

          <ColorInput
            format="hex"
            placeholder={t("label.select")}
            label={t("label.textColor")}
            disallowInput
            withPicker={false}
            swatches={colorList()}
            {...form.getInputProps("stroke")}
          />

          <Select
            label={t("label.fontFamily")}
            placeholder={t("label.select")}
            data={[
              { value: "Arial", label: "Arial" },
              { value: "Calibri", label: "Calibri" },
              { value: "Verdata", label: "Verdata" },
            ]}
            {...form.getInputProps("fontFamily")}
          />
          <NumberInput
            placeholder={t("label.fontSize")}
            label={t("label.fontSize")}
            {...form.getInputProps("fontSize")}
          />

          <SegmentedControl
            {...form.getInputProps("align")}
            data={[
              {
                value: "left",
                label: (
                  <Center>
                    <IconAlignLeft size={16} />
                    <Box ml={10}>{t("label.left")}</Box>
                  </Center>
                ),
              },
              {
                value: "center",
                label: (
                  <Center>
                    <IconAlignCenter size={16} />
                    <Box ml={10}>{t("label.center")}</Box>
                  </Center>
                ),
              },
              {
                value: "right",
                label: (
                  <Center>
                    <IconAlignRight size={16} />
                    <Box ml={10}>{t("label.right")}</Box>
                  </Center>
                ),
              },
            ]}
          />
          <Group mt="xl" position="right">
            <Button type="submit">{t("button.accept")}</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default TextEditor;
