import React, { useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Stack } from "@mantine/core";
import { HEADER_HIGHT } from "../../../../Constants";
import { useEffect } from "react";
import FormHeaderPanel from "./FormHeaderPanel";
import SortedTable from "../../../../Components/Crud/SortedTable";
import ComponentFormPanel from "./ComponentFormPanel";

const CollectionFormPanel = ({ formData, options, panels, widgetByPanel, formConfig, relatedEntities, parentId }) => {
  const { t } = useTranslation();
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [columns, setColumns] = useState([]);
  const navigate = useNavigate();

  const HEADER = 60;

  useEffect(() => {
    if (formData) {
      const list = formData.children;
      if (list) {
        const ret = list.map((c) => {
          return { headerName: c.label, fieldName: c.name, align: "left" };
        });

        setColumns(ret);
      }
    }
  }, [formData]);

  return (
    <Stack
      spacing={"xs"}
      p={"xs"}
      justify="flex-start"
      sx={(theme) => ({
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
      })}
    >
      <FormHeaderPanel name={formData?.label} description={formData?.description} />

      <Routes>
        <Route
          path="/"
          element={
            <SortedTable
              data={[]}
              columns={columns}
              loading={false}
              enableCreateButton={true}
              rowSelected={selectedRowId}
              setRowSelected={setSelectedRowId}
              headerHeight={HEADER_HIGHT + HEADER + 32}
              backButton={() => {
                navigate("../../");
              }}
            />
          }
        ></Route>
        <Route
          path="create"
          element={
            <ComponentFormPanel
              formData={formData}
              options={options}
              panels={panels}
              widgetByPanel={widgetByPanel}
              formConfig={formConfig}
              relatedEntities={relatedEntities}
              parentId={parentId}
              mode={`${t("document.entityDefinition.label.newRecord")} ${formData?.label}`}
            />
          }
        />
      </Routes>
    </Stack>
  );
};

export default CollectionFormPanel;
