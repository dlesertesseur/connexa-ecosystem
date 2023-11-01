import React, { useState } from "react";
import ResponceNotification from "../../../Modal/ResponceNotification";
import AppHeader from "../../../Components/AppHeader";
import BusinessProcessInstancePanel from "./BusinessProcessInstancePanel";
import { useTranslation } from "react-i18next";
import { AbmStateContext } from "./Context";
import { Group, LoadingOverlay, Text } from "@mantine/core";
import { findAllBusinessProcessInstanceRelationsById } from "../../../DataAccess/BusinessProcessInstanceRelations";
import { findFormInstanceById } from "../../../DataAccess/FormInstance";
import { useSelector } from "react-redux";
import { findUserById } from "../../../DataAccess/User";
import { convertMilisegToYYYYMMDDHHMISS } from "../../../Util";
import { API } from "../../../Constants";
import { findAllBusinessProcessInstances } from "../../../DataAccess/BusinessProcessInstance";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import BusinessProcessDiagramInstacePanel from "./BusinessProcessModelInstancePanel";
import BusinessProcessInstanceLogPanel from "./BusinessProcessInstanceLogPanel";
import BusinessProcessIntanceSprintsPanel from "./BusinessProcessIntanceSprintsPanel";
import BusinessProcessInstanceFormPanel from "./BusinessProcessInstanceFormPanel";

const DynamicApp = ({ app }) => {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [instanceId, setInstanceId] = useState(null);
  const [formId, setFormId] = useState(null);
  const [parentId, setParentId] = useState(null);
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
    // setLoading(true);

    // try {
    //   let params = { token: user.token, id: rowSelected };
    //   const relation = await findAllBusinessProcessInstanceRelationsById(params);

    //   if (relation && relation.length > 0) {
    //     const id = relation[0].formInstanceId;
    //     params = { token: user.token, id: id };
    //     const instanceNode = await findFormInstanceById(params);

    //     if (instanceNode.error) {
    //       throw new Error(instanceNode.error);
    //     } else {
    //       setFormId(instanceNode.options);
    //       setParentId(instanceNode.id);
    //     }
    //   } else {
    //     throw new Error(t("status.error"));
    //   }
    // } catch (error) {
    //   setLoading(false);
    //   setError(error.message);
    //   setFormId(null);
    //   setParentId(null);
    // }
    // setLoading(false);

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

  const ret = (
    <AbmStateContext.Provider
      value={{
        setError,
        onViewDocument,
        onViewDiagram,
        onViewLog,
        onViewSprints,
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
        <Route
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
        />
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
