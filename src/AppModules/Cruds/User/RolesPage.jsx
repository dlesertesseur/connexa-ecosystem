import ResponceNotification from "../../../Modal/ResponceNotification";
import CheckTable from "../../../Components/Crud/CheckTable";
import { Title, LoadingOverlay, Button, Stack, Group } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { findAllRoles } from "../../../DataAccess/Roles";
import { findUserById } from "../../../DataAccess/User";
import { AbmStateContext } from "./Context";
import { useContext } from "react";

export function RolesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setReload, selectedRowId } = useContext(AbmStateContext);
  const [errorMessage, setErrorMessage] = useState(null);
  const [errorCode, setErrorCode] = useState(null);
  const [selectedRole, setSelectedRole] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useSelector((state) => state.auth.value);

  const [rowSelected, setRowSelected] = useState(null);

  const cols = t("crud.role.columns", { returnObjects: true });
  const columns = [
    { headerName: cols[1], fieldName: "name", align: "left" },
    { headerName: cols[2], fieldName: "context", align: "left" },
  ];

  const onUpdate = async (values) => {
    const params = {
      token: user.token,
      values: values,
    };

    await updateUser(params);
    setReload(Date.now());
    navigate("../");
  };
  
  const save = async () => {
    const subList = roles.filter((r) => {
      const ret = selectedRole.includes(r.id);
      return ret;
    });

    setLoading(true);
    try {
      const params = { token: user.token, id: selectedRowId };
      const found = await findUserById(params);
      console.log("############# save found -> ",found);

      if (found.error) {
        setErrorMessage(found.error);
        setErrorCode(found.status);
        found.roles = subList;

        console.log("############# save -> ", found);
        // await onUpdate(found);

      } else {
        setErrorMessage(null);
        setErrorCode(null);
      }
    } catch (error) {
      setErrorMessage(error);
    }
    setLoading(false);
  };

  const onClose = () => {
    navigate(-1);
  };

  const findRoles = async () => {
    const params = { token: user.token };
    setLoading(true);

    try {
      const roles = await findAllRoles(params);

      const ret = roles.map((r) => {
        return { id: r.id, name: r.name, context: r.context.name };
      });

      setRoles(ret);
    } catch (error) {
      setErrorMessage(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    findRoles();
  }, []);

  const onCheckRow = (rowId, check) => {
    if (check) {
      setSelectedRole([...selectedRole, rowId]);
    } else {
      setSelectedRole(selectedRole.filter((r) => r !== rowId));
    }
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
      <ResponceNotification
        opened={errorMessage ? true : false}
        onClose={onClose}
        code={errorMessage}
        title={t("status.error")}
        text={errorMessage}
      />
      {loading ? <LoadingOverlay overlayOpacity={0.5} /> : null}

      <Title
        mb={"lg"}
        order={2}
        align="center"
        sx={(theme) => ({
          fontFamily: `Greycliff CF, ${theme.fontFamily}`,
          fontWeight: 700,
        })}
      >
        {t("crud.user.title.role")}
      </Title>

      <CheckTable
        data={roles}
        columns={columns}
        loading={false}
        rowSelected={rowSelected}
        setRowSelected={setRowSelected}
        onCheckRow={onCheckRow}
        height={400}
      />

      <Group position="right" mt="xs" mb="xs" width="100%">
        <Button
          onClick={(event) => {
            save();
          }}
        >
          {t("button.accept")}
        </Button>
        <Button
          onClick={(event) => {
            navigate(-1);
          }}
        >
          {t("button.close")}
        </Button>
      </Group>
    </Stack>
  );
}
