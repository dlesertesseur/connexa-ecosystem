import React from "react";
import { Button, Checkbox, Group, Modal, Stack, Text, TextInput, TransferList } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { useContext } from "react";
import { DesignerStateContext } from "../Context";
import { useEffect } from "react";
import uuid from "react-uuid";

const TaskSettings = ({ open, close }) => {
  const { t } = useTranslation();
  const { selectedStageId, selectedActionId, selectedTaskId, project } = useContext(DesignerStateContext);
  const [task, setTask] = useState(null);
  const [data, setData] = useState([[], []]);

  const form = useForm({
    initialValues: {
      description: "",
      name: "",
    },

    validate: {
      description: (val) => (val ? null : t("validation.required")),
      name: (val) => (val ? null : t("validation.required")),
    },
  });

  const getData = async () => {
    const stage = project.stages.find((s) => s.id === selectedStageId);
    if (stage) {
      const action = stage.actions.find((a) => a.id === selectedActionId);
      if (action) {
        const task = action.tasks.find((t) => t.id === selectedTaskId);
        if (task) {
          setTask(task);
        }
      }
    }

    const stages = project.stages;
    const tasks = [];
    stages.forEach((s) => {
      const actions = s.actions;
      actions.forEach((a) => {
        const tasks = a.tasks;
        tasks.forEach((t) => {
          console.log("tasks -> ", tasks)
          const ret = {
            key: t.id ? t.id : uuid(),
            id:t.id,
            label: t.name,
            description:t.description
          };
          tasks.push(ret);
        });
      });
    });
    // setData([tasks, []]);

    // console.log("tasks -> ", tasks)
  };

  useEffect(() => {
    if (selectedTaskId) {
      getData();
    }
  }, [selectedTaskId]);

  const createTextField = (field, disabled = false) => {
    const ret = (
      <TextInput
        disabled={disabled}
        label={t("businessProcess.label." + field)}
        placeholder={t("businessProcess.placeholder." + field)}
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  const itemTask = (item) => {

    console.log("itemTask item.data ->", item.data);
    const data = item.data;
    const selected = item.selected;

    const ret = (
      <Group noWrap
        key={data.key}>
        <div style={{ flex: 1 }}>
          <Text size="sm" weight={500}>
            {data.label}
          </Text>
          <Text size="xs" color="dimmed" weight={400}>
            {data.description}
          </Text>
        </div>
        <Checkbox checked={selected} onChange={() => {}} tabIndex={-1} sx={{ pointerEvents: "none" }} />
      </Group>
    );
    return ret;
  };

  return (
    <Modal size={"xl"} opened={open} onClose={close} title={task?.name} centered>
      <Stack w={"100%"} spacing={"xs"}>
        <form
          onSubmit={form.onSubmit((values) => {
            onCreate(values);
          })}
        >
          <Group mt={"xs"} grow>
            {createTextField("description")}
          </Group>
          <Group mt={"xs"}>{createTextField("code")}</Group>
          {/* <Group mt={"xs"} grow>
            <TransferList
              value={data}
              onChange={setData}
              searchPlaceholder={t("businessProcess.label.searchTask")}
              nothingFound={t("businessProcess.label.noDataSelected")}
              titles={[t("businessProcess.label.taskList"), t("businessProcess.label.transferTask")]}
              listHeight={200}
              breakpoint="sm"
              itemComponent={itemTask}
              filter={(query, item) =>
                item.label.toLowerCase().includes(query.toLowerCase().trim()) ||
                item.description.toLowerCase().includes(query.toLowerCase().trim())
              }
            />
          </Group> */}

          <Group position="right" mt={"xl"}>
            <Button type="submit">{t("button.accept")}</Button>
            <Button onClick={close}>{t("button.cancel")}</Button>
          </Group>
        </form>
      </Stack>
    </Modal>
  );
};

export default TaskSettings;
