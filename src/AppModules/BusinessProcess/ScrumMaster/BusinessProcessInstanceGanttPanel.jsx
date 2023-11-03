import "gantt-task-react/dist/index.css";
import React from "react";
import HeaderPanel from "./HeaderPanel";
import { LoadingOverlay, Stack } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useWindowSize } from "../../../Hook";
import { useState } from "react";
import { useEffect } from "react";
import { findUserById } from "../../../DataAccess/User";
import { useContext } from "react";
import { AbmStateContext } from "./Context";
import { useSelector } from "react-redux";
import { API } from "../../../Constants";
import { Gantt, ViewMode } from "gantt-task-react";
import { findAllByOrganizationId } from "../../../DataAccess/OrganizationRole";
import { findBusinessProcessInstanceById } from "../../../DataAccess/BusinessProcessModel";

const BusinessProcessInstanceGanttPanel = ({ businessProcessInstanceId, businessProcessInstanceName, onBack }) => {
  const wsize = useWindowSize();
  const headerHeight = 250;
  const { user } = useSelector((state) => state.auth.value);
  const { t } = useTranslation();

  const [tasks, setTasks] = useState(null);
  const [loading, setLoading] = useState(false);
  const [businessProcessInstance, setBusinessProcessInstance] = useState([]);

  const { rowSelected, setError } = useContext(AbmStateContext);

  const getData = async () => {
    setLoading(true);
    try {
      const params = { token: user.token, id: businessProcessInstanceId };
      const ret = await findBusinessProcessInstanceById(params);
      if (ret.error) {
        console.log(ret.error);
      } else {
        const tasks = ret.tasks.map((t) => {
          const task = {
            start: new Date(2020, 1, 1),
            end: new Date(2020, 1, 2),
            name: t.label,
            id: t.id,
            type: "task",
            progress: t.status === "Finished" ? 100 : 0,
            isDisabled: true,
            styles: { progressColor: "#ffbb54", progressSelectedColor: "#ff9e0d" },
          };
          return task;
        });

        setTasks(tasks);
        setBusinessProcessInstance(ret);
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  useEffect(() => {
    if (businessProcessInstanceId) {
      getData();
    }
  }, [businessProcessInstanceId]);

  return (
    <Stack spacing={"xs"}>
      <HeaderPanel
        businessProcessInstanceName={businessProcessInstanceName}
        onBack={onBack}
        title={t("businessProcessInstances.title.viewGantt")}
      />
      <Stack sx={{ height: wsize.height - headerHeight }}>
        <LoadingOverlay visible={loading} zIndex={1000} />
        {tasks ? (
          <Gantt
            tasks={tasks}
            viewMode={ViewMode.Month}
            locale="es"
            listCellWidth={""}
            columnWidth={(wsize.width - 300) / 12}
          />
        ) : null}
      </Stack>
    </Stack>
  );
};

export default BusinessProcessInstanceGanttPanel;
