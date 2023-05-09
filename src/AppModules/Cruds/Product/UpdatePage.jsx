import ResponceNotification from "../../../Modal/ResponceNotification";
import {
  TextInput,
  Title,
  Container,
  Button,
  Group,
  LoadingOverlay,
  Select,
  ScrollArea,
  useMantineTheme,
  Text,
  Box,
  Card,
  Image,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import {
  clearError,
  deleteImage,
  findAllCountries,
  findAllImagesByProductId,
  findProductById,
  update,
  uploadImage,
} from "../../../Features/Product";
import { useDispatch, useSelector } from "react-redux";
import { findAllBrands } from "../../../Features/Brand";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { IconUpload, IconX, IconPhoto } from "@tabler/icons";
import { Carousel } from "@mantine/carousel";
import { actions, API } from "../../../Constants";
import { useViewportSize } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";

export function UpdatePage() {
  const { t } = useTranslation();
  const { user, projectSelected } = useSelector((state) => state.auth.value);
  const { brands } = useSelector((state) => state.brand.value);
  const { countries, error, errorCode, errorMessage, processing, selectedRowId, product, images, refreshImageList, appState } =
    useSelector((state) => state.product.value);

  const { height } = useViewportSize();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useMantineTheme();

  useEffect(() => {
    const parameters = {
      token: user.token,
    };
    dispatch(findAllBrands(parameters));
    dispatch(findAllCountries(parameters));
  }, [dispatch, user]);

  useEffect(() => {
    if (selectedRowId) {
      const params = {
        token: user.token,
        id: selectedRowId,
      };
      dispatch(findProductById(params));
    }
  }, [dispatch, selectedRowId, user]);

  useEffect(() => {
    if (product) {
      form.setFieldValue("sku", product.sku);
      form.setFieldValue("ean", product.ean);
      form.setFieldValue("description", product.description);
      form.setFieldValue("brand", product.brand.id);
      form.setFieldValue("countryOfOrigin", product.countryOfOrigin.id);

      const params = {
        token: user.token,
        id: product.id,
      };
      dispatch(findAllImagesByProductId(params));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  useEffect(() => {
    if (product) {
      const params = {
        token: user.token,
        id: product.id,
      };
      dispatch(findAllImagesByProductId(params));
    }
  }, [dispatch, product, refreshImageList, user]);

  useEffect(() => {
    if(appState === actions.updated){
      navigate(-1);
    }
  }, [appState, navigate]);

  const form = useForm({
    initialValues: {
      sku: "",
      ean: "",
      description: "",
      brand: "",
      countryOfOrigin: "",
    },

    validate: {
      sku: (val) => (val ? null : t("validation.required")),
      ean: (val) => (val ? null : t("validation.required")),
      description: (val) => (val ? null : t("validation.required")),
      brand: (val) => (val ? null : t("validation.required")),
      countryOfOrigin: (val) => (val ? null : t("validation.required")),
    },
  });

  const createTextField = (field) => {
    const ret = (
      <TextInput
        label={t("crud.product.label." + field)}
        placeholder={
          t("crud.product.placeholder." + field).startsWith("crud.") ? "" : t("crud.product.placeholder." + field)
        }
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  const createSelectField = (field, data) => {
    const list = data?.map((c) => {
      return { value: c.id, label: c.name };
    });
    const ret = (
      <Select label={t("crud.product.label." + field)} data={list ? list : []} {...form.getInputProps(field)} />
    );

    return ret;
  };

  const onUpdate = (values) => {
    const params = {
      id: product.id,
      token: user.token,
      sku: values.sku,
      ean: values.ean,
      description: values.description,
      brand: values.brand,
      price: 0,
      currency: "PESO",
      status: "Activo",
      projectId: projectSelected.id,
      countryOfOrigin: values.countryOfOrigin,
      measurementTypeIdForContent: "Q",
      measurementUnitIdForContent: "UNIDADES",
      measurementTypeIdForSale: "Q",
      measurementUnitIdForSale: "UNIDADES",
      measurementTypeIdForPrice: "Q",
      measurementUnitIdForPrice: "UNIDADES",
    };

    dispatch(update(params));
  };

  const onClose = () => {
    dispatch(clearError());
  };

  const uploadFiles = (files) => {
    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      uploadFile(file);
    }
  };

  const uploadFile = (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", file.type);

    const params = {
      token: user.token,
      id: product.id,
      data: formData,
    };

    dispatch(uploadImage(params));
  };

  function truncate(input, length) {
    if (input.length > length) {
      return input.substring(0, length) + "...";
    }
    return input;
  }

  const onDelete = (imageId) => {
    const params = {
      token: user.token,
      id: imageId,
    };

    dispatch(deleteImage(params));
  };

  return (
    <Container size={"xl"} sx={{ width: "100%" }}>
      {error ? (
        <ResponceNotification opened={error} onClose={onClose} code={errorCode} title={error} text={errorMessage} />
      ) : null}

      <LoadingOverlay overlayOpacity={0.5} visible={processing} />
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
          {t("crud.product.title.update")}
        </Title>

        <ScrollArea type="never" style={{ width: "100%", height: height - 200 }}>
          <form
            onSubmit={form.onSubmit((values) => {
              onUpdate(values);
            })}
          >
            <Group mb={"md"}>{createTextField("sku")}</Group>
            <Group mb={"md"}>{createTextField("ean")}</Group>
            <Group grow mb={"md"}>
              {createTextField("description")}
            </Group>
            <Group mb={"md"}>{createSelectField("brand", brands)}</Group>
            <Group mb={"md"}>{createSelectField("countryOfOrigin", countries)}</Group>

            {images?.length > 0 ? (
              <Box mb="lg">
                <Carousel height={300} slideGap="md">
                  {images.map((img) => {
                    return (
                      <Carousel.Slide key={img.path} sx={{ height: "100%", maxWidth: 220 }}>
                        <Card shadow="sm" p="xs">
                          <Card.Section>
                            <Image src={API.productImages.baseUrl + img.path} alt="No way!" height={200} fit="contain"/>
                          </Card.Section>

                          <Text mt="xs" color="dimmed" size="xs">
                            {truncate(img.name, 30)};
                          </Text>
                          <Group position="right">
                            <Button
                              color="blue"
                              mt="xs"
                              onClick={() => {
                                onDelete(img.id);
                              }}
                            >
                              {t("button.deleteImage")}
                            </Button>
                          </Group>
                        </Card>
                      </Carousel.Slide>
                    );
                  })}
                </Carousel>
              </Box>
            ) : <Box mb="lg"/>}

            <Group grow mb="lg">
              <Dropzone
                onDrop={(files) => uploadFiles(files)}
                onReject={(files) => console.log("rejected files", files)}
                maxSize={3 * 1024 ** 2}
                accept={IMAGE_MIME_TYPE}
              >
                <Group position="center" spacing="xl" style={{ minHeight: 220, pointerEvents: "none" }}>
                  <Dropzone.Accept>
                    <IconUpload
                      size={50}
                      stroke={1.5}
                      color={theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 4 : 6]}
                    />
                  </Dropzone.Accept>
                  <Dropzone.Reject>
                    <IconX size={50} stroke={1.5} color={theme.colors.red[theme.colorScheme === "dark" ? 4 : 6]} />
                  </Dropzone.Reject>
                  <Dropzone.Idle>
                    <IconPhoto size={50} stroke={1.5} />
                  </Dropzone.Idle>

                  <div>
                    <Text size="xl" inline>
                      {t("label.dropZone")}
                    </Text>
                    <Text size="sm" color="dimmed" inline mt={7}>
                      {t("label.dropZoneSub")}
                    </Text>
                  </div>
                </Group>
              </Dropzone>
            </Group>

            <Group position="right" mt="xl" mb="xs">
              <Button
                onClick={(event) => {
                  navigate(-1);
                }}
              >
                {t("button.cancel")}
              </Button>
              <Button type="submit">{t("button.accept")}</Button>
            </Group>
          </form>
        </ScrollArea>
      </Container>
    </Container>
  );
}
