import { Modal, Group, Button, useMantineTheme, Stack, Alert } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconAlertCircle } from "@tabler/icons";

const ResponceNotification = ({ opened, onClose, title, text, code }) => {
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
            icon={<IconAlertCircle size={16} />}
            title={title}
            color={code ? "red" : "green"}
            radius={"sm"}
          >
            {text}
            <Group position="right" >
              <Button onClick={() => onClose()} color={code ? "red" : "green"} m={5}>
                {t("button.accept")}
              </Button>
            </Group>
          </Alert>
        </Group>
      </Stack>
    </Modal>
  );
};

export default ResponceNotification;
