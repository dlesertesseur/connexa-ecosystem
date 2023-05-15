import ResponceNotification from "../../../Modal/ResponceNotification";
import { TextInput, Title, Container, Button, Group, LoadingOverlay, Table, Text, Alert, Paper } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  addRelationWorkerOrganization,
  clearError,
  findAllOrganizationsByWorker,
  findAllWorkerByIdentification,
} from "../../../Features/Worker";
import { IconAlertCircle } from "@tabler/icons-react";

export function FindWorker() {
  const { t } = useTranslation();
  const { user, organizationSelected } = useSelector((state) => state.auth.value);
  const { error, errorCode, errorMessage, workerFound, loading, organizationsByWorker } = useSelector(
    (state) => state.worker.value
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [oganizationList, setOrganizationList] = useState(null);
  const [alreadyExists, setAlreadyExists] = useState(false);

  useEffect(() => {
    if (workerFound) {
      const parameters = {
        token: user.token,
        id: workerFound.id,
      };
      dispatch(findAllOrganizationsByWorker(parameters));
    }
  }, [dispatch, user, workerFound]);

  useEffect(() => {
    let exist = false;
    if (organizationsByWorker) {
      const ret = organizationsByWorker.map((r) => {
        if (r.organization.id === organizationSelected.id) {
          exist = true;
        }
        return { id: r.organization.id, name: r.organization.name, creationDate: r.organization.creationDate };
      });

      setOrganizationList(ret);
    } else {
      setOrganizationList(null);
    }

    setAlreadyExists(exist);
  }, [organizationSelected, organizationsByWorker]);

  const form = useForm({
    initialValues: {
      nid: "",
      email: "",
    },

    validate: {
      nid: (val) => (/^\d{8,10}$/.test(val) ? null : t("validation.idNumberFormat")),
      //email: (val) => (/^\S+@\S+$/.test(val) ? null : t("validation.emailFormat")),
    },
  });

  const createTextField = (field) => {
    const ret = (
      <TextInput
        label={t("crud.worker.label." + field)}
        placeholder={
          t("crud.worker.placeholder." + field).startsWith("crud.") ? "" : t("crud.worker.placeholder." + field)
        }
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  const onClose = () => {
    navigate("../");
    dispatch(clearError());
  };

  const ths = () => {
    const cols = t("crud.worker.findWorkerColumns", { returnObjects: true });
    return (
      <tr>
        <th>{cols[0]}</th>
        <th>{cols[1]}</th>
      </tr>
    );
  };

  const onSeek = (values) => {
    const params = {
      token: user.token,
      nid: values.nid,
    };
    dispatch(findAllWorkerByIdentification(params));
  };

  const onRelationWorkerOrganization = () => {
    const parameters = {
      token: user.token,
      workerId: workerFound.id,
      organizationId: organizationSelected.id,
    };

    dispatch(addRelationWorkerOrganization(parameters));
  };

  return (
    <Container size={"xl"} sx={{ width: "100%" }}>
      {error && errorCode !== 404 ? (
        <ResponceNotification opened={error} onClose={onClose} code={errorCode} title={error} text={errorMessage} />
      ) : null}

      <LoadingOverlay overlayOpacity={0.5} visible={loading} />
      <Container size={"xs"}>
        <Title
          mb={"lg"}
          order={2}
          align="center"
          sx={(theme) => ({
            fontFamily: `Greycliff CF, ${theme.fontFamily}`,
            fontWeight: 700,
          })}
        >
          {t("crud.worker.title.findWorker")}
        </Title>
        <form
          onSubmit={form.onSubmit((values) => {
            onSeek(values);
          })}
        >
          <Paper shadow="xs" p="md">
            <Group mb={"md"}>{createTextField("nid")}</Group>
            <Group position="right" mt="xl">
              <Button
                onClick={(event) => {
                  dispatch(clearError());
                  navigate("../");
                }}
              >
                {t("button.cancel")}
              </Button>
              <Button type="submit">{t("button.seek")}</Button>
            </Group>
          </Paper>
        </form>

        {errorCode === 404 ? (
          <Alert icon={<IconAlertCircle size={16} />} my="lg" title={t("notification.title")} variant="outline">
            {t("notification.createWorker")}
            <Group position="right" mt="xl">
              <Button
                onClick={() => {
                  dispatch(clearError());
                  navigate("createWorker");
                }}
              >
                {t("button.create")}
              </Button>
            </Group>
          </Alert>
        ) : null}

        {oganizationList?.length > 0 ? (
          <Paper shadow="xs" p="md" mt={"xl"}>
            <Text fw={700} my={"xs"}>
              {t("crud.worker.title.organizationList")}
            </Text>
            <Table striped highlightOnHover withBorder withColumnBorders>
              <thead>{ths()}</thead>
              <tbody>
                {oganizationList.map((element) => {
                  return (
                    <tr key={element.id}>
                      <td>{element.name}</td>
                      <td>{element.creationDate}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>

            <Group position="right" mt="xl">
              <Button
                onClick={(event) => {
                  dispatch(clearError());
                  navigate("../");
                }}
              >
                {t("button.cancel")}
              </Button>
              <Button
                disabled={alreadyExists}
                onClick={() => {
                  onRelationWorkerOrganization();
                }}
              >
                {t("button.createAnyway")}
              </Button>
            </Group>
          </Paper>
        ) : null}

        {oganizationList?.length === 0 && workerFound ? (
          <Alert icon={<IconAlertCircle size={16} />} my="lg" title={t("notification.title")} variant="outline">
            {t("notification.createWorkerRelation")}
            <Group position="right" mt="xl">
              <Button
                onClick={() => {
                  onRelationWorkerOrganization();
                }}
              >
                {t("button.createWorkerRelation")}
              </Button>
            </Group>
          </Alert>
        ) : null}

        {alreadyExists ? (
          <Alert
            icon={<IconAlertCircle size={16} />}
            my="lg"
            title={t("notification.title")}
            variant="filled"
            color={"red"}
          >
            {t("notification.createWorker")}
          </Alert>
        ) : null}
      </Container>
    </Container>
  );
}
