import React, { useEffect } from "react";
import { Stack, Tabs } from "@mantine/core";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { HEADER_HIGHT } from "../../../../Constants";
import { useContext } from "react";
import { AbmStateContext } from "../Context";
import SimpleTable from "../../../../Components/SimpleTable";
import BusinessProcessModelInboxToolbar from "./BusinessProcessModelInboxToolbar";
import ConfigSprintTimesDialog from "./ConfigSprintTimesDialog";

const BusinessProcessModelPanel = ({ name }) => {
  const { t } = useTranslation();
  const [rowSelected, setRowSelected] = useState(null);
  const [processModel, setProcessModel] = useState(null);
  const [openCreateProcessInstance, setOpenCreateProcessInstance] = useState(false);

  const { processModelList } = useContext(AbmStateContext);

  let col = 0;
  const cols = t("businessProcessModelInbox.columns.processModel", { returnObjects: true });
  const columns = [
    { headerName: cols[col++], fieldName: "name", align: "left" },
    { headerName: cols[col++], fieldName: "description", align: "left" },
  ];

  useEffect(() => {
    if (processModelList) {
      const processModel = processModelList.find((mp) => mp.id === rowSelected);
      setProcessModel(processModel);
    }
  }, [rowSelected]);

  return (
    <>
      <ConfigSprintTimesDialog
        open={openCreateProcessInstance}
        close={() => {
          setOpenCreateProcessInstance(false);
        }}
        title={processModel?.name}
        businessProcessModelId={processModel?.id}
      />

      <Tabs.Panel value={name} pt="xs">
        <Routes>
          <Route
            path="/"
            element={
              <Stack spacing={"xs"}>
                <BusinessProcessModelInboxToolbar
                  rowSelected={rowSelected}
                  onCreate={() => {
                    setOpenCreateProcessInstance(true);
                  }}
                />
                <SimpleTable
                  data={processModelList}
                  columns={columns}
                  rowSelected={rowSelected}
                  setRowSelected={setRowSelected}
                  headerHeight={HEADER_HIGHT + 64}
                />
              </Stack>
            }
          />
        </Routes>
      </Tabs.Panel>
    </>
  );
};

export default BusinessProcessModelPanel;
