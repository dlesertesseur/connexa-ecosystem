import React, { useEffect, useState } from "react";
import ResponceNotification from "../../../../Modal/ResponceNotification";
import SortedTable from "../../../../Components/Crud/SortedTable";
import BusinessProcessHeader from "../BusinessProcessHeader";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { ConnectTaskPage } from "./ConnectTaskPage";
import { AbmConnectionStateContext, AbmParametersStateContext, AbmStateContext } from "../Context";
import { findBusinessProcessById } from "../../../../DataAccess/BusinessProcess";
import { Route, Routes, useNavigate } from "react-router-dom";
import { HEADER_HIGHT } from "../../../../Constants";
import { Stack } from "@mantine/core";
import { useContext } from "react";

const Connections = () => {
  const { user } = useSelector((state) => state.auth.value);
  const { selectedRowId } = useContext(AbmStateContext);
  const { t } = useTranslation();
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedConnectionId, setSelectedConnectionId] = useState(null);
  const [reloadConnections, setReloadConnections] = useState(null);
  const [businessProcess, setBusinessProcess] = useState(null);
  const navigate = useNavigate();

  const HEADER = 32;

  const getData = async () => {
    setLoading(true);
    const params = { token: user.token, id: selectedRowId };
    const ret = await findBusinessProcessById(params);
    setBusinessProcess(ret);

    let tasks = [];
    ret.stages.forEach((stage) => {
      if (stage.statusses) {
        stage.statusses.forEach((status) => {
          const data = status.tasks.map((t) => {
            return {
              id: t.id,
              stageId: stage.id,
              stageName: stage.name,
              statusId: status.id,
              statusName: status.name,
              taskName: t.name,
            };
          });
          tasks = tasks.concat(data);
        });
      }
    });

    setRows(tasks);

    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, [selectedRowId, reloadConnections]);

  let col = 0;
  const cols = t("businessProcess.connections.columns", { returnObjects: true });
  const columns = [
    { headerName: cols[col++], fieldName: "stageName", align: "left" },
    { headerName: cols[col++], fieldName: "statusName", align: "left" },
    { headerName: cols[col++], fieldName: "taskName", align: "left" },
  ];

  const ret = rows ? (
    <AbmConnectionStateContext.Provider
      value={{
        selectedConnectionId,
        setSelectedConnectionId,
        reloadConnections,
        setReloadConnections,
      }}
    >
      <Stack spacing={"xs"}>
        <Stack
          justify="flex-start"
          sx={(theme) => ({
            backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
          })}
        >
          <BusinessProcessHeader text={t("businessProcess.label.connections")} businessProcess={businessProcess} />

          <Routes>
            <Route
              path="/"
              element={
                <SortedTable
                  data={rows}
                  columns={columns}
                  loading={loading}
                  enableCreateButton={true}
                  rowSelected={selectedConnectionId}
                  setRowSelected={setSelectedConnectionId}
                  headerHeight={HEADER_HIGHT + HEADER + 32}
                  createButton={false}
                  deleteButton={false}
                  backButton={() => {
                    navigate("../");
                  }}
                />
              }
            ></Route>
            <Route
              path="update"
              element={
                <ConnectTaskPage businessProcessId={businessProcess?.id} tasks={rows} taskId={selectedConnectionId} />
              }
            />
          </Routes>
        </Stack>
      </Stack>

      <ResponceNotification
        opened={error ? true : false}
        onClose={() => {
          setError(null);
        }}
        code={error}
        title={t("status.error")}
        text={error}
      />
    </AbmConnectionStateContext.Provider>
  ) : null;

  return ret;
};

export default Connections;
