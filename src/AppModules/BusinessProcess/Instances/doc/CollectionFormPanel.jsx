import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Skeleton, Stack } from "@mantine/core";
import { HEADER_HIGHT } from "../../../../Constants";
import { useEffect } from "react";
import { WIDGETS_NAMES_BY_NAME } from "../../../../Constants/DOCUMENTS";
import { useSelector } from "react-redux";
import { findFormInstanceById } from "../../../../DataAccess/FormInstance";
import FormHeaderPanel from "./FormHeaderPanel";
import ComponentFormPanel from "./ComponentFormPanel";
import SimpleTable from "../../../../Components/SimpleTable";

const CollectionFormPanel = ({
  formData,
  options,
  panels,
  widgetByPanel,
  formConfig,
  relatedEntities,
  parentId,
  widgetByName,
  root,
  deltaY = 0
}) => {
  const { user } = useSelector((state) => state.auth.value);
  const { t } = useTranslation();
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const HEADER = 60;

  const getData = async () => {
    const params = { token: user.token, id: parentId };
    try {
      const instanceNode = await findFormInstanceById(params);
      const collectionName = `COLLECTION<${formData.name}>`;
      let collection = instanceNode.children.find((c) => c.name === collectionName);
      if (collection) {
        const data = collection?.children?.map((r) => {
          const obj = {};
          r.children.forEach((c) => {
            obj[c.name] = c.value;
          });
          obj.id = r.id;
          return obj;
        });

        setData(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

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

        getData();
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
      <FormHeaderPanel name={formData?.label} description={formData?.description} root={root} />

      <Routes>
        <Route
          path="/"
          element={
            formData ? (
              <SimpleTable
                data={data}
                columns={columns}
                loading={false}
                rowSelected={selectedRowId}
                setRowSelected={setSelectedRowId}
                headerHeight={HEADER_HIGHT + HEADER + 32 + deltaY}
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
              root={root}
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
              root={root}
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
              selectedRowId={selectedRowId}
              widgetByName={widgetByName}
              root={root}
            />
          }
        />
      </Routes>
    </Stack>
  );
};

export default CollectionFormPanel;
