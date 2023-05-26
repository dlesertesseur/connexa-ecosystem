import { useEffect, useState } from "react";
import {
  Table,
  ScrollArea,
  Text,
  LoadingOverlay,
  Checkbox,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useWindowSize } from "../../Hook";

export default function CheckList({
  data,
  columns,
  loading = false,
  rowSelected,
  setRowSelected,
  onCheckRow,
  headerHeight,
  checkedRows
}) {
  const { t } = useTranslation();
  const wSize = useWindowSize();

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

  const rows = data?.map((row) => {
    const ret = (
      <tr
        key={row.id}
        onClick={() => {
          setRowSelected(row.id);
        }}
        style={{ backgroundColor: row.id === rowSelected ? "#74C0FC" : "" }}
      >
        <td key={"check"} align={"center"} width={36}>
          <Checkbox
            align={"center"}
            checked={checkedRows?.includes(row.id)}
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
      sx={{ height: wSize.height - headerHeight }}
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
