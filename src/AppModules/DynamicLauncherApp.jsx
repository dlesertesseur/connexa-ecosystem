import React, { useEffect, useState } from "react";
import { Alert, LoadingOverlay } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { Suspense } from "react";

const dynamicImport = async (app) => {
  let comp = null;
  switch (app) {
    case "/BusinessProcess/Design":
      comp = await import("./BusinessProcess/Design");
      break;
    case "/BusinessProcess/Diagram":
      comp = await import("./BusinessProcess/Diagram");
      break;
    case "/BusinessProcess/Goals":
      comp = await import("./BusinessProcess/Goals");
      break;
    case "/BusinessProcess/Inbox":
      comp = await import("./BusinessProcess/Inbox");
      break;
    case "/BusinessProcess/Instances":
      comp = await import("./BusinessProcess/Instances");
      break;
    case "/BusinessProcess/ScrumMaster":
      comp = await import("./BusinessProcess/ScrumMaster");
      break;
    case "/Comex/EditRecap":
      comp = await import("./Comex/EditRecap");
      break;
    case "/Cruds/Application":
      comp = await import("./Cruds/Application");
      break;
    case "/Cruds/Brands":
      comp = await import("./Cruds/Brands");
      break;
    case "/Cruds/Categorizer":
      comp = await import("./Cruds/Categorizer");
      break;
    case "/Cruds/Category":
      comp = await import("./Cruds/Category");
      break;
    case "/Cruds/Floor":
      comp = await import("./Cruds/Floor");
      break;
    case "/Cruds/Organization":
      comp = await import("./Cruds/Organization");
      break;
    case "/Cruds/Product":
      comp = await import("./Cruds/Product");
      break;
    case "/Cruds/Retailers":
      comp = await import("./Cruds/Retailers");
      break;
    case "/Cruds/RetailerStores":
      comp = await import("./Cruds/RetailerStores");
      break;
    case "/Cruds/Role":
      comp = await import("./Cruds/Role");
      break;
    case "/Cruds/Shift":
      comp = await import("./Cruds/Shift");
      break;
    case "/Cruds/Site":
      comp = await import("./Cruds/Site");
      break;
    case "/Cruds/StorageStructure":
      comp = await import("./Cruds/StorageStructure");
      break;
    case "/Cruds/User":
      comp = await import("./Cruds/User");
      break;
    case "/Cruds/Variables":
      comp = await import("./Cruds/Variables");
      break;
    case "/Cruds/Worker":
      comp = await import("./Cruds/Worker");
      break;
    case "/Custom/GDN/Importaciones":
      comp = await import("./Custom/GDN/Importaciones");
      break;
    case "/Document/DataSource":
      comp = await import("./Document/DataSource");
      break;
    case "/Document/EntityDefinition":
      comp = await import("./Document/EntityDefinition");
      break;
    case "/Document/FormDefinition":
      comp = await import("./Document/FormDefinition");
      break;
    case "/Editors/ModelStructure":
      comp = await import("./Editors/ModelStructure");
      break;
    case "/Editors/Structure":
      comp = await import("./Editors/Structure");
      break;
    case "/Layout/EncodingStructures":
      comp = await import("./Layout/EncodingStructures");
      break;
    case "/Layout/FloorGraphEditor":
      comp = await import("./Layout/FloorGraphEditor");
      break;
    case "/Layout/FloorViewer":
      comp = await import("./Layout/FloorViewer");
      break;
    case "/Layout/FloorViewer3d":
      comp = await import("./Layout/FloorViewer3d");
      break;
    case "/Layout/LayoutStaticPartEditor":
      comp = await import("./Layout/LayoutStaticPartEditor");
      break;
    case "/Layout/RackLocationEditor":
      comp = await import("./Layout/RackLocationEditor");
      break;
    case "/Views/Dashboard":
      comp = await import("./Views/Dashboard");
      break;
    case "/Views/ExternalDashboard":
      comp = await import("./Views/ExternalDashboard");
      break;

    case "/Wizard/Registration":
      comp = await import("./Wizard/Registration");
      break;
    default:
      break;
  }

  return comp;
};

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
    // const basePath = ".";
    // const { path, appName } = processAppPath(app);

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

      const comp = await dynamicImport(app.path); //await import(/* @vite-ignore */ basePath + "/" + path + "/" + appName);

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
