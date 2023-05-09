import { Group, Button, Stack, Divider } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ReactTabulator } from "react-tabulator";
import { useMemo } from "react";
import "tabulator-tables/dist/css/tabulator.min.css";

export default function CustomSortedTable({
  data,
  columns,
  filterControl = null,
  filterSelection = null,
  loading = false,
  enableCreateButton,
  rowSelected,
  setRowSelected,
  relationship,
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const createColumns = useMemo(() => {
    const ret = columns.map((c) => {
      if (c.type === "image") {
        const nc = {
          field: c.fieldName,
          title: c.headerName,
          formatter: "image",
          formatterParams: {
            height: "25px",
            urlPrefix: c.urlBase,
            urlSuffix: c.extention,
          },
        };
        return nc;
      } else {
        const nc = {
          field: c.fieldName,
          title: c.headerName,
        };
        return nc;
      }
    });

    return ret;
  }, [columns]);

  const convertData = useMemo(() => {
    const ret = data.map((d) => {
      const nd = { ...d };
      nd.image = d.image.substring(0, d.image.length - 4);
      return nd;
    });
    return ret;
  }, [data]);

  const rowClick = (e, row) => {
    setRowSelected(row.getData().id);
  };

  return (
    <Stack>
      <Group position="apart">
        <Group spacing="xs">
          <Button
            disabled={!enableCreateButton}
            onClick={() => {
              navigate("./create");
            }}
          >
            {t("label.crud.create")}
          </Button>
          <Button
            onClick={() => {
              navigate("./update");
            }}
            disabled={!rowSelected ? true : false}
          >
            {t("label.crud.update")}
          </Button>
          <Button
            onClick={() => {
              navigate("./delete");
            }}
            disabled={!rowSelected ? true : false}
          >
            {t("label.crud.delete")}
          </Button>

          {relationship ? <Divider orientation="vertical" /> : null}
          {relationship?.map((r) => (
            <Button
              key={r.path}
              onClick={() => {
                r.onPress ? r.onPress(r) : navigate("." + r.path);
              }}
              disabled={r.customState ? r.customState() : !rowSelected ? true : false}
            >
              {t(r.key)}
            </Button>
          ))}

          {filterControl !== null ? <Divider orientation="vertical" /> : null}
          {filterControl !== null ? filterControl : null}
        </Group>
      </Group>

      {filterSelection ? filterSelection : null}

      <ReactTabulator
        selectable={1}
        data={convertData}
        columns={createColumns}
        layout={"fitData"}
        height={500}
        events={{
          rowClick: rowClick,
        }}
      />
    </Stack>
  );
}
