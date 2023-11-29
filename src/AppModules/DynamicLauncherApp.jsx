import React, { lazy, useEffect, useState } from "react";
import { Alert, LoadingOverlay } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { Suspense } from "react";

const DynamicLauncherApp = ({ app }) => {
  const [component, setComponent] = useState(null);
  const [error, setError] = useState(null);

  const processAppPath = (app) => {
    let ret = null;
    const arr = app.path.split("/");

    let path = "";
    const size = arr.length - 1;
    for (let index = 0; index < size; index++) {
      if (arr[index].length > 0) {
        path += `${arr[index]}`;

        if (index < size - 1) {
          path += `/`;
        }
      }
    }

    ret = { path: path, appName: arr[arr.length - 1] };
    return ret;
  };

  const importModule = async (app) => {
    const basePath = ".";
    const { path, appName } = processAppPath(app);

    // try {
    //   console.log("##### importModule -> ", `${basePath}/${path}/${appName}/index.jsx`);

    //   const comp = await import(/* @vite-ignore */ `${basePath}/${path}/${appName}/index.jsx`);
    //   const DynamicApp = comp.default;
    //   setComponent(<DynamicApp app={app} />);

    // } catch (error) {
    //   console.log("DynamicLauncherApp error ->", error);
    //   setError(error);
    // }

    try {
      // let appPath = basePath + "/" + path + "/" + appName;
      // console.log("import appPath -> ", appPath);

      const comp = await import(/* @vite-ignore */ basePath + "/" + path + "/" + appName);

      const DynamicApp = comp.default;
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
    <>
      <Suspense fallback={<LoadingOverlay overlayOpacity={0.5} />}>{component}</Suspense>
      {error ? errorComp : null}
    </>
  );
};

export default DynamicLauncherApp;
