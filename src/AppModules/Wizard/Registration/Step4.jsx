import { Title, Stack } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { findAllRoles } from "../../../DataAccess/Roles";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useContext } from "react";
import { AbmStateContext } from "./Context";
import ButtonsPanel from "./ButtonsPanel";
import ResponceNotification from "../../../Modal/ResponceNotification";
import CheckList from "../../../Components/Crud/CheckList";

export function Step4({ title, active, setActive, onCancel }) {
  const { t } = useTranslation();
  const [role, setRole] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [errorCode, setErrorCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rowSelected, setRowSelected] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const { wizardData, setWizardData, stepHeader } = useContext(AbmStateContext);

  const { user } = useSelector((state) => state.auth.value);

  const cols = t("crud.role.columns", { returnObjects: true });
  const columns = [
    { headerName: cols[1], fieldName: "name", align: "left" },
    { headerName: cols[2], fieldName: "groupName", align: "left" },
  ];

  const onCheckRow = (rowId, check) => {
    const data = [...selectedRows];
    if (check) {
      data.push(rowId);
    } else {
      const index = data.indexOf(rowId);
      if (index !== -1) {
        data.splice(index, 1);
      }
    }
    setSelectedRows(data);
  };

  const findData = async () => {
    let filter = null;
    const params = { token: user.token };
    setLoading(true);

    try {
      const role = await findAllRoles(params);
      
      //Order by name and groupName
      role.sort((a, b) => {
        const vA = a.name.toUpperCase() + "-" + a.groupName.toUpperCase();
        const vB = b.name.toUpperCase() + "-" + b.groupName.toUpperCase();
        if (vA < vB) {
          return -1;
        }
        if (vA > vB) {
          return 1;
        }
        return 0;
      });

      // Filter only role selected in step3
      if (wizardData && wizardData.step3) {
        filter = role.filter((r) => wizardData.step3.includes(r.id));
      } else {
        filter = role;
      }

      if (wizardData && wizardData.step4) {
        setSelectedRows( wizardData.step4);
      }

      setRole(filter);
    } catch (error) {
      setErrorMessage(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    findData();
  }, []);

  const validate = () => {
    let ret = false;
    if (selectedRows && selectedRows.length > 0) {
      const data = { ...wizardData };
      data.step4 = [...selectedRows];
      setWizardData(data);
      ret = true;
    } else {
      setErrorCode("ERROR");
      setErrorMessage(t("errors.listCheckValidation"));
    }

    return(ret);
  };

  const nextStep = () => {
    validate();
    setActive(active + 1);
  };

  const prevStep = () => {
    setActive(active - 1);
  };

  return (
    <Stack
      justify="stretch"
      spacing="xs"
      sx={(theme) => ({
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[8]
            : theme.colors.gray[0],
        height: "100%",
        width: "100%",
      })}
    >
      <Title
        mt={"lg"}
        mb={"lg"}
        order={2}
        align="center"
        sx={(theme) => ({
          fontFamily: `Greycliff CF, ${theme.fontFamily}`,
          fontWeight: 700,
        })}
      >
        {title}
      </Title>

      <CheckList
        data={role}
        columns={columns}
        loading={loading}
        rowSelected={rowSelected}
        setRowSelected={setRowSelected}
        onCheckRow={onCheckRow}
        headerHeight={stepHeader}
        checkedRows={selectedRows ? selectedRows : []}
      />

      {role ? (
        <ButtonsPanel
          onCancel={onCancel}
          prevStep={prevStep}
          nextStep={nextStep}
        />
      ) : null}

      {errorCode ? (
        <ResponceNotification
          opened={errorCode}
          onClose={() => {
            setErrorCode(null);
            setErrorMessage(null);
          }}
          code={errorCode}
          title={t("errors.title")}
          text={errorMessage}
        />
      ) : null}
    </Stack>
  );
}
