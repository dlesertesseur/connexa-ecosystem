import React from "react";
import { Avatar, Modal, ScrollArea, Stack, Text, Timeline } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconCheck } from "@tabler/icons-react";
import { useWindowSize } from "../../../Hook";

const BusinessProcessInstanceLogDialog = ({ open, close, logs }) => {
  const { t } = useTranslation();
  const wsize = useWindowSize();
  const headerHeight = 200;

  const getBullet = (data) => {
    let ret = null;
    if (data.photo !== null) {
      ret = (
        <Avatar
          size={32}
          radius="xl"
          src={data.photo}
        />
      );
    } else {
      ret = <IconCheck size={16} />;
    }

    return ret;
  };

  return (
    <Modal
      size={"lg"}
      opened={open}
      onClose={() => {
        close();
      }}
      title={t("businessProcessInstances.title.viewLog")}
      centered
    >
      <ScrollArea sx={{ height: wsize.height - headerHeight }}>
        <Stack spacing={"xs"} justify="flex-start">
          <Timeline bulletSize={32} lineWidth={2}>
            {logs?.map((l) => {
              const ret = (
                <Timeline.Item key={l.id} bullet={getBullet(l)} title={l.date}>
                  <Text size="sm">{l.text}</Text>
                  <Text c="dimmed" size="xs" mt={4}>
                    {l.user}
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
