import "gantt-task-react/dist/index.css";
import React from "react";
import HeaderPanel from "./HeaderPanel";
import { LoadingOverlay, ScrollArea, Stack } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useWindowSize } from "../../../Hook";
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { AbmStateContext } from "./Context";
import { useSelector } from "react-redux";
import { Gantt, ViewMode } from "gantt-task-react";
import { findBusinessProcessInstanceById } from "../../../DataAccess/BusinessProcessModel";

const BusinessProcessInstanceGanttPanel = ({ businessProcessInstanceId, businessProcessInstanceName, onBack }) => {
  const wsize = useWindowSize();
  const headerHeight = 220;
  const { user } = useSelector((state) => state.auth.value);
  const { t } = useTranslation();

  const [data, setData] = useState(null);
  const [sprints, setSprints] = useState(null);
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
        const taskBySprint = new Map();
        const sprintById = new Map();
        let totalTasks = [];
        let data = [];

        const sprints = ret.sprints.map((s) => {
          const tasks = ret.tasks.filter((t) => t.sprintId === s.id);
          taskBySprint.set(s.id, tasks);
          sprintById.set(s.id, s);

          const sprint = {
            start: new Date(s.startDate),
            end: new Date(s.endDate),
            name: s.name,
            id: s.id,
            type: "project",
            progress: s.status === "Finished" ? 100 : 65,
            isDisabled: true,
            styles: { progressColor: "#ffbb54", progressSelectedColor: "#ff9e0d" },
          };
          return sprint;
        });

        taskBySprint.forEach((value, key, map) => {
          let startDate = null;
          let endDate = null;

          const sprint = sprintById.get(key);

          startDate = new Date(sprint.startDate);

          const tasks = value.map((t) => {
            endDate = new Date(startDate.getMilliseconds() + (t.durarionInDays ? t.durarionInDays : 1) * 24 * 60 * 60 * 1000);

            const task = {
              start: startDate,
              end: endDate,
              name: t.label,
              id: t.id,
              type: "task",
              project: sprint.id,
              progress: t.status === "Finished" ? 100 : 0,
              isDisabled: true,
              styles: { progressColor: "#ffbb54", progressSelectedColor: "#ff9e0d" },
            };

            startDate = endDate;

            return task;
          });

          totalTasks = [...totalTasks , ...tasks]
        });

        // data = [...sprints, ...totalTasks];
        // setData(data);

        setData(sprints);
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
      <ScrollArea sx={{ width: wsize.width - 330, height: wsize.height - headerHeight }}>
        <LoadingOverlay visible={loading} zIndex={1000} />
        {data ? (
          <Gantt
            tasks={data}
            viewMode={ViewMode.Month}
            locale="es"
            listCellWidth={""}
            columnWidth={(wsize.width - 350) / 12}
          />
        ) : null}
      </ScrollArea>
    </Stack>
  );
};

export default BusinessProcessInstanceGanttPanel;
