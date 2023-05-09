import { Modal, Group, Button, useMantineTheme, Stack, Alert } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconAlertTriangle } from "@tabler/icons";

const DeleteConfirmation = ({ opened, onClose, onConfirm, title, text }) => {
  const { t } = useTranslation();
  const theme = useMantineTheme();
  return (
    <Modal
      overlayColor={theme.colorScheme === "dark" ? theme.colors.dark[9] : theme.colors.gray[2]}
      overlayOpacity={0.55}
      overlayBlur={3}
      centered
      withCloseButton={false}
      opened={opened}
      padding={"0"}
      
    >
      <Stack>
        <Group>
          <Alert
            sx={{ height: "100%", width: "100%" }}
            icon={<IconAlertTriangle size={24} />}
            title={title}
            color={"yellow"}
            radius={"sm"}
          >
            {text}
            <Group position="right" mt={30}>
              <Button onClick={() => onConfirm()} color={"yellow"}>
                {t("button.accept")}
              </Button>
              <Button onClick={() => onClose()} color={"yellow"}>
                {t("button.cancel")}
              </Button>
            </Group>
          </Alert>
        </Group>
      </Stack>
    </Modal>
  );
};

export default DeleteConfirmation;
