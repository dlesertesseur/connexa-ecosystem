import { Button, Group, Stack, Text } from "@mantine/core";
import { findEntityDefinitionById } from "../../../../../DataAccess/EntityDefinition";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useEffect } from "react";
import { useWindowSize } from "../../../../../Hook";
import SimpleTableComponent from "../../../../../Components/SimpleTableComponent";
import ViewLayoutModal from "../ViewLayoutModal";

// eslint-disable-next-line react/prop-types
const EntityList = ({ field, rowSelected, setRowSelected }) => {
  const { t } = useTranslation();
  const wsize = useWindowSize();
  const { user } = useSelector((state) => state.auth.value);
  const [entity, setEntity] = useState(null);
  const [columns, setColumns] = useState([]);
  const [openView, setOpenView] = useState(false);

  const [panels, setPanels] = useState(null);
  const [widgetByPanel, setWidgetByPanel] = useState(null);

  const processEntity = (entity) => {
    if (entity) {
      const table = new Map();
      const rows = entity.fields;
      const order = [];

      rows?.forEach((field) => {
        const fields = table.get(field.row);
        if (fields !== undefined) {
          table.set(`panel-${field.row}`, [...fields, field]);
        } else {
          table.set(`panel-${field.row}`, [field]);
          order.push(field.row);
        }
      });

      order.sort();

      setPanels(
        order.map((p) => {
          return { id: `panel-${p}` };
        })
      );
      setWidgetByPanel(table);

      console.log("EntityList processEntity entity ->", entity);
    }
  };

  const getData = async () => {
    const params = { token: user.token, id: field.entity };

    const ret = await findEntityDefinitionById(params);
    setEntity(ret);

    const columns = ret.fields.map((f, index) => {
      const obj = { headerName: f.description, fieldName: f.name, align: "left" };
      return obj;
    });

    processEntity(ret);

    setColumns(columns);
  };

  useEffect(() => {
    if (field.entity) {
      getData();
    }
  }, [field.entity]);

  const getComponetHeigth = (height) => {
    let ret = null;

    switch (height) {
      case 2:
        ret = 100;
        break;
      case 3:
        ret = 250;
        break;
      case 4:
        ret = 500;
        break;
    }
    return ret;
  };

  const onCreateEntity = (e) => {
    setOpenView(true);
  };

  return (
    <>
      {entity ? (
        <ViewLayoutModal
          fullScreen={false}
          open={openView}
          close={() => {
            setOpenView(false);
          }}
          name={entity.name}
          size={entity.size}
          panels={panels}
          widgetByPanel={widgetByPanel}
          onAccept={() => {
            console.log("nuevo producto");
          }}
          height={wsize.height - 220}
        />
      ) : null}
      <Group spacing={"xs"}>
        <Stack spacing={"xs"} w={"100%"}>
          <Group spacing={"xs"} position="apart">
            <Text size={"md"}>{field.description}</Text>
          </Group>

          <Group spacing={"xs"} position="left">
            <Button onClick={onCreateEntity}>{t("label.crud.create")}</Button>
            <Button disabled={!rowSelected}>{t("label.crud.update")}</Button>
            <Button disabled={!rowSelected}>{t("label.crud.delete")}</Button>
          </Group>

          <SimpleTableComponent
            data={[]}
            columns={columns}
            rowSelected={rowSelected}
            setRowSelected={setRowSelected}
            height={getComponetHeigth(field.height)}
            disabled={true}
          />
        </Stack>
      </Group>
    </>
  );
};

export default EntityList;
