import React, { useState } from "react";
import ResponceNotification from "../../../Modal/ResponceNotification";
import AppHeader from "../../../Components/AppHeader";
import TabLabel from "./TabLabel";
import BusinessProcessInstancePanel from "./BusinessProcessInstancePanel";
import BusinessProcessModelDialog from "../Diagram/editor/BusinessProcessModelDialog";
import FormDialog from "./doc/FormDialog";
import BusinessProcessInstanceLogDialog from "./BusinessProcessInstanceLogDialog";
import { useTranslation } from "react-i18next";
import { AbmStateContext } from "./Context";
import { LoadingOverlay, Tabs } from "@mantine/core";
import { findAllBusinessProcessInstanceRelationsById } from "../../../DataAccess/BusinessProcessInstanceRelations";
import { findFormInstanceById } from "../../../DataAccess/FormInstance";
import { useSelector } from "react-redux";
import { findAllBusinessProcessInstancesLog } from "../../../DataAccess/BusinessProcessInstance";
import { findUserById } from "../../../DataAccess/User";
import { convertMilisegToYYYYMMDDHHMISS } from "../../../Util";
import { API } from "../../../Constants";

const DynamicApp = ({ app }) => {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tabName, setTabName] = useState("executing");
  const [instanceId, setInstanceId] = useState(null);
  const [formId, setFormId] = useState(null);
  const [parentId, setParentId] = useState(null);
  const [logs, setLogs] = useState(null);
  const [showDoc, setShowDoc] = useState(false);
  const [showDiagram, setShowDiagram] = useState(false);

  const tabs = () => {
    return (
      <Tabs
        defaultValue={tabName}
        variant="outline"
        mt={"xs"}
        onTabChange={(e) => {
          setTabName(e);
        }}
      >
        <Tabs.List>
          <TabLabel name={"executing"} label={t("businessProcessInstances.tabs.executing")} />
          <TabLabel name={"finished"} label={t("businessProcessInstances.tabs.finished")} />
          <TabLabel name={"cancelled"} label={t("businessProcessInstances.tabs.cancelled")} />
        </Tabs.List>

        <BusinessProcessInstancePanel name={"executing"} status={"Executing"} />
        <BusinessProcessInstancePanel name={"finished"} status={"Finished"} />
        <BusinessProcessInstancePanel name={"cancelled"} status={"Cancelled"} />
      </Tabs>
    );
  };

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
    setShowDoc(true);
    setInstanceId(rowSelected);
  };

  const onViewDiagram = (rowSelected) => {
    setShowDiagram(true);
    setInstanceId(rowSelected);
  };

  const onViewLog = async (rowSelected) => {
    try {
      let params = { token: user.token, id: rowSelected };
      const logs = await findAllBusinessProcessInstancesLog(params);

      const userById = new Map();
      const userIds = [...new Set(logs.map((obj) => obj.userId))];
      for (let index = 0; index < userIds.length; index++) {
        const id = userIds[index];
        if (id) {
          try {
            const userData = await findUserById({ token: user.token, id: id });
            if (userData) {
              userById.set(id, userData);
            }
          } catch (error) {
            console.log("onViewLog error -> ", error);
          }
        }
      }

      const data = logs.map((l) => {
        const u = userById.get(l.userId);
        const ret = {
          text: l.message.replace(/\([^)]*\)/g, ""),
          date: convertMilisegToYYYYMMDDHHMISS(new Date(l.dateAndTime)),
          user: u !== undefined ? `${u.firstname}, ${u.lastname}` : l.source,
          photo: u !== undefined ? `${API.productImages.baseUrl}${u.image}` : null,
        };
        return ret;
      });

      setLogs(data);
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  const ret = (
    <AbmStateContext.Provider
      value={{
        setError,
        onViewDocument,
        onViewDiagram,
        onViewLog,
      }}
    >
      <AppHeader app={app} />

      <LoadingOverlay visible={loading} zIndex={1000} />

      {tabs()}

      <BusinessProcessModelDialog
        open={showDiagram}
        close={() => setShowDiagram(false)}
        businessProcessInstanceId={instanceId}/>

      <FormDialog 
        open={showDoc} 
        close={() => setShowDoc(false)} 
        businessProcessInstanceId={instanceId} />

      <BusinessProcessInstanceLogDialog open={logs} close={() => setLogs(null)} logs={logs} />

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
