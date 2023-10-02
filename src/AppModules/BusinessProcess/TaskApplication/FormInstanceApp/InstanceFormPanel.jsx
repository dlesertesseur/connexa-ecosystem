import React, { useEffect, useState } from "react";
import CollectionFormPanel from "./CollectionFormPanel";
import ComponentFormPanel from "./ComponentFormPanel";
import InstanceFormContex from "./Context";
import uuid from "react-uuid";
import { useSelector } from "react-redux";
import { Group } from "@mantine/core";
import { Route, Routes } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { findFormInstanceById, updateFormInstance } from "../../../../DataAccess/FormInstance";
import { findDataSourceById } from "../../../../DataAccess/DataSource";
import ResponceNotification from "../../../../Modal/ResponceNotification";

const InstanceFormPanel = ({ formId, collection, parentId }) => {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const [formDefinition, setFormDefinition] = useState(null);
  const [options, setOptions] = useState(null);
  const [panels, setPanels] = useState([]);
  const [data, setDate] = useState([]);
  const [relatedEntities, setRelatedEntities] = useState([]);
  const [records, setRecords] = useState([]);
  const [widgetByPanel, setWidgetByPanel] = useState(new Map());
  const [widgetByName, setWidgetByName] = useState(new Map());
  const [formConfig, setFormConfig] = useState({});
  const [reloadData, setReloadData] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [datasourceValuesById, setDatasourceValuesById] = useState(new Map());
  const [error, setError] = useState(null);

  const storeDataSourceData = async (dataSourcesId) => {
    const dataMap = new Map();
    for (let index = 0; index < dataSourcesId.length; index++) {
      const id = dataSourcesId[index];

      const params = {
        token: user.token,
        id: id,
      };

      const datasource = await findDataSourceById(params);
      if (datasource) {
        const ret = datasource.children?.map((d) => {
          return { value: d.id, label: d.name };
        });

        if (ret) {
          dataMap.set(id, ret);
        }
      }
    }
    return dataMap;
  };

  const getData = async () => {
    const params = { token: user.token, id: formId };
    const ret = await findFormInstanceById(params);
    const dataSourcesId = [];
    try {
      const options = await JSON.parse(ret?.options);
      setOptions(options);
    } catch (error) {
      console.log("error ->", error);
      setOptions({ size: "md" });
    }

    const panels = [];
    const collections = [];
    const records = [];
    const widgetByPanel = new Map();

    ret?.children?.forEach(async (field) => {
      switch (field.type) {
        case "COLLECTION<SUBFORM>":
        case "SUBFORM":
          collections.push(field);
          break;

        case "RECORD":
          records.push(field);
          break;

        case "SELECT":
          if (field.datasourceId) {
            dataSourcesId.push(field.datasourceId);
          }
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

    const dataMap = await storeDataSourceData(dataSourcesId);

    setPanels(panels);
    setWidgetByPanel(widgetByPanel);
    setRelatedEntities(collections);
    setFormDefinition(ret);
    setRecords(records);
    setWidgetByName(widgetByName);
    setDatasourceValuesById(dataMap);
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

  useEffect(() => {
    const data = records?.map((r) => {
      const obj = {};
      r.children.forEach((c) => {
        obj[c.name] = c.value;
      });
      obj.id = r.id;
      return obj;
    });

    setDate(data);
  }, [records]);

  const onCreate = async (parentId, values) => {
    let params = { token: user.token, id: parentId };
    const parent = await findFormInstanceById(params);

    if (parent.error) {
      throw parent.error;
    } else {
      const list = Object.entries(values);
      const children = [];

      list.forEach((e, index) => {
        const obj = {
          id: uuid(),
          description: "",
          label: "",
          name: e[0],
          options: "",
          order_in_row: 0,
          required: "true",
          row: index,
          type: "VALUE",
          value: e[1],
        };
        children.push(obj);
      });

      const reg = {
        id: uuid(),
        description: "",
        label: "",
        name: "",
        options: "",
        order_in_row: null,
        required: "true",
        row: null,
        type: "RECORD",
        value: null,
        parent_id: parentId,
        children: children,
      };

      parent.children.push(reg);

      params = { token: user.token, body: parent };
      const ret = await updateFormInstance(params);
    }
  };

  const onUpdate = async (parentId, rowId, values) => {
    let params = { token: user.token, id: parentId };
    const parent = await findFormInstanceById(params);

    const children = parent.children;

    const found = children.find((c) => c.id === rowId);
    if (found) {
      found.children.forEach((c) => {
        c.value = values[c.name];
      });

      params = { token: user.token, body: parent };
      const ret = await updateFormInstance(params);
      if (ret.error) {
        throw ret.error;
      }
    }
  };

  const onDelete = async (parentId, rowId) => {
    let params = { token: user.token, id: parentId };
    const parent = await findFormInstanceById(params);

    const children = parent.children;

    const toSave = children.filter((c) => c.id !== rowId);
    parent.children = toSave;

    params = { token: user.token, body: parent };
    const ret = await updateFormInstance(params);
    if (ret.error) {
      throw ret.error;
    }
  };

  const onCompleteForm = async (formId, values) => {
    let params = { token: user.token, id: formId };
    const form = await findFormInstanceById(params);

    if (form.error) {
      throw form.error;
    } else {
      const children = form.children;

      children.forEach((c) => {
        c.value = values[c.name];
      });

      params = { token: user.token, body: form };
      const ret = await updateFormInstance(params);
      if (ret.error) {
        throw ret.error;
      }
    }
  };

  return (
    <InstanceFormContex.Provider
      value={{
        onCreate,
        onUpdate,
        onDelete,
        onCompleteForm,
        setReloadData,
        confirmModalOpen,
        setConfirmModalOpen,
        datasourceValuesById,
        setError,
      }}
    >
      <Routes>
        <Route
          path="/*"
          element={
            <Group grow>
              {collection ? (
                <CollectionFormPanel
                  formData={formDefinition}
                  options={options}
                  panels={panels}
                  widgetByPanel={widgetByPanel}
                  formConfig={formConfig}
                  relatedEntities={relatedEntities}
                  parentId={formId}
                  data={data}
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
                  selectedRowId={formDefinition?.id}
                  mode={"FORM"}
                />
              )}
            </Group>
          }
        ></Route>
        {relatedEntities.map((re) => {
          const collection = re.type === "COLLECTION<SUBFORM>" ? true : false;
          return (
            <Route
              key={re.options}
              path={`${re.name}/*`}
              element={<InstanceFormPanel formId={re.options} collection={collection} parentId={formId} />}
            />
          );
        })}
      </Routes>

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
