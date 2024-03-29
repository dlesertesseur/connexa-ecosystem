import React, { useEffect, useState } from "react";
import CollectionFormPanel from "./CollectionFormPanel";
import ComponentFormPanel from "./ComponentFormPanel";
import InstanceFormContex from "./Context";
import uuid from "react-uuid";
import ResponceNotification from "../../../../Modal/ResponceNotification";
import { useSelector } from "react-redux";
import { Stack } from "@mantine/core";
import { Route, Routes } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { findFormInstanceById, updateFormInstance } from "../../../../DataAccess/FormInstance";
import { findEntityDefinitionById } from "../../../../DataAccess/EntityDefinition";
import { arrayToMapByProp } from "../../../../Util";

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
  const [reloadData, setReloadData] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
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
        if (f.required && f.required === 'true') {
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
  }, [formId, reloadData]);

  useEffect(() => {
    if (panels) {
      const config = {
        initialValues: createInitialValues(panels),
        validate: createValidations(panels),
      };
      setFormConfig(config);
    }
  }, [panels]);

  const createObject = (name, type) => {
    const ret = {
      id: uuid(),
      type: type,
      name: name,
      label: "NA",
      description: "NA",
      required: false,
      options: "NA",
      children: [],
      row: 0,
      orderInRow: 0,
      datasourceId: null,
      relatedField: null,
      defaultValue: null,
    };

    return ret;
  };

  const onCreate = async (parentId, formData, values) => {
    let params = { token: user.token, id: parentId };
    const instanceNode = await findFormInstanceById(params);

    if (instanceNode.error) {
      throw instanceNode.error;
    } else {
      const collectionName = `COLLECTION<${formData.name}>`;
      let collection = instanceNode.children.find((c) => c.name === collectionName);

      if (!collection) {
        collection = createObject(collectionName, "COLLECTION");
        instanceNode.children.push(collection);
      }

      const record = { ...formData };
      record.id = uuid();
      record.parentId = null;

      const children = record.children;
      const subformFieldsByName = arrayToMapByProp("name", children);
      const valuesList = Object.entries(values);

      valuesList.forEach((v) => {
        const instanceValue = subformFieldsByName.get(v[0]);
        if (instanceValue) {
          instanceValue.id = uuid();
          instanceValue.parentId = null;
          instanceValue.value = v[1];
        }
      });

      collection.children.push(record);
      params = { token: user.token, body: instanceNode };
      const ret = await updateFormInstance(params);
    }
  };

  const onUpdate = async (formData, parentId, rowId, values) => {
    let params = { token: user.token, id: parentId };
    const instanceNode = await findFormInstanceById(params);

    if (instanceNode.error) {
      throw instanceNode.error;
    } else {
      const collectionName = `COLLECTION<${formData.name}>`;
      let collection = instanceNode.children.find((c) => c.name === collectionName);

      if (collection !== undefined) {
        const found = collection.children.find((c) => c.id === rowId);
        if (found) {
          found.children.forEach((c) => {
            c.value = values[c.name];
          });
        }
      }

      params = { token: user.token, body: instanceNode };
      const ret = await updateFormInstance(params);
    }
  };

  const onDelete = async (formData, parentId, rowId) => {
    let params = { token: user.token, id: parentId };
    const instanceNode = await findFormInstanceById(params);

    if (instanceNode.error) {
      throw instanceNode.error;
    } else {
      const collectionName = `COLLECTION<${formData.name}>`;
      let collection = instanceNode.children.find((c) => c.name === collectionName);

      if (collection !== undefined) {
        const data = collection.children.filter((c) => c.id !== rowId);
        collection.children = data;

        params = { token: user.token, body: instanceNode };
        const ret = await updateFormInstance(params);
      }
    }
  };

  const onCompleteForm = async (parentId, values) => {
    let params = { token: user.token, id: parentId };
    const instanceNode = await findFormInstanceById(params);

    if (instanceNode.error) {
      throw instanceNode.error;
    } else {
      const children = instanceNode.children;

      const instanceValuesByName = arrayToMapByProp("name", children);
      const valuesList = Object.entries(values);

      valuesList.forEach((v) => {
        const instanceValue = instanceValuesByName.get(v[0]);
        if (instanceValue) {
          instanceValue.value = v[1];
        } else {
          const widget = widgetByName.get(v[0]);
          if (widget) {
            const obj = { ...widget };
            obj.id = uuid();
            obj.value = v[1];
            children.push(obj);
          }
        }
      });

      instanceNode.children = children;
      params = { token: user.token, body: instanceNode };
      const ret = await updateFormInstance(params);
      if (ret.error) {
        throw ret.error;
      }
    }
  };

  const onCompleteSubForm = async (formData, parentId, values) => {
    let params = { token: user.token, id: parentId };
    const instanceNode = await findFormInstanceById(params);

    if (instanceNode.error) {
      throw instanceNode.error;
    } else {
      const valuesList = Object.entries(values);

      const subformName = `SUBFORM<${formData.name}>`;
      let subform = instanceNode.children.find((c) => c.name === subformName);
      if (!subform) {
        subform = createObject(subformName, "SUBFORM");
        instanceNode.children.push(subform);
      }

      const subformChildren = subform.children;

      const subformValuesByName = arrayToMapByProp("name", subform.children);

      valuesList.forEach((v) => {
        const subformValue = subformValuesByName.get(v[0]);
        if (subformValue) {
          subformValue.value = v[1];
        } else {
          const widget = widgetByName.get(v[0]);
          if (widget) {
            const obj = { ...widget };
            obj.id = uuid();
            obj.value = v[1];
            subformChildren.push(obj);
          }
        }
      });

      params = { token: user.token, body: instanceNode };
      const ret = await updateFormInstance(params);
      if (ret.error) {
        throw ret.error;
      }
    }
  };

  const isACollectionObjects = () => {
    const ret = type === "COLLECTION<SUBFORM>" ? true : false;
    return ret;
  };

  return (
    <InstanceFormContex.Provider
      value={{
        onCreate,
        onUpdate,
        onDelete,
        onCompleteForm,
        onCompleteSubForm,
        setReloadData,
        confirmModalOpen,
        setConfirmModalOpen,
        // datasourceValuesById,
        setError,
      }}
    >
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
    </InstanceFormContex.Provider>
  );
};

export default InstanceFormPanel;
