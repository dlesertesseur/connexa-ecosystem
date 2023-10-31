import { Stack } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { HEADER_HIGHT } from "../../../Constants";
import { useContext } from "react";
import { AbmStateContext } from "./Context";
import SimpleTable from "../../../Components/SimpleTable";
import Toolbar from "./Toolbar";

const BusinessProcessInstancePanel = () => {
  const { t } = useTranslation();
  const { onViewDiagram, onViewDocument, onViewLog, onViewSprints, setRowSelected, rowSelected, instances } =
    useContext(AbmStateContext);

  let col = 0;
  const cols = t("businessProcessInstances.columns.values", { returnObjects: true });
  const columns = [
    { headerName: cols[col++], fieldName: "name", align: "left" },
    { headerName: cols[col++], fieldName: "description", align: "left" },
    { headerName: cols[col++], fieldName: "advance", align: "right", format: "percentage", width: 160 },
  ];

  return (
    <Stack spacing={"xs"} mt={"xs"}>
      <Toolbar
        rowSelected={rowSelected}
        onViewDiagram={() => {
          onViewDiagram(rowSelected);
        }}
        onViewDocument={() => {
          onViewDocument(rowSelected);
        }}
        onViewLog={() => {
          onViewLog(rowSelected);
        }}
        onViewSprints={() => {
          onViewSprints(rowSelected);
        }}
      />
      <SimpleTable
        data={instances}
        columns={columns}
        rowSelected={rowSelected}
        setRowSelected={setRowSelected}
        headerHeight={HEADER_HIGHT + 64}
      />
    </Stack>
  );
};

export default BusinessProcessInstancePanel;
