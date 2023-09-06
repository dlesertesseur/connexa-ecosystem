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

const TaskPanel = ({name}) => {
  const { t } = useTranslation();
  const [rowSelected, setRowSelected] = useState(null);
  const [task, setTask] = useState(null);
  // const [openCreateProcessInstance, setOpenCreateProcessInstance] = useState(false);

  const { tasksList, loading } = useContext(AbmStateContext);

  let col = 0;
  const cols = t("businessProcessModelInbox.columns.tasks", { returnObjects: true });
  const columns = [
    { headerName: cols[col++], fieldName: "name", align: "left" },
    { headerName: cols[col++], fieldName: "role", align: "left" },
    { headerName: cols[col++], fieldName: "user", align: "left" },
    { headerName: cols[col++], fieldName: "status", align: "left" },
  ];

  useEffect(() => {
    if (tasksList) {
      const task = tasksList.find((mp) => mp.id === rowSelected);
      setTask(task);
    }
  }, [rowSelected]);

  // const create = (values) => {
  //   setOpenCreateProcessInstance(false);
  //   createProcessModelInstance({...values, businessProcessModelId: processModel.id});
  // }

  return (
    <>
      {/* <CreateProcessInstanceDialog
        open={openCreateProcessInstance}
        close={() => {
          setOpenCreateProcessInstance(false);
        }}
        processModel={processModel}
        onCreate={create} 
      /> */}
      <Tabs.Panel value={name} pt="xs">
        <Routes>
          <Route
            path="/"
            element={
              <Stack spacing={"xs"}>
                <TasksToolbar
                  task={task}
                  onCreate={() => {
                    // setOpenCreateProcessInstance(true);
                  }}
                />
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
          {/* <Route path="/create/*" element={<Title>{"create"}</Title>} /> */}
        </Routes>
      </Tabs.Panel>
    </>
  );
};

export default TaskPanel;
