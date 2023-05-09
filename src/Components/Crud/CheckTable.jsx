import { useEffect, useState } from "react";
import {
  Table,
  ScrollArea,
  Text,
  LoadingOverlay,
  Checkbox,
} from "@mantine/core";
import { useTranslation } from "react-i18next";

export default function CheckTable({
  data,
  columns,
  loading = false,
  rowSelected,
  setRowSelected,
  onCheckRow,
  height,
}) {
  const { t } = useTranslation();

  const [sortedData, setSortedData] = useState(null);

  useEffect(() => {
    setSortedData(data);
  }, [data]);

  const formatData = (data, format) => {
    let ret = data;

    if (format) {
      switch (format) {
        case "round":
          ret = Math.round(data * 100) / 100;
          break;
        case "bool":
          ret = data ? t("label.true") : t("label.false");
          break;

        default:
          break;
      }
    }
    return ret;
  };

  const rows = sortedData?.map((row) => {
    const ret = (
      <tr
        key={row.id}
        onClick={() => {
          setRowSelected(row.id);
        }}
        style={{ backgroundColor: row.id === rowSelected ? "#74C0FC" : "" }}
      >
        <td key={"check"} align={"center"}>
          <Checkbox
            align={"center"}
            checked={row.checked}
            onChange={(event) => onCheckRow(row.id, event.currentTarget.checked)}
          />
        </td>
        {columns.map((f) => (
          <td key={f.fieldName} align={f.align ? f.align : "center"}>
            {formatData(row[f.fieldName], f.format)}
          </td>
        ))}
      </tr>
    );

    return ret;
  });

  return (
    <ScrollArea
      sx={{ height: height }}
      //onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
    >
      <LoadingOverlay visible={loading} overlayBlur={2} />

      <Table
        horizontalSpacing="xs"
        verticalSpacing="xs"
        striped
        highlightOnHover
        withBorder
        withColumnBorders
      >
        <tbody>
          {rows?.length > 0 ? (
            rows
          ) : (
            <tr>
              <td colSpan={Object.keys(columns).length}>
                <Text weight={500} align="center">
                  {t("label.noData")}
                </Text>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </ScrollArea>
  );
}
