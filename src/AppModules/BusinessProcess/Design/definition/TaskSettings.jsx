import React from "react";
import { Button, Group, Modal, Stack, TransferList } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { useContext } from "react";
import { DesignerStateContext } from "../Context";
import { useEffect } from "react";

const TaskSettings = ({ open, close, taskId }) => {
  const { t } = useTranslation();
  const { selectedStageId, selectedActionId, businessProcess, rolesByTask, roles } =
    useContext(DesignerStateContext);
  const [task, setTask] = useState(null);
  const [data, setData] = useState([[], []]);

  const form = useForm({
    initialValues: {
      // description: "",
      // code: "",
    },

    validate: {
      // description: (val) => (val ? null : t("validation.required")),
      // code: (val) => (val ? null : t("validation.required")),
    },
  });

  const getData = async () => {
    if (businessProcess) {
      const stages = businessProcess.stages;
      const stage = stages.find((s) => s.id === selectedStageId);
      if (stage) {
        const action = stage.statusses.find((a) => a.id === selectedActionId);
        if (action) {
          const task = action.tasks.find((t) => t.id === taskId);
          if (task) {
            setTask(task);
          }
        }
      }

      const rolesIdByTask = rolesByTask.get(taskId);

      const assignedRoles = [];
      const unassignedRoles = [];

      roles.forEach((r) => {
        const reg = { value: `${r.role.id}`, label: `${r.role.name} (${r.role.groupName})` };

        if (rolesIdByTask) {
          if (rolesIdByTask.includes(r.role.id.toString())) {
            assignedRoles.push(reg);
          } else {
            unassignedRoles.push(reg);
          }
        } else {
          unassignedRoles.push(reg);
        }
      });

      const values = [unassignedRoles, assignedRoles];

      setData(values);
    }
  };

  useEffect(() => {
    if (taskId && open) {
      getData();
    }
  }, [open]);

  // const createTextField = (field, disabled = false) => {
  //   const ret = (
  //     <TextInput
  //       disabled={disabled}
  //       label={t("businessProcess.label." + field)}
  //       placeholder={t("businessProcess.placeholder." + field)}
  //       {...form.getInputProps(field)}
  //     />
  //   );

  //   return ret;
  // };



  const updateTask = (data) => {
    if (data[1].length > 0) {
      const roles = data[1].map((r) => r.value);
      rolesByTask.set(taskId, roles);
    }
    close();
    setData([[], []]);
  };

  return (
    <Modal
      size={"lg"}
      opened={open}
      onClose={() => {
        close();
        setData([[], []]);
      }}
      title={task?.name}
      centered
    >
      <Stack w={"100%"} spacing={"xs"}>
        <form
          onSubmit={form.onSubmit((values) => {
            updateTask(data);
          })}
        >
          {/* <Group mt={"xs"} grow>
            {createTextField("description")}
          </Group>
          <Group mt={"xs"}>{createTextField("code")}</Group> */}

          <Group mt={"xs"} grow>
            <TransferList
              value={data}
              onChange={setData}
              searchPlaceholder={t("businessProcess.label.searchRol")}
              nothingFound={t("businessProcess.label.noDataSelected")}
              titles={[t("businessProcess.label.rolesList"), t("businessProcess.label.assignedRoles")]}
              breakpoint="sm"
            />
          </Group>
          <Group position="right" mt={"xl"}>
            <Button type="submit">{t("button.accept")}</Button>
            <Button
              onClick={() => {
                close();
                setData([[], []]);
              }}
            >
              {t("button.cancel")}
            </Button>
          </Group>
        </form>
      </Stack>
    </Modal>
  );
};

export default TaskSettings;
