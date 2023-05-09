import React from "react";
import uuid from "react-uuid";
import SortedTable from "./SortedTable";
import { Breadcrumbs, Divider, Stack, Text } from "@mantine/core";
import { Route, Routes } from "react-router-dom";
import { findTranslatedField } from "../../Util";
import { useTranslation } from "react-i18next";

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
  breadcrumbs = null
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
        { breadcrumbs ? <Breadcrumbs>{breadcrumbs}</Breadcrumbs> : null}
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
              />
            }
          />
          <Route path="/create/*" element={createPage} />
          <Route path="/update" element={updatePage} />
          <Route path="/delete" element={deletePage} />

          {relationshipPages?.map((r) => {
            const ret = r.element ? <Route key={uuid()} path={r.path} element={r.element} /> : null;
            return ret;
          })}
        </Routes>
      </Stack>

      {/* <Group
        position="center"
        sx={(theme) => ({
          backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
        })}
      >
        <Pagination total={2}/>
      </Group> */}
    </Stack>
  );
};

export default CrudFrame;
