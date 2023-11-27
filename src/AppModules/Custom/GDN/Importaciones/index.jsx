import { Stack } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import React from "react";
import ResponceNotification from "../../../../Modal/ResponceNotification";
import AppHeader from "../../../../Components/AppHeader";
import ImportationStatusDetail from "./ImportationStatusDetail";
import ImportationsPanel from "./ImportationsPanel";
import { findAllImportationStatuses } from "../../../../DataAccess/Custom/DGN/Importations";
import { useSelector } from "react-redux";

const DynamicApp = ({ app }) => {
  const { t } = useTranslation();
  const [error, setError] = useState(null);

  const { user } = useSelector((state) => state.auth.value);
  const [statuses, setStatuses] = useState(null);
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    const params = {
      token: user.token,
    };

    try {
      const list = await findAllImportationStatuses(params);
      if (list.message) {
        setError(list.message);
      } else {
        const ret = list.filter(i => i !== "")
        setStatuses(ret);
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
        <Routes>
          <Route path="/" element={<ImportationsPanel statuses={statuses} />} />
          <Route exact path="/importationStatusDetail" element={<ImportationStatusDetail setError={setError} />} />
        </Routes>
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
