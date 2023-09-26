import React from "react";
import uuid from "react-uuid";
import SortedTable from "./SortedTable";
import { Breadcrumbs, Divider, Stack, Text } from "@mantine/core";
import { Route, Routes } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AppHeader from "../AppHeader";

const CrudFrame = ({
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
  filterSelection = null,
  loading = false,
  breadcrumbs = null,
  headerHeight = 230,
  actionButtons = null
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
      <AppHeader app={app}/>

      <Stack
        justify="flex-start"
        sx={(theme) => ({
          backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
        })}
      >
        {breadcrumbs ? <Breadcrumbs>{breadcrumbs}</Breadcrumbs> : null}
        <Routes>
          <Route
            path="/"
            element={
              <SortedTable
                data={data}
                columns={columns}
                filterControl={filterControl}
                filterSelection={filterSelection}
                loading={loading}
                enableCreateButton={enableCreateButton}
                rowSelected={rowSelected}
                setRowSelected={setRowSelected}
                relationship={relationshipPages}
                headerHeight={headerHeight}
                actionButtons={actionButtons}
              />
            }
          />
          <Route path="/create/*" element={createPage} />
          <Route path="/update" element={updatePage} />
          <Route path="/delete" element={deletePage} />

          {relationshipPages?.map((r) => {
            const ret = r.element ? (
              <Route key={uuid()} path={r.path + "/*"} element={r.element}></Route>
            ) : null;

            return ret;
          })}
        </Routes>
      </Stack>
    </Stack>
  );
};

export default CrudFrame;
