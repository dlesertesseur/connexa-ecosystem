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
import BusinessProcessDiagramInstacePanel from "./BusinessProcessModelInstancePanel";
import { useEffect } from "react";
import BusinessProcessInstanceLogDialog from "./BusinessProcessInstanceLogPanel";
import BusinessProcessInstanceLogPanel from "./BusinessProcessInstanceLogPanel";

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

  const onViewSprints = (rowSelected) => {
    navigate("sprints");
  };

  const onViewLog = async (rowSelected) => {
    // try {
    //   let params = { token: user.token, id: rowSelected };
    //   const logs = await findAllBusinessProcessInstancesLog(params);

    //   const userById = new Map();
    //   const userIds = [...new Set(logs.map((obj) => obj.userId))];
    //   for (let index = 0; index < userIds.length; index++) {
    //     const id = userIds[index];
    //     if (id) {
    //       try {
    //         const userData = await findUserById({ token: user.token, id: id });
    //         if (userData) {
    //           userById.set(id, userData);
    //         }
    //       } catch (error) {
    //         console.log("onViewLog error -> ", error);
    //       }
    //     }
    //   }

    //   const data = logs.map((l) => {
    //     const u = userById.get(l.userId);
    //     const ret = {
    //       text: l.message.replace(/\([^)]*\)/g, ""),
    //       date: convertMilisegToYYYYMMDDHHMISS(new Date(l.dateAndTime)),
    //       user: u !== undefined ? `${u.firstname}, ${u.lastname}` : l.source,
    //       photo: u !== undefined ? `${API.productImages.baseUrl}${u.image}` : null,
    //     };
    //     return ret;
    //   });

    //   setLogs(data);
    // } catch (error) {
    //   setLoading(false);
    //   setError(error.message);
    // }
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
              businessProcessInstance={instances?.find((i) => i.id === rowSelected)}
              onBack={() => {
                navigate(-1);
              }}
            />
          }
        />
        <Route
          path="form"
          element={
            <Group>
              <Text>{"FORM"}</Text>
            </Group>
          }
        />
        <Route
          path="log"
          element={
            <BusinessProcessInstanceLogPanel
              businessProcessInstance={instances?.find((i) => i.id === rowSelected)}
              onBack={() => {
                navigate(-1);
              }}
            />
          }
        />
        <Route
          path="sprints"
          element={
            <Group>
              <Text>{"SPTRINTS"}</Text>
            </Group>
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
