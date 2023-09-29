import React, { useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Skeleton, Stack } from "@mantine/core";
import { HEADER_HIGHT } from "../../../../Constants";
import { useEffect } from "react";
import { WIDGETS_NAMES_BY_NAME } from "../../../../Constants/DOCUMENTS";
import FormHeaderPanel from "./FormHeaderPanel";
import SortedTable from "../../../../Components/Crud/SortedTable";
import ComponentFormPanel from "./ComponentFormPanel";

const CollectionFormPanel = ({ formData, options, panels, widgetByPanel, formConfig, relatedEntities, parentId, data, widgetByName }) => {
  const { t } = useTranslation();
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [columns, setColumns] = useState([]);
  const navigate = useNavigate();

  const HEADER = 60;

  useEffect(() => {
    if (formData) {
      const list = formData.children;
      if (list) {
        const ret = [];

        list.forEach((c) => {
          const widget = WIDGETS_NAMES_BY_NAME.get(c.type);
          if (!widget.hidden) {
            const obj = { headerName: c.label, fieldName: c.name, align: "left" };
            ret.push(obj);
          }
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
            formData ? (
              <SortedTable
                data={data}
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
            ) : (
              <Skeleton h={96} w={"100%"} />
            )
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
              mode={"CREATE"}
              title={`${t("document.entityDefinition.label.newRecord")} ${formData?.label}`}
            />
          }
        />
        <Route
          path="update"
          element={
            <ComponentFormPanel
              formData={formData}
              options={options}
              panels={panels}
              widgetByPanel={widgetByPanel}
              formConfig={formConfig}
              relatedEntities={relatedEntities}
              parentId={parentId}
              mode={"UPDATE"}
              title={`${t("document.entityDefinition.label.updateRecord")} ${formData?.label}`}
              selectedRowId={selectedRowId}
              widgetByName={widgetByName}
            />
          }
        />
        <Route
          path="delete"
          element={
            <ComponentFormPanel
              formData={formData}
              options={options}
              panels={panels}
              widgetByPanel={widgetByPanel}
              formConfig={formConfig}
              relatedEntities={relatedEntities}
              parentId={parentId}
              mode={"DELETE"}
              title={`${t("document.entityDefinition.label.deleteRecord")} ${formData?.label}`}
              data={data}
              selectedRowId={selectedRowId}
              widgetByName={widgetByName}
            />
          }
        />        
      </Routes>
    </Stack>
  );
};

export default CollectionFormPanel;
