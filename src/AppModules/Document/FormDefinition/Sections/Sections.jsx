import React, { useEffect, useState } from "react";
import ResponceNotification from "../../../../Modal/ResponceNotification";
import SortedTable from "../../../../Components/Crud/SortedTable";
import FormDefinitionHeader from "../FormDefinitionHeader";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { CreatePage } from "./CreatePage";
import { UpdatePage } from "./UpdatePage";
import { DeletePage } from "./DeletePage";
import { SectionStateContext, AbmStateContext } from "../Context";
import { Route, Routes, useNavigate } from "react-router-dom";
import { HEADER_HIGHT } from "../../../../Constants";
import { Stack } from "@mantine/core";
import { useContext } from "react";
import { findFormDefinitionById } from "../../../../DataAccess/FormDefinition";
import { DOCUMENTS } from "../../../../Constants/DOCUMENTS";
import { findAllEntityDefinition } from "../../../../DataAccess/EntityDefinition";

const Sections = () => {
  const { user } = useSelector((state) => state.auth.value);
  const { selectedRowId } = useContext(AbmStateContext);
  const { t } = useTranslation();
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [reloadSections, setReloadSections] = useState(null);
  const [formDefinition, setFormDefinition] = useState(null);
  const navigate = useNavigate();

  const [entities, setEntities] = useState(null);
  const [relations, setRelations] = useState(null);

  const HEADER = 32;

  const getAditionalData = async () => {
    const params = { token: user.token };
    let ret = await findAllEntityDefinition(params);
    setEntities(
      ret.map((p) => {
        return { value: p.id, label: p.name };
      })
    );

    const relations = DOCUMENTS.relations.map((p) => {
      return { value: p.id, label: p.name };
    });
    setRelations(relations);
  };

  useEffect(() => {
    getAditionalData();
  }, []);

  const getData = async () => {
    const params = { token: user.token, id: selectedRowId };
    let ret = await findFormDefinitionById(params);

    setFormDefinition(ret);
    if (ret?.sections) {
      const data = ret.sections.map((s) => {
        const entity = entities?.find((e) => e.value === s.entity);
        const name = entity ? entity.label : "NOT FOUND";

        const relation = relations?.find((e) => e.value === s.relation);
        const relacionName = relation ? relation.label : "NOT FOUND";

        const row = { ...s, entityName: name, relationName: relacionName };
        return row;
      });

      setRows(data);
    }
  };

  useEffect(() => {
    getData();
  }, [selectedRowId, reloadSections, entities]);

  let col = 0;
  const cols = t("document.section.columns", { returnObjects: true });
  const columns = [
    { headerName: cols[col++], fieldName: "name", align: "left" },
    { headerName: cols[col++], fieldName: "entityName", align: "left" },
    { headerName: cols[col++], fieldName: "relationName", align: "left" },
  ];

  const ret = rows ? (
    <SectionStateContext.Provider
      value={{
        reloadSections,
        setReloadSections,
        selectedSectionId,
        setSelectedSectionId,
        entities,
        relations,
        rows,
      }}
    >
      <Stack spacing={"xs"}>
        <Stack
          justify="flex-start"
          sx={(theme) => ({
            backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
          })}
        >
          <FormDefinitionHeader text={t("document.formDefinition.label.sections")} formDefinition={formDefinition} />

          <Routes>
            <Route
              path="/"
              element={
                <SortedTable
                  data={rows}
                  columns={columns}
                  loading={loading}
                  enableCreateButton={true}
                  rowSelected={selectedSectionId}
                  setRowSelected={setSelectedSectionId}
                  headerHeight={HEADER_HIGHT + HEADER + 32}
                  backButton={() => {
                    navigate("../");
                  }}
                />
              }
            ></Route>
            <Route path="create" element={<CreatePage formDefinitionId={formDefinition?.id} />} />
            <Route path="update" element={<UpdatePage formDefinitionId={formDefinition?.id} />} />
            <Route path="delete" element={<DeletePage formDefinitionId={formDefinition?.id} />} />
          </Routes>
        </Stack>
      </Stack>

      <ResponceNotification
        opened={error ? true : false}
        onClose={() => {
          setError(null);
        }}
        code={error}
        title={t("status.error")}
        text={error}
      />
    </SectionStateContext.Provider>
  ) : null;

  return ret;
};

export default Sections;
