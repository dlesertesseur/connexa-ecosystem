import React, { useEffect, useState } from "react";
import CollectionFormPanel from "./CollectionFormPanel";
import ComponentFormPanel from "./ComponentFormPanel";
import ResponceNotification from "../../../../Modal/ResponceNotification";
import { useSelector } from "react-redux";
import { Stack } from "@mantine/core";
import { Route, Routes } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { findEntityDefinitionById } from "../../../../DataAccess/EntityDefinition";

const InstanceFormPanel = ({ formId, type, parentId }) => {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const [formDefinition, setFormDefinition] = useState(null);
  const [options, setOptions] = useState(null);
  const [panels, setPanels] = useState([]);
  const [relatedEntities, setRelatedEntities] = useState([]);
  const [widgetByPanel, setWidgetByPanel] = useState(new Map());
  const [widgetByName, setWidgetByName] = useState(new Map());
  const [formConfig, setFormConfig] = useState({});
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

  const createInitialValues = () => {
    const ret = {};
    panels?.forEach((p) => {
      const group = widgetByPanel?.get(p.id);
      group?.forEach((f) => {
        ret[f.name] = f.type === "TEXTINPUT" || f.widget === "TEXTAREA" ? "" : undefined;
      });
    });

    return ret;
  };

  const createValidations = () => {
    const ret = {};

    panels?.forEach((p) => {
      const group = widgetByPanel?.get(p.id);
      group?.forEach((f) => {
        if (f.required && f.required === "true") {
          ret[f.name] = (val) => (val ? null : t("validation.required"));
        }
      });
    });
    return ret;
  };

  useEffect(() => {
    if (formId) {
      getData();
    }
  }, [formId]);

  useEffect(() => {
    if (panels) {
      const config = {
        initialValues: createInitialValues(panels),
        validate: createValidations(panels),
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
                  />
                )}
              </Stack>
            }
          ></Route>
          {relatedEntities.map((re) => {
            //const collection = re.type === "COLLECTION<SUBFORM>" ? true : false;
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
