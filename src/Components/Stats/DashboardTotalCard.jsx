import React from "react";
import { Box } from "@mui/system";
import { Button, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

const DashboardTotalCard = ({
  title = "NO TITLE",
  value = "0",
  color = "#56b45d",
  fillColor = "#56b45d",
  data = null,
  type = "LINE",
}) => {
  // useEffect(() => {
  //   const ws = new WebSocket(
  //     "ws://localhost:8080"
  //   );

  //   ws.onopen = () => {
  //     console.log("Connection Established!");
  //     const subscription = { topic: "subscribe", to: "chart" };
  //     ws.send(JSON.stringify(subscription));
  //   };
  //   ws.onmessage = (event) => {
  //     const response = JSON.parse(event.data);
  //     console.log(response);
  //   };

  //   ws.onclose = () => {
  //     console.log("Connection Closed!");
  //   };

  //   ws.onerror = () => {
  //     console.log("WS Error");
  //   };

  //   return () => {
  //     ws.close();
  //   };
  // }, []);

  const { t } = useTranslation();

  return (
    <Stack
      sx={{
        boxShadow: 2,
        borderRadius: 2,
        backgroundColor: "#EBE8F4",
      }}
      minHeight={150}
      display="flex"
      direction="column"
      justifyContent="space-between" alignItems=""
      padding={2}
    >
      <Box display="flex" justifyContent="center" alignItems="center">
        <Typography fontSize={16} fontWeight="medium">{title.toUpperCase()}</Typography>
      </Box>

      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{ color: "text.primary", fontSize: 36, fontWeight: "medium" }}
      >
        {value}
      </Box>

      <Stack direction="column" justifyContent="center">
        <Button variant="contained" color="primaryLight" disableElevation size="small">
          {t("button.detailBysite")}
        </Button>
      </Stack>
    </Stack>
  );
};

export default DashboardTotalCard;
