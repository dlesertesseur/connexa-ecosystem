import React, { useState } from "react";
import ResponceNotification from "../../../Modal/ResponceNotification";
import AppHeader from "../../../Components/AppHeader";
import TabLabel from "./TabLabel";
import { useTranslation } from "react-i18next";
import { AbmStateContext } from "./Context";
import { LoadingOverlay, Tabs } from "@mantine/core";
import { findAllBusinessProcessInstanceRelationsById } from "../../../DataAccess/BusinessProcessInstanceRelations";
import { findFormInstanceById } from "../../../DataAccess/FormInstance";
import { useSelector } from "react-redux";
import { findAllBusinessProcessInstancesLog } from "../../../DataAccess/BusinessProcessInstance";
import BusinessProcessInstancePanel from "./BusinessProcessInstancePanel";
import BusinessProcessModelDialog from "../Diagram/editor/BusinessProcessModelDialog";
import FormDialog from "./form/FormDialog";
import BusinessProcessInstanceLogDialog from "./BusinessProcessInstanceLogDialog";

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

    try {
      let params = { token: user.token, id: rowSelected };
      const relation = await findAllBusinessProcessInstanceRelationsById(params);

      if (relation && relation.length > 0) {
        const id = relation[0].formInstanceId;
        params = { token: user.token, id: id };
        const instanceNode = await findFormInstanceById(params);

        if (instanceNode.error) {
          throw new Error(instanceNode.error);
        } else {
          setFormId(instanceNode.options);
          setParentId(instanceNode.id);
        }
      } else {
        throw new Error(t("status.error"));
      }
    } catch (error) {
      setLoading(false);
      setError(error.message);
      setFormId(null);
      setParentId(null);
    }
    setLoading(false);
  };

  const onViewDiagram = (rowSelected) => {
    setInstanceId(rowSelected);
  };

  const onViewLog = async (rowSelected) => {
    try {
      let params = { token: user.token, id: rowSelected };
      const logs = await findAllBusinessProcessInstancesLog(params);
      setLogs(logs);
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
        open={instanceId}
        close={() => setInstanceId(null)}
        businessProcessInstanceId={instanceId}
      />

      <FormDialog
        open={formId && parentId}
        close={() => {
          setFormId(null);
          setParentId(null);
        }}
        formId={formId}
        parentId={parentId}
      />

      <BusinessProcessInstanceLogDialog
        open={logs}
        close={() => setLogs(null)}
        logs={logs}
      />

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
