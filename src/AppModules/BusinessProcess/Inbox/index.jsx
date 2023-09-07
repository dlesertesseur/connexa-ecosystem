import React, { useEffect, useState } from "react";
import ResponceNotification from "../../../Modal/ResponceNotification";
import AppHeader from "../../../Components/AppHeader";
import TabLabel from "./tabs/TabLabel";
import BusinessProcessModelPanel from "./tabs/BusinessProcessModelPanel";
import TaskPanel from "./tabs/TaskPanel";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { AbmStateContext } from "./Context";
import { LoadingOverlay, Tabs, Title } from "@mantine/core";
import {
  createBusinessProcessModelInstance,
  findAllBusinessProcessModelByRole,
  findAllTaskByRoleId,
  getAllOutgoingTaskByTaskId,
} from "../../../DataAccess/BusinessProcessModelInbox";
import { getRoleBySiteIdAndUserId } from "../../../DataAccess/User";
import { findAllByOrganizationId } from "../../../DataAccess/OrganizationRole";
import { Route, Routes, useNavigate } from "react-router-dom";

const DynamicApp = ({ app }) => {
  const { user, organizationSelected, siteSelected } = useSelector((state) => state.auth.value);

  const { t } = useTranslation();
  const [error, setError] = useState(null);
  const [creationStatus, setCreationStatut] = useState(null);
  const [reload, setReload] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processModelList, setProcessModelList] = useState(null);
  const [tasksList, setTasksList] = useState(null);
  const [tabName, setTabName] = useState("businessProcessModelTab");
  const [applicationTaksComponent, setApplicationTaskComponent] = useState(null);
  const [outgoingTasks, setOutgoingTasks] = useState(null);
  const navigate = useNavigate();

  function rolesToRoleById(roles) {
    const map = new Map();
    for (const role of roles) {
      if (role.hasOwnProperty("role")) {
        map.set(role.role.id, role.role);
      }
    }
    return map;
  }
  const getData = async () => {
    let process = [];
    let tasks = [];
    let rolesMap = null;
    let params = {
      token: user.token,
      userId: user.id,
      siteId: siteSelected.id,
      id: organizationSelected.id,
    };

    setLoading(true);
    try {
      const roles = await findAllByOrganizationId(params);
      rolesMap = rolesToRoleById(roles);

      const userRole = await getRoleBySiteIdAndUserId(params);

      if (userRole) {
        userRole.forEach(async (role) => {
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
            const ret = taskList.map((t) => {
              let userName = null;
              if (t.userId) {
                userName = user.firstName + ", " + user.lastName;
              }

              let roleName = null;
              const role = rolesMap.get(parseInt(t.requiredRole));
              if (role) {
                roleName = role.name;
              }

              //***************** EXTRA DATA *****************
              const applicationPath = "TaskApplication/DummyApp";
              const automatic = false;
              const serviceUrl = null;
              //***************** EXTRA DATA *****************

              return {
                ...t,
                roleName: roleName,
                userName: userName,
                applicationPath: applicationPath,
                automatic: automatic,
                serviceUrl: serviceUrl,
              };
            });
            tasks = tasks.concat(ret);
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

  const takeTask = (task) => {
    console.log("takeTask task ->", task);
  };

  const releaseTask = (task) => {
    console.log("releaseTask task ->", task);
  };

  const transferTask = async (origingTask, targetTask) => {
    const params = {
      token: user.token,
      originTaskId: origingTask.id,
      targetTaskId: targetTask.id,
    };

    const outgoing = await executeTask(params);
    console.log("transferTask outgoing ->", outgoing);
  };

  const getTransferOptions = async (task) => {
    const params = {
      token: user.token,
      taskId: task.id,
    };

    setLoading(true);
    const outgoing = await getAllOutgoingTaskByTaskId(params);
    setOutgoingTasks(outgoing);
    setLoading(false);
  };

  const viewTask = (task) => {
    console.log("viewTask task ->", task);
  };

  const tabs = () => {
    return (
      <>
        <LoadingOverlay visible={loading} />
        <Tabs
          defaultValue={tabName}
          variant="outline"
          mt={"xs"}
          onTabChange={(e) => {
            setTabName(e);
          }}
        >
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
      </>
    );
  };

  const processAppPath = (path) => {
    let ret = null;
    const arr = path.split("/");

    if (arr.length > 2) {
      ret = { path: arr[1], appName: arr[2] };
    } else {
      ret = { path: arr[0], appName: arr[1] };
    }

    return ret;
  };

  const importModule = async (task) => {
    const { path, appName } = processAppPath(task.applicationPath);

    console.log("importModule path, appName -> ", path, appName);

    try {
      const comp = await import(`../${path}/${appName}/index.jsx`);

      const { default: DynamicApp } = comp;
      setApplicationTaskComponent(<DynamicApp task={task} />);
    } catch (error) {
      console.log("DynamicLauncherApp error ->", error);
      setError(error);
    }
  };

  const doTask = async (task) => {
    await importModule(task);
    navigate("applicationTaks", task);
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
        doTask,
        takeTask,
        releaseTask,
        viewTask,
        getTransferOptions,
        transferTask,
        setOutgoingTasks,
        outgoingTasks,
      }}
    >
      <AppHeader app={app} />

      <Routes>
        <Route path="/*" element={tabs()}></Route>
        <Route path="applicationTaks" element={applicationTaksComponent} />
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
