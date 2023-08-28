import React from "react";
import { Button, Group, Modal, Stack, TextInput, TransferList } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { useContext } from "react";
import { DesignerStateContext } from "../Context";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { findAllByOrganizationId } from "../../../../DataAccess/OrganizationRole";

const TaskSettings = ({ open, close }) => {
  const { t } = useTranslation();
  const { user, organizationSelected } = useSelector((state) => state.auth.value);
  const { selectedStageId, selectedActionId, selectedTaskId, businessProcess } = useContext(DesignerStateContext);
  const [task, setTask] = useState(null);
  const [data, setData] = useState([[], []]);

  const form = useForm({
    initialValues: {
      description: "",
      code: "",
    },

    validate: {
      description: (val) => (val ? null : t("validation.required")),
      code: (val) => (val ? null : t("validation.required")),
    },
  });

  const getData = async () => {
    if (businessProcess) {
      const stages = businessProcess.stages;

      const stage = stages.find((s) => s.id === selectedStageId);
      if (stage) {
        const action = stage.statusses.find((a) => a.id === selectedActionId);
        if (action) {
          const task = action.tasks.find((t) => t.id === selectedTaskId);
          if (task) {
            setTask(task);
          }
        }
      }

      const params = { token: user.token, id: organizationSelected.id };
      const roles = await findAllByOrganizationId(params);

      const unassignedRoles = roles.map((r) => {
        const ret = { value: `${r.role.id}`, label: `${r.role.name} (${r.role.groupName})`};
        return ret;
      });
      const assignedRoles = [];

      const values = [unassignedRoles, assignedRoles];

      setData(values);
    }
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

  return (
    <Modal size={"lg"} opened={open} onClose={close} title={task?.name} centered>
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
            <Button onClick={close}>{t("button.cancel")}</Button>
          </Group>
        </form>
      </Stack>
    </Modal>
  );
};

export default TaskSettings;
