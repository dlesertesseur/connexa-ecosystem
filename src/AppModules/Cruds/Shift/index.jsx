import React, { useEffect, useState } from "react";
import CrudFrame from "../../../Components/Crud/CrudFrame";
import moment from "moment/moment";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { CreatePage } from "./CreatePage";
import { UpdatePage } from "./UpdatePage";
import { DeletePage } from "./DeletePage";
import { FilterControl } from "./FilterControl";
import { findAllShiftsByStore } from "../../../DataAccess/Shift";
import { formatDateToDDMMYYYY } from "../../../Util";
import { Badge, Group } from "@mantine/core";
import { AbmStateContext } from "./Context";

const DynamicApp = ({ app }) => {
  const { user } = useSelector((state) => state.auth.value);

  const { t } = useTranslation();
  const [rows, setRows] = useState([]);
  const [retailId, setRetailId] = useState(null);
  const [storeId, setStoreId] = useState(null);
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filterSelection, setFilterSelection] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [opened, setOpened] = useState(false);
  const [reload, setReload] = useState(null);

  useEffect(() => {
    if(storeId && selectedDate && !opened){
      const params = {
        token: user.token,
        storeId: storeId,
        date: moment(selectedDate).format("YYYYMMDD"),
      };
  
      setLoading(true);
      findAllShiftsByStore(params).then((ret) => {
        setLoading(false);
        setRows(ret);
      });
    }
  }, [selectedDate, storeId, user, reload, opened]);

  const onFilter = (retailer, store) => {
    const formatedDate = formatDateToDDMMYYYY(selectedDate);
    setStore(store);

    const component = (
      <Group spacing="xs">
        <Badge variant="outline">{retailer.name}</Badge>
        <Badge variant="outline">{store.name}</Badge>
        <Badge variant="outline">{formatedDate}</Badge>
      </Group>
    );
    setFilterSelection(component);
  };

  let col = 0;
  const cols = t("crud.shift.columns", { returnObjects: true });
  const columns = [
    { headerName: cols[col++], fieldName: "job", align: "left" },
    { headerName: cols[col++], fieldName: "startDateAndTime", align: "center" },
    { headerName: cols[col++], fieldName: "endDateAndTime", align: "center" },
    { headerName: cols[col++], fieldName: "pauseName", align: "left" },
    { headerName: cols[col++], fieldName: "pauseStartDateAndTime", align: "center" },
    { headerName: cols[col++], fieldName: "pauseEndDateAndTime", align: "center" },
    { headerName: cols[col++], fieldName: "startDate", align: "center" },
    { headerName: cols[col++], fieldName: "endDate", align: "center" },
  ];

  const ret = rows ? (
    <AbmStateContext.Provider value={{ reload, setReload, selectedDate, store, selectedRowId }}>
      <CrudFrame
        app={app}
        columns={columns}
        data={rows}
        rowSelected={selectedRowId}
        setRowSelected={(id) => {
          setSelectedRowId(id);
        }}
        enableCreateButton={retailId && storeId && selectedDate && !opened}
        createPage={<CreatePage />}
        updatePage={<UpdatePage />}
        deletePage={<DeletePage />}
        filterControl={
          <FilterControl
            onFilter={onFilter}
            retailId={retailId}
            setRetailId={setRetailId}
            storeId={storeId}
            setStoreId={setStoreId}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            opened={opened}
            setOpened={setOpened}
            loading={loading}
            disabled={false}
          />
        }
        filterSelection={filterSelection}
      />
    </AbmStateContext.Provider>
  ) : null;

  return ret;
};

export default DynamicApp;
