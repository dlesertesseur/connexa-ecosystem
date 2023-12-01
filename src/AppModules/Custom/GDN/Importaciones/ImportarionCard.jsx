import React from "react";
import { Card, Group, Skeleton, Stack, Text, UnstyledButton } from "@mantine/core";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import {
  findImportationStatusCount,
  findImportationsIndicatorsByStatus,
} from "../../../../DataAccess/Custom/DGN/Importations";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ImportationPartialValue from "./ImportationPartialValue";
import ImportationTotalValue from "./ImportationTotalValue";
import ImportationCurrencyValue from "./ImportationCurrencyValue";
import { useImportationContext } from "./ImportationContextProvider";

const ImportarionCard = ({ status, lastUpdate }) => {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const navigate = useNavigate();
  const [count, setCount] = useState(-1);
  const [partials, setPartials] = useState(null);

  const { businessObjectiveSelected, analystSelected } = useImportationContext();

  const getData = async () => {
    const params = {
      token: user.token,
      status: status,
    };

    if(businessObjectiveSelected !== t("importations.label.all")){
      params.event=businessObjectiveSelected;
    }

    if(analystSelected !== t("importations.label.all")){
      params.analyst=analystSelected;
    }

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
      <Card shadow="sm" padding="lg" radius="md" withBorder w={"320px"}>
        <Stack h={"240px"} align="center">
          <Group grow justify="center" align="center" h={"30%"}>
            <Text size={"lg"} fw={700} align="center">
              {status}
            </Text>
          </Group>

          {count > -1 ? (
            <Group position="apart" w={"100%"}>
              <Group grow align="center" w={"50%"}>
                <ImportationTotalValue value={count} />
              </Group>

              <Stack spacing={"xs"} justify="flex-start" h={"100%"}>
                {partials?.values?.map((v) => {
                  if (v.amount > 0) {
                    return (
                      <ImportationCurrencyValue key={v.currency} currency={v.currency} value={Math.round(v.amount)} />
                    );
                  } else {
                    return null;
                  }
                })}
              </Stack>
            </Group>
          ) : (
            <Group justify="center" align="center" h={"60%"}>
              <Skeleton height={80} w={80} circle mb="xl" />
            </Group>
          )}

          {partials ? (
            <Group grow position="center" align="center" w={"100%"} spacing={"xs"}>
              <ImportationPartialValue title={t("importations.label.outOfDate")} value={partials.dateInThePastCount} />
              <ImportationPartialValue title={t("importations.label.onTime")} value={partials.dateInTheFutureCount} />
              <ImportationPartialValue
                title={t("importations.label.notRegistered")}
                value={partials.withoutDateCount}
              />
            </Group>
          ) : (
            <Group position="center" align="center" w={"100%"} spacing={"xs"}>
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
