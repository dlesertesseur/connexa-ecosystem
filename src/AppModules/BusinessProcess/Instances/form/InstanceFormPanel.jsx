import React, { useEffect, useState } from "react";
import CollectionFormPanel from "./CollectionFormPanel";
import ComponentFormPanel from "./ComponentFormPanel";
import ResponceNotification from "../../../../Modal/ResponceNotification";
import { useSelector } from "react-redux";
import { Stack, Tabs } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { findEntityDefinitionById } from "../../../../DataAccess/EntityDefinition";

const InstanceFormPanel = ({ formId, type, parentId, deltaY = 0 }) => {
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

  // const createValidations = () => {
  //   const ret = {};

  //   panels?.forEach((p) => {
  //     const group = widgetByPanel?.get(p.id);
  //     group?.forEach((f) => {
  //       if (f.required && f.required === "true") {
  //         ret[f.name] = (val) => (val ? null : t("validation.required"));
  //       }
  //     });
  //   });
  //   return ret;
  // };

  useEffect(() => {
    if (formId) {
      getData();
    }
  }, [formId]);

  useEffect(() => {
    if (panels) {
      const config = {
        initialValues: createInitialValues(panels),
        //validate: createValidations(panels),
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
      {relatedEntities && relatedEntities.length > 0 ? (
        <Tabs variant="outline" defaultValue="base">
          <Tabs.List>
            <Tabs.Tab value="base">
              {t("businessProcessInstances.label.general")}
            </Tabs.Tab>

            {relatedEntities.map((re) => {
              return (
                <Tabs.Tab key={re.options} value={re.options}>
                  {re.label}
                </Tabs.Tab>
              );
            })}
          </Tabs.List>

          <Tabs.Panel value="base">
            <Stack spacing={"xs"}>
              {isACollectionObjects() ? (
                <CollectionFormPanel
                  formData={formDefinition}
                  options={options}
                  panels={panels}
                  widgetByPanel={widgetByPanel}
                  formConfig={formConfig}
                  parentId={parentId}
                  widgetByName={widgetByName}
                  deltaY={deltaY}
                />
              ) : (
                <ComponentFormPanel
                  formData={formDefinition}
                  options={options}
                  panels={panels}
                  widgetByPanel={widgetByPanel}
                  formConfig={formConfig}
                  parentId={parentId}
                  widgetByName={widgetByName}
                  mode={type}
                  deltaY={deltaY}
                />
              )}
            </Stack>
          </Tabs.Panel>

          {relatedEntities.map((re) => {
            return (
              <Tabs.Panel key={re.options} value={re.options}>
                <InstanceFormPanel formId={re.options} type={re.type} parentId={parentId} deltaY={deltaY}/>
              </Tabs.Panel>
            );
          })}
        </Tabs>
      ) : (
        <Stack spacing={"xs"}>
          {isACollectionObjects() ? (
            <CollectionFormPanel
              formData={formDefinition}
              options={options}
              panels={panels}
              widgetByPanel={widgetByPanel}
              formConfig={formConfig}
              parentId={parentId}
              widgetByName={widgetByName}
              deltaY={deltaY}
            />
          ) : (
            <ComponentFormPanel
              formData={formDefinition}
              options={options}
              panels={panels}
              widgetByPanel={widgetByPanel}
              formConfig={formConfig}
              parentId={parentId}
              widgetByName={widgetByName}
              mode={type}
              deltaY={deltaY}
            />
          )}
        </Stack>
      )}
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
