import { Title, Container, Button, Group, LoadingOverlay, Paper, Stack, Text, Skeleton } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useViewportSize } from "@mantine/hooks";
import { useState } from "react";
import { useContext } from "react";
import { AbmConnectionStateContext } from "../Context";
import CheckTable from "../../../../Components/Crud/CheckTable";
import { useEffect } from "react";

export function ConnectTaskPage({ businessProcessId, tasks, taskId }) {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const { height } = useViewportSize();
  const [working, setWorking] = useState(false);
  const [rowSelected, setRowSelected] = useState(null);
  const [task, setTask] = useState(null);
  const [rows, setRows] = useState(null);
  const { reloadConnections, setReloadConnections } = useContext(AbmConnectionStateContext);

  // const [parametersType] = useState(
  //   PARAMETERS_TYPE.map((p) => {
  //     return { value: p.id, label: p.name };
  //   })
  // );

  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      // description: "",
      // name: "",
      // type: "",
    },

    validate: {
      // description: (val) => (val ? null : t("validation.required")),
      // name: (val) => (val ? null : t("validation.required")),
      // type: (val) => (val ? null : t("validation.required")),
    },
  });

  // const createTextField = (field) => {
  //   const ret = (
  //     <TextInput
  //       label={t("businessProcess.connections.label." + field)}
  //       placeholder={t("businessProcess.connections.placeholder." + field)}
  //       {...form.getInputProps(field)}
  //     />
  //   );

  //   return ret;
  // };

  // const createSelect = (field, data) => {
  //   const ret = (
  //     <Select
  //       label={t("businessProcess.connections.label." + field)}
  //       data={data ? data : []}
  //       placeholder={t("businessProcess.connections.placeholder." + field)}
  //       {...form.getInputProps(field)}
  //     />
  //   );

  //   return ret;
  // };

  // const getData = async () => {
  //   const params = { token: user.token, businessProcessId: businessProcessId, paramId: selectedParameterId };
  //   const ret = await findBusinessProcessParameterById(params);
  //   setProjectParameter(ret);
  // };

  useEffect(() => {
    if (tasks) {
      const task = tasks.find((t) => t.id === taskId);
      setTask(task);

      const data = tasks.filter((t) => t.id !== taskId);
      setRows(data);
    }
  }, [taskId]);

  const onClose = () => {
    navigate("../");
  };

  let col = 0;
  const cols = t("businessProcess.connections.columns", { returnObjects: true });
  const columns = [
    { headerName: cols[col++], fieldName: "stageName", align: "left" },
    { headerName: cols[col++], fieldName: "statusName", align: "left" },
    { headerName: cols[col++], fieldName: "taskName", align: "left" },
  ];

  // useEffect(() => {
  //   if (projectParameter) {
  //     form.setFieldValue("name", projectParameter.name);
  //     form.setFieldValue("description", projectParameter.description);
  //     form.setFieldValue("type", projectParameter.type);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [projectParameter]);

  const onUpdate = async (values) => {
    const params = {
      token: user.token,
      businessProcessId: businessProcessId,
      paramId: selectedParameterId,
      values: values,
    };

    setWorking(true);
    try {
      //await updateBusinessProcessParameter(params);
      setWorking(false);
      setReloadConnections(Date.now());
      navigate("../");
    } catch (error) {
      setWorking(false);
      setError(error);
    }
  };

  const onCheckRow = (e) => {
    console.log("onCheckRow -> ", e);
  };

  return (
    <Container size={"xl"} sx={{ width: "100%" }}>
      <LoadingOverlay overlayOpacity={0.5} visible={working} />

      <Container size={"md"}>
        <Title
          mb={"lg"}
          order={2}
          align="center"
          sx={(theme) => ({
            fontFamily: `Greycliff CF, ${theme.fontFamily}`,
            fontWeight: 700,
          })}
        >
          {t("businessProcess.connections.title.connections")}
        </Title>

        <Group p={6} mb={"xs"}>
          <Stack spacing={"xs"} justify="center">
            {task ? (
              <Group position="left">
                <Text size={"md"} weight={700}>
                  {task.stageName}
                </Text>

                <Text size={"md"} weight={700}>
                  {">"}
                </Text>

                <Text size={"md"} weight={700}>
                  {task.statusName}
                </Text>

                <Text size={"md"} weight={700}>
                  {">"}
                </Text>

                <Text size={"md"} weight={700}>
                  {task.taskName}
                </Text>
              </Group>
            ) : (
              <Skeleton visible={true} h={"100%"}></Skeleton>
            )}
          </Stack>
        </Group>

        <form
          onSubmit={form.onSubmit((values) => {
            onUpdate(values);
          })}
        >
          {height ? (
            <>
              {/* <ScrollArea type="scroll" style={{ width: "100%" }}>
                <Group mb={"md"} grow>
                  {createTextField("name")}
                </Group>
                <Group mb={"md"} grow>
                  {createTextField("description")}
                </Group>
                <Group mb={"md"}>{createSelect("type", parametersType)}</Group>
              </ScrollArea> */}

              <CheckTable
                data={rows}
                columns={columns}
                loading={working}
                rowSelected={rowSelected}
                setRowSelected={setRowSelected}
                onCheckRow={onCheckRow}
                headerHeight={420}
              />

              <Group position="right" mt="xl" mb="xs">
                <Button type="submit">{t("button.accept")}</Button>
                <Button onClick={onClose}>{t("button.cancel")}</Button>
              </Group>
            </>
          ) : null}
        </form>
      </Container>
    </Container>
  );
}
