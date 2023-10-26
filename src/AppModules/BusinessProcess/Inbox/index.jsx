import React, { useEffect, useState } from "react";
import ResponceNotification from "../../../Modal/ResponceNotification";
import AppHeader from "../../../Components/AppHeader";
import TabLabel from "./tabs/TabLabel";
import BusinessProcessModelPanel from "./tabs/BusinessProcessModelPanel";
import TaskPanel from "./tabs/TaskPanel";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { AbmStateContext } from "./Context";
import { LoadingOverlay, Tabs } from "@mantine/core";
import {
  createBusinessProcessModelInstance,
  executeTask,
  findAllBusinessProcessModelByRole,
  findAllTaskByRoleId,
  getAllOutgoingTaskByTaskId,
  releaseTask,
  takeTask,
} from "../../../DataAccess/BusinessProcessModelInbox";
import { getRoleBySiteIdAndUserId } from "../../../DataAccess/User";
import { findAllByOrganizationId } from "../../../DataAccess/OrganizationRole";
import { Route, Routes, useNavigate } from "react-router-dom";
import BusinessProcessModelDialog from "../Diagram/editor/BusinessProcessModelDialog";

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
  const [createdBusinessProcessId, setCreatedBusinessProcessId] = useState(null);
  const [task, setTask] = useState(false);
  const navigate = useNavigate();

  const [time, setTime] = useState();

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(Date.now());
    }, 3000);

    return () => clearInterval(interval);
  }, [time]);

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
    let rolesMap = null;
    let params = {
      token: user.token,
      userId: user.id,
      siteId: siteSelected.id,
      id: organizationSelected.id,
    };

    try {
      const roles = await findAllByOrganizationId(params);
      rolesMap = rolesToRoleById(roles);
      const userRole = await getRoleBySiteIdAndUserId(params);
      
      if (userRole) {
        let tasks = [];
        for (const role of userRole) {
          const params = {
            token: user.token,
            userId: user.id,
            roleId: role.id,
          };

          const processList = await findAllBusinessProcessModelByRole(params);
          if (processList.length) {
            process = process.concat(processList);
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
              const applicationPath = "TaskApplication/FormInstanceApp";
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
                businesProcessName:t.businessProcessInstanceName
              };
            });
            tasks = tasks.concat(ret);
          }
        }
        setTasksList(tasks);
      }
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    getData();
    console.log("getting data...");
  }, [user, reload, time]);

  const createProcessModelInstance = async (values) => {
    // const params = {
    //   token: user.token,
    //   userId: user.id,
    //   name: values.name,
    //   description: values.description,
    //   businessProcessModelId: values.businessProcessModelId,
    // };
    // try {
    //   setLoading(true);
    //   const ret = await createBusinessProcessModelInstance(params);

    //   if (ret.error) {
    //     setError(ret.message);
    //     console.log("createBusinessProcessModelInstance -> Error", ret.message);
    //   } else {
    //     if (ret && ret.id) {
    //       //setCreationStatut(t("businessProcessModelInbox.messages.creation"));
    //       setCreatedBusinessProcessId(ret.id);
    //     }
    //   }
    // } catch (error) {
    //   setError(error);
    // }
    setLoading(false);

    setCreatedBusinessProcessId("821469ba-fd42-4b26-8d3d-9db4db84cc48");

  };

  const onTakeTask = async (task) => {
    const params = {
      token: user.token,
      userId: user.id,
      taskId: task.id,
    };

    try {
      const ret = await takeTask(params);
      if (ret.status !== 200) {
        setError(ret.error);
      } else {
        setReload(Date.now());
      }
    } catch (error) {
      setError(error);
    }
  };

  const onReleaseTask = async (task) => {
    const params = {
      token: user.token,
      userId: user.id,
      taskId: task.id,
    };

    try {
      const ret = await releaseTask(params);
      console.log("onReleaseTask releaseTask ret ->", ret);
      if (ret.status !== 200) {
        setError(ret.error);
      } else {
        setReload(Date.now());
      }
    } catch (error) {
      setError(error);
    }
  };

  const onTransferTask = async (origingTaskId, targetTaskId) => {
    const params = {
      token: user.token,
      userId: user.id,
      originTaskId: origingTaskId,
      targetTaskId: targetTaskId,
    };

    try {
      const ret = await executeTask(params);

      if (ret?.error) {
        setError(ret.error);
      } else {
        setOutgoingTasks(null);
        setReload(Date.now());
      }
    } catch (error) {
      setError(error);
    }
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

  const sendToScrumMaster = async (task) => {
    // const params = {
    //   token: user.token,
    //   taskId: task.id,
    // };

    // setLoading(true);
    // const outgoing = await getAllOutgoingTaskByTaskId(params);
    // setOutgoingTasks(outgoing);
    // setLoading(false);
  };

  const onViewTask = (task) => {
    setTask(task);
  };

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

  const onDoTask = async (task) => {
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
        onDoTask,
        onTakeTask,
        onReleaseTask,
        onTransferTask,
        onViewTask,
        getTransferOptions,
        sendToScrumMaster,
        setOutgoingTasks,
        outgoingTasks,
        createdBusinessProcessId,
        setCreatedBusinessProcessId
      }}
    >
      <AppHeader app={app} />

      <LoadingOverlay visible={loading} zIndex={1000} />

      <Routes>
        <Route path="/*" element={tabs()}></Route>
        <Route path="applicationTaks/*" element={applicationTaksComponent} />
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

      <BusinessProcessModelDialog
        open={task}
        close={() => setTask(null)}
        taskId={task?.id}
        businessProcessInstanceId={task?.businessProcessInstanceId}
      />
    </AbmStateContext.Provider>
  );

  return ret;
};

export default DynamicApp;
