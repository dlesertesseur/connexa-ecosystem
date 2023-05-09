import React from "react";
import uuid from "react-uuid";
import SortedTableStateController from "./SortedTableStateController";
import { Divider, Stack, Text } from "@mantine/core";
import { Route, Routes } from "react-router-dom";
import { findTranslatedField } from "../../Util";
import { useTranslation } from "react-i18next";

const CrudFrameStateController = ({
  app,
  data,
  columns,
  rowSelected,
  setRowSelected,
  enableCreateButton,
  createPage,
  updatePage,
  deletePage,
  relationshipPages,
  filterControl = null,
  loading = false,
  setActivePage,
}) => {
  const { i18n } = useTranslation();

  return (
    <Stack
      justify="stretch"
      spacing="xs"
      sx={(theme) => ({
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
        height: "100%",
        width: "100%",
      })}
    >
      <Stack
        spacing={0}
        align={"flex-start"}
        sx={(theme) => ({
          backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
          height: "48px",
        })}
      >
        <Text size="xl" weight={700}>
          {findTranslatedField(i18n.language, app, "name")}
        </Text>
        <Text size="xs" color="dimmed">
          {findTranslatedField(i18n.language, app, "description")}
        </Text>
      </Stack>
      <Divider />
      <Stack
        justify="flex-start"
        sx={(theme) => ({
          backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
        })}
      >
        <Routes>
          <Route
            path="/"
            element={
              <SortedTableStateController
                data={data}
                columns={columns}
                filterControl={filterControl}
                loading={loading}
                enableCreateButton={enableCreateButton}
                rowSelected={rowSelected}
                setRowSelected={setRowSelected}
                relationship={relationshipPages}
                setActivePage={setActivePage}
              />
            }
          />
          <Route path="/create" element={createPage} />
          <Route path="/update" element={updatePage} />
          <Route path="/delete" element={deletePage} />

          {relationshipPages?.map((r) => (
            <Route key={uuid()} path={r.path} element={r.element} />
          ))}
        </Routes>
      </Stack>
    </Stack>
  );
};

export default CrudFrameStateController;
