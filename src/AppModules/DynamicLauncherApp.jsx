import React, { lazy, useEffect, useState } from "react";
import { Alert, Center } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { Suspense } from "react";

const DynamicLauncherApp = ({ app }) => {
  const [component, setComponent] = useState(null);
  const [error, setError] = useState(null);

  const processAppPath = (app) => {
    let ret = null;
    const arr = app.path.split("/");

    if (arr.length > 2) {
      ret = { path: arr[1], appName: arr[2] };
    }else{
      ret = { path: arr[0], appName: arr[1] };
    }

    return ret;
  };

  const importModule = async (app) => {
    const { path, appName } = processAppPath(app);
    try {
      const comp = await import(`./${path}/${appName}/index.jsx`);

      const { default: DynamicApp } = comp;
      setComponent(<DynamicApp app={app} />);
    } catch (error) {
      console.log("DynamicLauncherApp error ->", error);
      setError(error);
    }
  };

  useEffect(() => {
    importModule(app);
  }, [app]);

  const errorComp = (
    <Alert icon={<IconAlertCircle size={16} />} title={app.name} color="red" variant="filled">
      {error?.toString()}
    </Alert>
  );

  const waiting = null;

  const process = error ? errorComp : waiting;

  return (
    <Center style={{ width: "100%", height: "100%" }}>{component ? <Suspense>{component}</Suspense> : process}</Center>
  );
};

export default DynamicLauncherApp;
