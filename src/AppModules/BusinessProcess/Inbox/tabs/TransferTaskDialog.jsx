import React, { useState } from "react";
import { Button, Group, Modal, Select, Stack } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

const TransferTaskDialog = ({ open, close, task, tasks, onAccept }) => {
  const [value, setValue] = useState(null);
  const { t } = useTranslation();

  const getData = async () => {
    if (tasks && tasks.length > 0) {
      setValue(tasks[0].id);
    }
  };

  useEffect(() => {
    if (task && open) {
      getData();
    }
  }, [open]);

  return (
    <Modal
      size={"md"}
      opened={open}
      onClose={() => {
        close();
      }}
      title={`${t("businessProcessModelInbox.title.transferTask")} | ${task?.name}`}
      centered
    >
      <Stack w={"100%"} spacing={"xs"}>
        {tasks ? (
          <Group grow>
            <Select
              label={t("businessProcessModelInbox.label.selectTask")}
              data={tasks?.map((t) => {
                return { value: t.id, label: t.name };
              })}
              value={value}
              onChange={setValue}
            />
          </Group>
        ) : null}

        <Group position="right" mt={"xl"}>
          <Button onClick={() => {onAccept(task, value)}}>{t("button.accept")}</Button>
          <Button
            onClick={() => {
              close();
            }}
          >
            {t("button.cancel")}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default TransferTaskDialog;
