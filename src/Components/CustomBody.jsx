import React, { useEffect, useState } from "react";
import { Stack } from "@mantine/core";
import { Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useResizeObserver } from "@mantine/hooks";
import { setBodyContainerSize } from "../Features/App";
import DynamicLauncherApp from "../AppModules/DynamicLauncherApp";

const CustomBody = () => {
  const { siteSelected } = useSelector((state) => state.auth.value);
  const [routes, setRoutes] = useState([]);
  const [ref, rect] = useResizeObserver();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setBodyContainerSize({ width: rect.width, height: rect.height }));
  }, [dispatch, rect]);

  useEffect(() => {
    const ret = [];
    if (siteSelected) {
      const roles = siteSelected.roles;
      roles.forEach((role) => {
        const apps = role.applications;
        apps.forEach((app) => {
          ret.push(<Route key={app.id} path={app.path + "/*"} element={<DynamicLauncherApp app={app} />} />);
        });
      });
    }
    setRoutes(ret);
  }, [siteSelected]);

  return (
    <Stack
      ref={ref}
      justify="flex-start"
      spacing="0"
      sx={(theme) => ({
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
        height: "100%",
      })}
      onContextMenu={(e) => {
        e.preventDefault();
      }}
    >
      <Routes>{routes}</Routes>
    </Stack>
  );
};

export default CustomBody;
