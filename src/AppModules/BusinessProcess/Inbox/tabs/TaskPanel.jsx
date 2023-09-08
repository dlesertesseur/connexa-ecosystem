import React, { useEffect } from "react";
import { Stack, Tabs } from "@mantine/core";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { HEADER_HIGHT } from "../../../../Constants";
import { useContext } from "react";
import { AbmStateContext } from "../Context";
import SimpleTable from "../../../../Components/SimpleTable";
import TasksToolbar from "./TasksToolbar";
import TransferTaskDialog from "./TransferTaskDialog";

const TaskPanel = ({ name }) => {
  const { t } = useTranslation();
  const [rowSelected, setRowSelected] = useState(null);
  const [task, setTask] = useState(null);
  const { tasksList, onTransferTask, loading, outgoingTasks, setOutgoingTasks } = useContext(AbmStateContext);

  let col = 0;
  const cols = t("businessProcessModelInbox.columns.tasks", { returnObjects: true });
  const columns = [
    { headerName: cols[col++], fieldName: "name", align: "left" },
    { headerName: cols[col++], fieldName: "roleName", align: "left" },
    { headerName: cols[col++], fieldName: "userName", align: "left" },
    { headerName: cols[col++], fieldName: "status", align: "left" },
  ];

  useEffect(() => {
    if (tasksList) {
      const task = tasksList.find((mp) => mp.id === rowSelected);
      setTask(task);
    } else {
      setTask(null);
    }
  }, [rowSelected, tasksList]);

  return (
    <>
      <TransferTaskDialog
        open={outgoingTasks}
        close={() => {
          setOutgoingTasks(null);
        }}
        task={task}
        tasks={outgoingTasks}
        onAccept={onTransferTask}
      />
      <Tabs.Panel value={name} pt="xs">
        <Routes>
          <Route
            path="/"
            element={
              <Stack spacing={"xs"}>
                <TasksToolbar task={task} />
                <SimpleTable
                  data={tasksList}
                  columns={columns}
                  loading={loading}
                  rowSelected={rowSelected}
                  setRowSelected={setRowSelected}
                  headerHeight={HEADER_HIGHT + 64}
                />
              </Stack>
            }
          />
        </Routes>
      </Tabs.Panel>
    </>
  );
};

export default TaskPanel;
