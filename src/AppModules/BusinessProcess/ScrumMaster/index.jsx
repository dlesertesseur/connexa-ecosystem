import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { AbmStateContext } from "./Context";
import { LoadingOverlay } from "@mantine/core";
import { useSelector } from "react-redux";
import { findAllBusinessProcessInstances } from "../../../DataAccess/BusinessProcessInstance";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import ResponceNotification from "../../../Modal/ResponceNotification";
import AppHeader from "../../../Components/AppHeader";
import BusinessProcessInstancePanel from "./BusinessProcessInstancePanel";
import BusinessProcessDiagramInstacePanel from "./BusinessProcessModelInstancePanel";
import BusinessProcessInstanceLogPanel from "./BusinessProcessInstanceLogPanel";
import BusinessProcessIntanceSprintsPanel from "./BusinessProcessIntanceSprintsPanel";
import BusinessProcessInstanceGanttPanel from "./BusinessProcessInstanceGanttPanel";

const DynamicApp = ({ app }) => {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [instanceId, setInstanceId] = useState(null);
  const [instances, setInstances] = useState(null);
  const [rowSelected, setRowSelected] = useState(null);

  const navigate = useNavigate();

  const getData = async () => {
    let params = {
      token: user.token,
      status: "Executing",
    };

    try {
      const instances = await findAllBusinessProcessInstances(params);
      setInstances(instances);
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const onViewDocument = async (rowSelected) => {
    navigate("form");
  };

  const onViewDiagram = (rowSelected) => {
    setInstanceId(rowSelected);
    navigate("diagram");
  };

  const onViewSprints = () => {
    navigate("sprints");
  };

  const onViewLog = async () => {
    navigate("log");
  };

  const onViewGantt = async () => {
    navigate("gantt");
  };

  const ret = (
    <AbmStateContext.Provider
      value={{
        setError,
        onViewDocument,
        onViewDiagram,
        onViewLog,
        onViewSprints,
        onViewGantt,
        setRowSelected,
        rowSelected,
        instances,
      }}
    >
      <AppHeader app={app} />

      <LoadingOverlay visible={loading} zIndex={1000} />

      <Routes>
        <Route path="/" element={<BusinessProcessInstancePanel />}></Route>
        <Route
          path="diagram"
          element={
            <BusinessProcessDiagramInstacePanel
              businessProcessInstanceId={rowSelected}
              businessProcessInstanceName={instances?.find((i) => i.id === rowSelected)?.name}
              onBack={() => {
                navigate(-1);
              }}
            />
          }
        />
        {/* <Route
          path="form"
          element={
            <BusinessProcessInstanceFormPanel
              businessProcessInstanceId={rowSelected}
              businessProcessInstanceName={instances?.find((i) => i.id === rowSelected)?.name}
              onBack={() => {
                navigate(-1);
              }}
            />
          }
        /> */}
        <Route
          path="log"
          element={
            <BusinessProcessInstanceLogPanel
              businessProcessInstanceId={rowSelected}
              businessProcessInstanceName={instances?.find((i) => i.id === rowSelected)?.name}
              onBack={() => {
                navigate(-1);
              }}
            />
          }
        />
        <Route
          path="sprints"
          element={
            <BusinessProcessIntanceSprintsPanel
              businessProcessInstanceId={rowSelected}
              businessProcessInstanceName={instances?.find((i) => i.id === rowSelected)?.name}
              onBack={() => {
                navigate(-1);
              }}
            />
          }
        />
        <Route
          path="gantt"
          element={
            <BusinessProcessInstanceGanttPanel
              businessProcessInstanceId={rowSelected}
              businessProcessInstanceName={instances?.find((i) => i.id === rowSelected)?.name}
              onBack={() => {
                navigate(-1);
              }}
            />
          }
        />
      </Routes>

      <ResponceNotification
        opened={error ? true : false}
        onClose={() => {
          setError(null);
        }}
        code={error}
        title={t("status.error")}
        text={error}
      />
    </AbmStateContext.Provider>
  );

  return ret;
};

export default DynamicApp;
