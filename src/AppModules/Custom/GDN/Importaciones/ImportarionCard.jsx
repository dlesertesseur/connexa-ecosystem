import React from "react";
import { Card, Group, Skeleton, Stack, Text, UnstyledButton } from "@mantine/core";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { findImportationStatusCount, findImportationsIndicatorsByStatus } from "../../../../DataAccess/Custom/DGN/Importations";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ImportationParialValue from "./ImportationParialValue";

const ImportarionCard = ({ status, lastUpdate }) => {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const navigate = useNavigate();
  const [count, setCount] = useState(null);
  const [partials, setPartials] = useState(null);

  const getData = async () => {
    const params = {
      token: user.token,
      status: status,
    };

    setCount(0);
    setPartials(null);

    try {
      const value = await findImportationStatusCount(params);
      if (value.message) {
        setError(value.message);
      } else {
        setCount(value);

        const partials = await findImportationsIndicatorsByStatus(params);
        setPartials(partials);
      }
    } catch (error) {
      // setCount("error");
    }
  };

  useEffect(() => {
    getData();
  }, [status, lastUpdate]);

  return (
    <UnstyledButton
      onClick={(e) => {
        const params = {
          state: {
            status: status,
          },
        };
        navigate("importationStatusDetail", params);
      }}
    >
      <Card shadow="sm" padding="lg" radius="md" withBorder w={"350px"}>
        <Stack h={"240px"} align="center">
          <Group grow justify="center" align="center" h={"30%"}>
            <Text size={"md"} fw={500} align="center">
              {status}
            </Text>
          </Group>

          {count ? (
            <Group grow justify={"flex-start"} align="center" h={"60%"}>
              <Text size={"56px"} weight={650} align="center">
                {count}
              </Text>
            </Group>
          ) : (
            <Group justify="center" align="center" h={"60%"}>
              <Skeleton height={80} w={80} circle mb="xl" />
            </Group>
          )}
          {partials ? (
            <Group grow position="center" align="center" h={"60%"} w={"100%"} spacing={"xs"}>
              {partials.dateInThePastCount ? (
                <ImportationParialValue title={t("importations.label.outOfDate")} value={partials.dateInThePastCount} />
              ) : null}
              {partials.dateInTheFutureCount ? (
                <ImportationParialValue title={t("importations.label.onTime")} value={partials.dateInTheFutureCount} />
              ) : null}
              {partials.withoutDateCount ? (
                <ImportationParialValue title={t("importations.label.notRegistered")} value={partials.withoutDateCount} />
              ) : null}
            </Group>
          ) : (
            <Group position="center" align="center" h={"60%"} w={"100%"} spacing={"xs"}>
              <Skeleton height={50} w={50} mb="md" radius={"md"} />
              <Skeleton height={50} w={50} mb="md" radius={"md"} />
              <Skeleton height={50} w={50} mb="md" radius={"md"} />
            </Group>
          )}
        </Stack>
      </Card>
    </UnstyledButton>
  );
};

export default ImportarionCard;
