import React, { useEffect, useState } from "react";
import CollectionFormPanel from "./CollectionFormPanel";
import ComponentFormPanel from "./ComponentFormPanel";
import { findEntityDefinitionById } from "../../../../DataAccess/EntityDefinition";
import { useSelector } from "react-redux";
import { Group } from "@mantine/core";
import { Route, Routes } from "react-router-dom";
import { useTranslation } from "react-i18next";

const FormPanel = ({ formId, collection, parentId }) => {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const [formDefinition, setFormDefinition] = useState(null);
  const [options, setOptions] = useState(null);
  const [panels, setPanels] = useState([]);
  const [relatedEntities, setRelatedEntities] = useState([]);
  const [widgetByPanel, setWidgetByPanel] = useState(new Map());
  const [formConfig, setFormConfig] = useState({});

  const getData = async () => {
    const params = { token: user.token, id: formId };
    const ret = await findEntityDefinitionById(params);

    try {
      const options = await JSON.parse(ret.options);
      setOptions(options);
    } catch (error) {
      console.log("error ->", error);
      setOptions({ size: "md" });
    }

    const panels = [];
    const collections = [];
    const widgetByPanel = new Map();

    ret?.children?.forEach((field) => {
      if (field.type === "COLLECTION<SUBFORM>" || field.type === "SUBFORM") {
        collections.push(field);
      } else {
        const id = `panel-${field.row}`;
        const group = widgetByPanel.get(id);

        if (group !== undefined) {
          widgetByPanel.set(id, [...group, field]);
        } else {
          widgetByPanel.set(id, [field]);
          panels.push({ id: id });
        }
      }
    });

    setPanels(panels);
    setWidgetByPanel(widgetByPanel);
    setRelatedEntities(collections);
    setFormDefinition(ret);
  };

  const createInitialValues = () => {
    const ret = {};
    panels?.forEach((p) => {
      const group = widgetByPanel?.get(p.id);
      group?.forEach((f) => {
        ret[f.name] = f.type === "TEXTINPUT" || f.widget === "TEXTAREA" ? "" : null;
      });
    });

    return ret;
  };

  const createValidations = () => {
    const ret = {};

    panels?.forEach((p) => {
      const group = widgetByPanel?.get(p.id);
      group?.forEach((f) => {
        if (f.required) {
          ret[f.name] = (val) => (val ? null : t("validation.required"));
        }
      });
    });
    return ret;
  };

  useEffect(() => {
    getData();
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

  return (
    <Routes>
      <Route
        path="/*"
        element={
          <Group grow sx={{ border: "1px solid #e5e5e5", borderRadius: 6 }}>
            {collection ? (
              <CollectionFormPanel
                formData={formDefinition}
                options={options}
                panels={panels}
                widgetByPanel={widgetByPanel}
                formConfig={formConfig}
                relatedEntities={relatedEntities}
                parentId={parentId}
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
              />
            )}
          </Group>
        }
      ></Route>
      {relatedEntities.map((re) => {
        const collection = re.type === "COLLECTION<SUBFORM>" ? true : false;
        return (
          <Route
            key={re.id}
            path={`${re.name}/*`}
            element={<FormPanel formId={re.options} collection={collection} parentId={formId} />}
          />
        );
      })}
    </Routes>
  );
};

export default FormPanel;
