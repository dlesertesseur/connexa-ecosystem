import React from "react";
import { Modal, ScrollArea, Stack, Text, Timeline } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconCheck, IconGitBranch, IconId, IconSubtask } from "@tabler/icons-react";
import { useWindowSize } from "../../../Hook";
import { Icon2fa } from "@tabler/icons-react";
import { convertMilisegToYYYYMMDDHHMISS, formatDateToDDMMYYYY } from "../../../Util";

const BusinessProcessInstanceLogDialog = ({ open, close, logs }) => {
  const { t } = useTranslation();
  const wsize = useWindowSize();
  const headerHeight = 200;

  return (
    <Modal
      size={"lg"}
      opened={open}
      onClose={() => {
        close();
      }}
      title={t("businessProcessInstances.title.viewDocument")}
      centered
    >
      <ScrollArea sx={{ height: wsize.height - headerHeight }}>
        <Stack spacing={"xs"} justify="flex-start">
          <Timeline bulletSize={24} lineWidth={2}>
            {logs?.map((l) => {
              const mensaje = l.message.replace(/\([^)]*\)/g, "");
              const date = convertMilisegToYYYYMMDDHHMISS(new Date(l.dateAndTime));
              const user = l.userName ? l.userName : "User name";

              const ret = (
                <Timeline.Item bullet={<IconCheck size={14} />} title={date}>
                  <Text size="sm">
                    {mensaje}
                  </Text>
                  <Text c="dimmed" size="xs" mt={4}>
                    {user}
                  </Text>
                </Timeline.Item>
              );
              return ret;
            })}
          </Timeline>
        </Stack>
      </ScrollArea>
    </Modal>
  );
};

export default BusinessProcessInstanceLogDialog;
