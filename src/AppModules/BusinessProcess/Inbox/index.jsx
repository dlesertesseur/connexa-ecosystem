import React, { useEffect, useState } from "react";
import ResponceNotification from "../../../Modal/ResponceNotification";
import AppHeader from "../../../Components/AppHeader";
import TabLabel from "./tabs/TabLabel";
import BusinessProcessModelPanel from "./tabs/BusinessProcessModelPanel";
import TaskPanel from "./tabs/TaskPanel";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { AbmStateContext } from "./Context";
import { Tabs } from "@mantine/core";
import {
  createBusinessProcessModelInstance,
  findAllBusinessProcessModelByRole,
  findAllTaskByRoleId,
} from "../../../DataAccess/BusinessProcessModelInbox";
import { getRoleBySiteIdAndUserId } from "../../../DataAccess/User";

const DynamicApp = ({ app }) => {
  const { user, siteSelected } = useSelector((state) => state.auth.value);

  const { t } = useTranslation();
  const [error, setError] = useState(null);
  const [creationStatus, setCreationStatut] = useState(null);
  const [reload, setReload] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processModelList, setProcessModelList] = useState(null);
  const [tasksList, setTasksList] = useState(null);

  const getData = async () => {
    let process = [];
    let tasks = [];
    let params = {
      token: user.token,
      userId: user.id,
      siteId: siteSelected.id,
    };

    setLoading(true);
    try {
      const roles = await getRoleBySiteIdAndUserId(params);

      if (roles) {
        roles.forEach(async (role) => {
          const params = {
            token: user.token,
            userId: user.id,
            roleId: role.id,
          };

          const roleList = await findAllBusinessProcessModelByRole(params);
          if (roleList.length) {
            process = process.concat(roleList);
            setProcessModelList(process);
          }

          const taskList = await findAllTaskByRoleId(params);
          if (taskList.length) {
            tasks = tasks.concat(taskList);
            setTasksList(tasks);
          }
        });
      }
    } catch (error) {
      setError(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, [user, reload]);

  const createProcessModelInstance = async (values) => {
    const params = {
      token: user.token,
      userId: user.id,
      name: values.name,
      description: values.description,
      businessProcessModelId: values.businessProcessModelId,
    };
    try {
      setLoading(true);
      const ret = await createBusinessProcessModelInstance(params);
      console.log("ret", ret);

      if (ret.error) {
        setError(error);
      } else {
        console.log("createBusinessProcessModelInstance -> ret", ret);

        if (ret && ret.id) {
          setCreationStatut(t("businessProcessModelInbox.messages.creation"));
        }
      }
    } catch (error) {
      setError(error);
    }
    setLoading(false);
  };

  const ret = (
    <AbmStateContext.Provider
      value={{
        reload,
        setReload,
        setError,
        processModelList,
        tasksList,
        loading,
        createProcessModelInstance,
      }}
    >
      <AppHeader app={app} />

      <Tabs defaultValue="businessProcessModelTab" variant="outline" mt={"xs"}>
        <Tabs.List>
          <TabLabel
            name={"businessProcessModelTab"}
            label={t("businessProcessModelInbox.tabs.businessProcessModels")}
            rows={processModelList?.length}
          />
          <TabLabel name={"tasksTab"} label={t("businessProcessModelInbox.tabs.tasks")} rows={tasksList?.length} />
        </Tabs.List>

        <BusinessProcessModelPanel name={"businessProcessModelTab"} />
        <TaskPanel name={"tasksTab"} />
      </Tabs>

      <ResponceNotification
        opened={error ? true : false}
        onClose={() => {
          setError(null);
        }}
        code={error}
        title={t("status.error")}
        text={error}
      />

      <ResponceNotification
        opened={creationStatus ? true : false}
        onClose={() => {
          setCreationStatut(null);
        }}
        title={t("status.ok")}
        text={creationStatus}
      />
    </AbmStateContext.Provider>
  );

  return ret;
};

export default DynamicApp;
