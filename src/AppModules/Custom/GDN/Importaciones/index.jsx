import { Stack } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import {
  findAllAnalysts,
  findAllBusinessObjectives,
  findAllImportationStatuses,
  getProcessStatus,
} from "../../../../DataAccess/Custom/DGN/Importations";
import { useSelector } from "react-redux";
import React from "react";
import ResponceNotification from "../../../../Modal/ResponceNotification";
import AppHeader from "../../../../Components/AppHeader";
import ImportationStatusDetail from "./ImportationStatusDetail";
import ImportationsPanel from "./ImportationsPanel";
import ImportationProvider from "./ImportationContextProvider";

const DynamicApp = ({ app }) => {
  const { t } = useTranslation();
  const [error, setError] = useState(null);

  const { user } = useSelector((state) => state.auth.value);
  const [statuses, setStatuses] = useState(null);
  const [businessObjectives, setBusinessObjectives] = useState(null);
  const [analysts, setAnalysts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processControl, setProcessControl] = useState(null);

  const getData = async () => {
    const params = {
      token: user.token,
    };

    try {
      const processControl = await getProcessStatus(params);
      if (processControl && processControl.length > 0) {
        setProcessControl(processControl[0]);
      }

      const list = await findAllImportationStatuses(params);
      if (list.message) {
        setError(list.message);
      } else {
        const ret = list.filter((i) => i !== "");
        setStatuses(ret);

        let events = await findAllBusinessObjectives(params);
        events = events.filter(e => e !== "");
        events.unshift(t("importations.label.all"))	
        setBusinessObjectives(events);

        let analysts = await findAllAnalysts(params);
        analysts = analysts.filter(e => e !== "");
        analysts.unshift(t("importations.label.all"))	
        setAnalysts(analysts);
      }
    } catch (error) {
      setError(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, [user]);

  return (
    <Stack w={"100%"} spacing={0}>
      <AppHeader app={app} />

      <Stack spacing={"xs"} mt={"md"}>
        <ImportationProvider>
          <Routes>
            <Route
              path="/"
              element={
                <ImportationsPanel
                  statuses={statuses}
                  processControl={processControl}
                  businessObjectives={businessObjectives}
                  analysts={analysts}
                />
              }
            />
            <Route exact path="/importationStatusDetail" element={<ImportationStatusDetail setError={setError} />} />
          </Routes>
        </ImportationProvider>
      </Stack>

      <ResponceNotification
        opened={error ? true : false}
        onClose={() => {
          setError(null);
        }}
        code={error}
        title={t("status.error")}
        text={error}
      />
    </Stack>
  );
};

export default DynamicApp;
