import { Box, Card, Group, Skeleton, Stack, Text, UnstyledButton } from "@mantine/core";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { findImportationStatusCount, findImportationsByStatus } from "../../../../DataAccess/Custom/DGN/Importations";
import { useNavigate } from "react-router-dom";

const ImportarionCard = ({ status }) => {
  const { user } = useSelector((state) => state.auth.value);
  const navigate = useNavigate();
  const [count, setCount] = useState(null);
  const [partials, setPartials] = useState(null);

  const calculatePartialsTotals = (rows) => {
    let outOfDate = 0;
    let onTime = 0;
    let notRegistered = 0;

    if (rows) {
      const actualtDate = Date.now();

      rows.forEach((r) => {
        if (r.necesidadEnCd) {
          const date = new Date(r.necesidadEnCd).getTime();
          if (actualtDate > date) {
            outOfDate++;
          } else {
            onTime++;
          }
        } else {
          notRegistered++;
        }
      });
    }

    const ret = {
      outOfDate: outOfDate,
      onTime: onTime,
      notRegistered: notRegistered,
    };
    return ret;
  };

  const getData = async () => {
    const params = {
      token: user.token,
      status: status,
    };

    try {
      const value = await findImportationStatusCount(params);
      if (value.message) {
        setError(value.message);
      } else {
        setCount(value);

        const rows = await findImportationsByStatus(params);
        const partials = calculatePartialsTotals(rows);
        console.log("findImportationsByStatus rows ->", rows);
      }
    } catch (error) {
      // setCount("error");
    }
  };

  useEffect(() => {
    getData();
  }, [status]);

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
      <Card shadow="sm" padding="lg" radius="md" withBorder w={"300px"}>
        <Stack h={"180px"} align="center">
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
        </Stack>
      </Card>
    </UnstyledButton>
  );
};

export default ImportarionCard;
