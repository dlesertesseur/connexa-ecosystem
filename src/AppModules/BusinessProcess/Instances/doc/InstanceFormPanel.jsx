import React, { useEffect, useState } from "react";
import CollectionFormPanel from "./CollectionFormPanel";
import ComponentFormPanel from "./ComponentFormPanel";
import ResponceNotification from "../../../../Modal/ResponceNotification";
import { useSelector } from "react-redux";
import { Stack } from "@mantine/core";
import { Route, Routes } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { findEntityDefinitionById } from "../../../../DataAccess/EntityDefinition";

const InstanceFormPanel = ({ formId, type, parentId, root = false }) => {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const [formDefinition, setFormDefinition] = useState(null);
  const [options, setOptions] = useState(null);
  const [panels, setPanels] = useState([]);
  const [relatedEntities, setRelatedEntities] = useState([]);
  const [widgetByPanel, setWidgetByPanel] = useState(new Map());
  const [widgetByName, setWidgetByName] = useState(new Map());
  const [formConfig, setFormConfig] = useState({});
  const [reloadData, setReloadData] = useState(false);
  const [error, setError] = useState(null);

  const getData = async () => {
    const params = {
      token: user.token,
      id: formId,
    };
    const modelNode = await findEntityDefinitionById(params);

    try {
      const options = await JSON.parse(modelNode?.options);
      setOptions(options);
    } catch (error) {
      console.log("error ->", error);
      setOptions({ size: "md" });
    }

    const panels = [];
    const collections = [];
    const widgetByPanel = new Map();

    modelNode?.children?.forEach(async (field) => {
      switch (field.type) {
        case "COLLECTION<SUBFORM>":
        case "SUBFORM":
          collections.push(field);
          break;

        default:
          const id = `panel-${field.row}`;
          widgetByName.set(field.name, field);
          const group = widgetByPanel.get(id);

          if (group !== undefined) {
            widgetByPanel.set(id, [...group, field]);
          } else {
            widgetByPanel.set(id, [field]);
            panels.push({ id: id });
          }

          break;
      }
    });

    setPanels(panels);
    setWidgetByPanel(widgetByPanel);
    setRelatedEntities(collections);
    setFormDefinition(modelNode);
    setWidgetByName(widgetByName);
  };

  useEffect(() => {
    if (formId) {
      getData();
    }
  }, [formId, reloadData]);

  useEffect(() => {
    if (panels) {
      const config = {
      };
      setFormConfig(config);
    }
  }, [panels]);

  const isACollectionObjects = () => {
    const ret = type === "COLLECTION<SUBFORM>" ? true : false;
    return ret;
  };

  return (
    <>
      {formDefinition ? (
        <Routes>
          <Route
            path="/*"
            element={
              <Stack spacing={"xs"}>
                {isACollectionObjects() ? (
                  <CollectionFormPanel
                    formData={formDefinition}
                    options={options}
                    panels={panels}
                    widgetByPanel={widgetByPanel}
                    formConfig={formConfig}
                    relatedEntities={relatedEntities}
                    parentId={parentId}
                    widgetByName={widgetByName}
                    root={root}
                  />
                ) : (
                  <ComponentFormPanel
                    formData={formDefinition}
                    options={options}
                    panels={panels}
                    widgetByPanel={widgetByPanel}
                    formConfig={formConfig}
                    relatedEntities={relatedEntities}
                    parentId={parentId}
                    widgetByName={widgetByName}
                    mode={type}
                    root={root}
                  />
                )}
              </Stack>
            }
          ></Route>
          {relatedEntities.map((re) => {
            return (
              <Route
                key={re.options}
                path={`${re.name}/*`}
                element={<InstanceFormPanel formId={re.options} type={re.type} parentId={parentId} />}
              />
            );
          })}
        </Routes>
      ) : null}

      <ResponceNotification
        opened={error ? true : false}
        onClose={() => {
          setError(null);
        }}
        code={error}
        title={t("status.error")}
        text={error}
      />
    </>
  );
};

export default InstanceFormPanel;
