import { Box, Card, Group, Skeleton, Stack, Text, UnstyledButton } from "@mantine/core";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { findImportationStatusCount } from "../../../../DataAccess/Custom/DGN/Importations";
import { useNavigate } from "react-router-dom";

const ImportarionCard = ({ status }) => {
  const { user } = useSelector((state) => state.auth.value);
  const navigate = useNavigate();
  const [count, setCount] = useState(null);

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
            status: status
          },
        };
        navigate("importationStatus", params);
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
