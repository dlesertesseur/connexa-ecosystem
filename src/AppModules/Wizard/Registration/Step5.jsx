import { Title, Stack, ScrollArea, Container, Text, Divider, List, LoadingOverlay } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useContext } from "react";
import { AbmStateContext } from "./Context";
import { useWindowSize } from "../../../Hook";
import { useEffect } from "react";
import { findAllRoles } from "../../../DataAccess/Roles";
import { IconCircleCheck } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { registrate } from "../../../DataAccess/Registration";
import ButtonsPanel from "./ButtonsPanel";
import ResponceNotification from "../../../Modal/ResponceNotification";
import CustomLabel from "../../../Components/CustomLabel";

export function Step5({ title, active, setActive, onCancel }) {
  const { t } = useTranslation();
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rolMap, setRolMap] = useState();
  const { wizardData, stepHeader, setReload } = useContext(AbmStateContext);
  const { user } = useSelector((state) => state.auth.value);
  const navigate = useNavigate();
  const wSize = useWindowSize();

  const steps = t("wizard.registration.steps", { returnObjects: true });

  const prevStep = () => {
    setActive(active - 1);
  };

  const onLocalCreate = async () => {
    const params = { token: user.token, data: wizardData };
    setLoading(true);
    const ret = await registrate(params);

    if (ret.error) {
      setLoading(false);
      setErrorMessage(ret.message);
    } else {
      setErrorMessage(null);
      setLoading(false);

      setReload(Date.now());
      navigate("../");
    }
  };

  const findData = async () => {
    const params = { token: user.token };
    setLoading(true);

    try {
      const role = await findAllRoles(params);
      const map = new Map(
        role.map((obj) => {
          return [obj.id, obj];
        })
      );
      setRolMap(map);
    } catch (error) {
      setErrorMessage(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    findData();
  }, []);

  return (
    <Stack
      justify="stretch"
      spacing="xs"
      sx={(theme) => ({
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
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

      {rolMap && wizardData ? (
        <>
          <ScrollArea h={wSize.height - stepHeader}>
            <Container>
              <LoadingOverlay overlayOpacity={0.5} visible={loading} />
              <Stack
                sx={(theme) => ({
                  backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
                })}
              >
                <Text size={"lg"} weight={700}>
                  {steps[0].name}
                </Text>
                <CustomLabel label={t("crud.organization.label.name")} value={wizardData.step1.name} />
                <CustomLabel label={t("crud.organization.label.description")} value={wizardData.step1.description} />
                <Divider />
                <Text size={"lg"} weight={700}>
                  {steps[1].name}
                </Text>
                <CustomLabel label={t("crud.user.label.nid")} value={wizardData.step2.nid} />
                <CustomLabel label={t("crud.user.label.lastname")} value={wizardData.step2.lastname} />
                <CustomLabel label={t("crud.user.label.firstname")} value={wizardData.step2.firstname} />
                <CustomLabel label={t("crud.user.label.email")} value={wizardData.step2.email} />
                <Divider />
                <Text size={"lg"} weight={700}>
                  {steps[2].name}
                </Text>
                <List>
                  <List size="sm" spacing={"xs"} center icon={<IconCircleCheck size={16} />}>
                    {wizardData.step3.map((item) => {
                      const rol = rolMap.get(item);
                      const ret = <List.Item key={item}>{rol.name}</List.Item>;
                      return ret;
                    })}
                  </List>
                </List>
                <Divider />
                <Text size={"lg"} weight={700}>
                  {steps[3].name}
                </Text>
                <List size="sm" center icon={<IconCircleCheck size={16} />}>
                  {wizardData.step4.map((item) => {
                    const rol = rolMap.get(item);
                    const ret = <List.Item key={item}>{rol.name}</List.Item>;
                    return ret;
                  })}
                </List>
              </Stack>
            </Container>
          </ScrollArea>
          <ButtonsPanel onCancel={onCancel} prevStep={prevStep} onCreate={onLocalCreate} />
        </>
      ) : (
        <LoadingOverlay overlayOpacity={0.5} />
      )}

      {errorMessage ? (
        <ResponceNotification
          opened={errorMessage}
          onClose={() => {
            setErrorMessage(null);
          }}
          code={errorMessage}
          title={t("errors.title")}
          text={errorMessage}
        />
      ) : null}
    </Stack>
  );
}
