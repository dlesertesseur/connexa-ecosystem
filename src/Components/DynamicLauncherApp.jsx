import React, { useEffect, useState } from "react";
import { Alert, Center } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";

const DynamicLauncherApp = ({ app }) => {
  const [component, setComponent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    import(/* @vite-ignore */ "../AppModules" + app.path)
      .then((comp) => {
        const { default: DynamicApp } = comp;
        setComponent(<DynamicApp app={app} />);
      })
      .catch((error) => {
        setError(error);
      });
  }, [app]);

  const errorComp = (
    <Alert icon={<IconAlertCircle size={16} />} title={app.name} color="red" variant="filled">
      {error?.toString()}
    </Alert>
  );

  const waiting = null;

  const process = error ? errorComp : waiting;

  return <Center style={{ width: "100%", height: "100%" }}>{component ? component : process}</Center>;
};

export default DynamicLauncherApp;
