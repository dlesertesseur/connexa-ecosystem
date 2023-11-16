import { Container, Flex, Grid, Stack } from "@mantine/core";
import React from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { findAllImportationStatuses } from "../../../../DataAccess/Custom/DGN/Importations";
import { useState } from "react";
import { useEffect } from "react";
import ResponceNotification from "../../../../Modal/ResponceNotification";
import ImportarionCard from "./ImportarionCard";
import AppHeader from "../../../../Components/AppHeader";
import { Route, Routes } from "react-router-dom";
import ImportationStatusDetail from "./ImportationStatusDetail";

const DynamicApp = ({ app }) => {
  const { user } = useSelector((state) => state.auth.value);
  const { t } = useTranslation();
  const [statuses, setStatuses] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getData = async () => {
    const params = {
      token: user.token,
    };

    try {
      const list = await findAllImportationStatuses(params);
      if (list.message) {
        setError(list.message);
      } else {
        setStatuses(list);
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

      {statuses ? (
        <Container size={"xl"} mt={"md"}>
          <Routes>
            <Route
              path="/"
              element={<Flex wrap={"wrap"} gap={"xs"} justify="flex-start" align="stretch">
                {statuses.map((s) => (
                  <ImportarionCard key={s} status={s} />
                ))}
              </Flex>}
            />
            <Route exact path="/importationStatus" element={<ImportationStatusDetail/>} />
          </Routes>
        </Container>
      ) : null}

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
