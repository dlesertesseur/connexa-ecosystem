import React from "react";
import uuid from "react-uuid";
import SortedTable from "./SortedTable";
import { Breadcrumbs, Divider, Stack, Text } from "@mantine/core";
import { Route, Routes } from "react-router-dom";
import { findTranslatedField } from "../../Util";
import { useTranslation } from "react-i18next";

const WizardFrame = ({
  app,
  data,
  columns,
  rowSelected,
  setRowSelected,
  createPage,
  filterControl = null,
  filterSelection = null,
  loading = false,
  breadcrumbs = null,
  headerHeight= 230,
  enableCreateButton
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
                rowSelected={rowSelected}
                setRowSelected={setRowSelected}
                headerHeight={headerHeight}
                updateButton={false}
                deleteButton={false}
                enableCreateButton={enableCreateButton}
              />
            }
          />
          <Route path="/create/*" element={createPage} />
        </Routes>
      </Stack>
    </Stack>
  );
};

export default WizardFrame;
