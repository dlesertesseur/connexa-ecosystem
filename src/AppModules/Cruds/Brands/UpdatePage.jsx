import ResponceNotification from "../../../Modal/ResponceNotification";
import { TextInput, Title, Container, Button, Group, LoadingOverlay } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { findBrandById, updateBrand } from "../../../DataAccess/Brands";

export function UpdatePage({ user, back, brandId, onLoadGrid }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [brand, setBrand] = useState(null);

  const form = useForm({
    initialValues: {
      name: "",
    },

    validate: {
      name: (val) => (val ? null : t("validation.required")),
    },
  });

  const [working, setWorking] = useState(false);
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [response, setResponse] = useState(null);

  useEffect(() => {
    setWorking(true);

    const params = {
      token: user.token,
      brandId: brandId,
    };

    findBrandById(params).then((ret) => {
      setWorking(false);
      setBrand(ret);
      form.setFieldValue("name", ret.name);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brandId, user]);

  const createTextField = (field) => {
    const ret = (
      <TextInput
        label={t("crud.brand.label." + field)}
        placeholder={t("crud.brand.placeholder." + field)}
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  const onUpdate = (values) => {
    setWorking(true);

    const params = {
      token: user.token,
      data: values,
    };

    updateBrand(params)
      .then((ret) => {
        setWorking(false);

        if (ret.status) {
          setResponse({
            code: ret.status,
            title: ret.status ? t("status.error") : t("status.ok"),
            text: ret.status ? ret.message : t("message.update"),
          });
          setResponseModalOpen(true);
        } else {
          onLoadGrid();
          navigate(back);
        }
      })
      .catch((error) => {
        setResponse({ code: error.status, title: t("status.error"), text: error.message });
        setResponseModalOpen(true);
      });
  };

  const onClose = () => {
    setResponseModalOpen(false);
    onLoadGrid();
    navigate(back);
  };

  return (
    <Container size={"xl"} sx={{ width: "100%" }}>
      <ResponceNotification
        opened={responseModalOpen}
        onClose={onClose}
        code={response?.code}
        title={response?.title}
        text={response?.text}
      />
      <LoadingOverlay overlayOpacity={0.5} visible={working} />
      <Container size={"sm"}>
        <Title
          mb={"lg"}
          order={2}
          align="center"
          sx={(theme) => ({
            fontFamily: `Greycliff CF, ${theme.fontFamily}`,
            fontWeight: 700,
          })}
        >
          {t("crud.brand.title.update")}
        </Title>

        <form   autoComplete="false"
          onSubmit={form.onSubmit((values) => {
            const data = { ...brand };
            data.name = values.name;
            onUpdate(data);
          })}
        >
          <Group grow mb={"md"}>
            {createTextField("name")}
          </Group>

          <Group position="right" mt="xl" mb="xs">
            <Button
              onClick={(event) => {
                navigate(back);
              }}
            >
              {t("button.cancel")}
            </Button>
            <Button type="submit">{t("button.accept")}</Button>
          </Group>
        </form>
      </Container>
    </Container>
  );
}
