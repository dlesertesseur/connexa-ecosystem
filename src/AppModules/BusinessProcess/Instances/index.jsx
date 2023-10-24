import React, { useState } from "react";
import ResponceNotification from "../../../Modal/ResponceNotification";
import AppHeader from "../../../Components/AppHeader";
import TabLabel from "./TabLabel";
import { useTranslation } from "react-i18next";
import { AbmStateContext } from "./Context";
import { LoadingOverlay, Tabs } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import BusinessProcessInstancePanel from "./BusinessProcessInstancePanel";
import BusinessProcessModelDialog from "../Diagram/editor/BusinessProcessModelDialog";

const DynamicApp = ({ app }) => {
  const { t } = useTranslation();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tabName, setTabName] = useState("executing");
  const [instanceId, setInstanceId] = useState(null);

  const navigate = useNavigate();

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

  const ret = (
    <AbmStateContext.Provider
      value={{
        setError,
        loading,
        setInstanceId
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
