import { Badge, Group, Paper, Stack, Text } from "@mantine/core";
import { useContext, useEffect, useState } from "react";
import { EntityLayoutContext } from "../../Context";
import { findEntityDefinitionById } from "../../../../../DataAccess/EntityDefinition";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import SimpleTableComponent from "../../../../../Components/SimpleTableComponent";

// eslint-disable-next-line react/prop-types
const ItemEntityList = ({ field }) => {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const { selectedField, setSelectedField, setSelectedPanel } = useContext(EntityLayoutContext);
  const [entity, setEntity] = useState(null);
  const [columns, setColumns] = useState([]);

  const getData = async () => {
    const params = { token: user.token, id: field.entity };

    const ret = await findEntityDefinitionById(params);
    setEntity(ret);

    const columns = ret.fields.map((f, index) => {
      const obj = { headerName: f.description, fieldName: f.name, align: "left" };
      return obj;
    });

    setColumns(columns);
  };

  useEffect(() => {
    if (field.entity) {
      getData();
    }
  }, [field.entity]);

  const getCompoentHeigth = (height) => {
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

  return (
    <Paper
      w={"100%"}
      p={0}
      withBorder
      spacing={3}
      bg={selectedField?.id === field.id ? "blue.2" : "gray.2"}
      onMouseDown={(e) => {
        setSelectedField(field);
        setSelectedPanel(null);
        e.stopPropagation();
      }}
    >
      <Group spacing={"xs"} >
        <Stack spacing={"xs"} p={"xs"} w={"100%"}>
          <Group spacing={"xs"} position="apart">
            <Text size={"md"}>{field.label}</Text>
            <Badge variant="outline" color="blue">
              {entity?.name}
            </Badge>
          </Group>

          <SimpleTableComponent
            data={[]}
            columns={columns}
            // rowSelected={rowSelected}
            // setRowSelected={setRowSelected}
            height={getCompoentHeigth(field.height)}
            disabled={true}
          />
        </Stack>
      </Group>
    </Paper>
  );
};

export default ItemEntityList;
