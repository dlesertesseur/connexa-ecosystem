import {
  Title,
  Container,
  Button,
  Group,
  Select,
  LoadingOverlay,
  ScrollArea,
  TextInput,
  Checkbox,
  NumberInput,
  Stack,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useViewportSize } from "@mantine/hooks";
import { useContext, useEffect, useState } from "react";
import { CRUD_PAGE_MODE, HEADER_HIGHT } from "../../../../Constants";
import { AbmStateContext } from "../Context";
import {
  comexRecapAddItem,
  comexRecapUpdateItem,
  findAllComexCategories,
  findComexRecapBarcodeTypes,
  findComexRecapItemById,
  findComexRecapMeasureUnits,
  uploadItemImage,
} from "../../../../DataAccess/ComexRecap";
import { IconBox, IconCoin, IconPackage } from "@tabler/icons-react";
import { config } from "../../../../Constants/config";
import ProductImage from "../ProductImage";

export function ProductPage({ mode = CRUD_PAGE_MODE.new, recap }) {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const { height } = useViewportSize();

  const [working, setWorking] = useState(false);

  const [categoriesList, setCategoriesList] = useState(null);
  const [subcategoriesList, setSubcategoriesList] = useState(null);
  const [barcodeTypeList, setBarcodeTypeList] = useState([]);
  const [unitsList, setUnitsList] = useState([]);
  const [item, setItem] = useState(null);

  const [img1, setImg1] = useState(null);
  const [img2, setImg2] = useState(null);
  const [img3, setImg3] = useState(null);

  const [price, setPrice] = useState(null);
  const [amountVal, setAmountVal] = useState(null);

  const navigate = useNavigate();

  const iconCoin = <IconCoin size={16} />;
  const iconAmount = <IconBox size={16} />;
  const iconBoxes = <IconPackage size={16} />;
  const currency = recap?.currency.abbreviation;

  const { setReloadItems, selectedRowId, selectedItem, setError } = useContext(AbmStateContext);

  useEffect(() => {
    getContentData();
  }, [recap]);

  useEffect(() => {
    form.setFieldValue("totalPrice", amountVal * price);
  }, [amountVal, price]);

  useEffect(() => {
    if ((mode === CRUD_PAGE_MODE.update || mode === CRUD_PAGE_MODE.delete) && item) {
      selectCategory(item.category.id);

      form.setFieldValue("category", item.category.id);
      form.setFieldValue("subcategory", item.subcategory.id);
      form.setFieldValue("description", item.description);
      form.setFieldValue("barcodeType", item.barcodeType.id);
      form.setFieldValue("barcode", item.barcode);
      form.setFieldValue("pdq", item.productDisplayQuickly);
      form.setFieldValue("quantity", item.quantity);
      form.setFieldValue("unitOfMeasurement", item.unitOfMeasurement);
      form.setFieldValue("priceByUnit", item.pricePerUnit);
      form.setFieldValue("totalPrice", item.price);
      form.setFieldValue("boxes", item.boxes);
      // setImg1(item.image);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]);

  const selectCategory = async (category) => {
    const params = {
      token: user.token,
      apikey: config.COMEX_API_KEY,
      categoryId: category,
    };
    const ports = await findAllComexCategories(params);
    let ret = ports.map((p) => {
      const obj = { value: p.id, label: p.name };
      return obj;
    });
    setSubcategoriesList(ret);
  };

  const getContentData = async () => {
    let ret = null;
    if (recap) {
      setWorking(true);
      const params = {
        apikey: config.COMEX_API_KEY,
        categoryId: recap.department.id,
        itemId: selectedItem,
      };

      const categories = await findAllComexCategories(params);
      ret = categories?.map((c) => {
        const obj = { value: c.id, label: c.name };
        return obj;
      });
      setCategoriesList(ret);

      const barcodeTypes = await findComexRecapBarcodeTypes(params);
      ret = barcodeTypes?.map((c) => {
        const obj = { value: c.id, label: c.name };
        return obj;
      });
      setBarcodeTypeList(ret);

      const units = await findComexRecapMeasureUnits(params);
      ret = units?.map((c) => {
        const obj = { value: c.id, label: `${c.name} (${c.code})` };
        return obj;
      });
      setUnitsList(ret);

      if(mode !== CRUD_PAGE_MODE.new){
        const rowItems = await findComexRecapItemById(params);
        if (rowItems) {
          setItem(rowItems[0]);
        }
      }

      setWorking(false);
    }
  };

  const form = useForm({
    initialValues: {
      category: null,
      subcategory: null,
      description: "",
      barcodeType: null,
      barcode: "",
      pdq: false,
      quantity: null,
      unitOfMeasurement: null,
      priceByUnit: null,
      totalPrice: null,
      boxes: null,
    },

    validate: {
      category: (val) => (val ? null : t("validation.required")),
      subcategory: (val) => (val ? null : t("validation.required")),
      description: (val) => (val ? null : t("validation.required")),
      barcodeType: (val) => (val ? null : t("validation.required")),
      barcode: (val) => (val ? null : t("validation.required")),
      quantity: (val) => (val ? null : t("validation.required")),
      unitOfMeasurement: (val) => (val ? null : t("validation.required")),
      priceByUnit: (val) => (val ? null : t("validation.required")),
      totalPrice: (val) => (val ? null : t("validation.required")),
      boxes: (val) => (val ? null : t("validation.required")),
    },
  });

  const createSelect = (field, data) => {
    let localDisabled = null;

    if (mode === CRUD_PAGE_MODE.delete) {
      localDisabled = true;
    } else {
      localDisabled = data ? false : true;
    }
    const ret = (
      <Select
        label={t("comex.recap.products.label." + field)}
        data={data ? data : []}
        disabled={localDisabled}
        placeholder={t("comex.recap.products.placeholder." + field)}
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  const createTextField = (field, disabled) => {
    const modeDisabled = mode === CRUD_PAGE_MODE.delete ? true : false;

    const ret = (
      <TextInput
        disabled={disabled || modeDisabled}
        label={t("comex.recap.products.label." + field)}
        placeholder={t("comex.recap.products.placeholder." + field)}
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  const createTotalPriceField = (field, icon, currency, disabled) => {
    const modeDisabled = mode === CRUD_PAGE_MODE.delete ? true : false;

    const ret = (
      <NumberInput
        icon={icon}
        disabled={disabled || modeDisabled}
        label={t("comex.recap.products.label." + field) + ` (${currency})`}
        placeholder={t("comex.recap.products.placeholder." + field)}
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  const createPriceField = (field, icon, currency, disabled) => {
    const modeDisabled = mode === CRUD_PAGE_MODE.delete ? true : false;

    const ret = (
      <NumberInput
        icon={icon}
        disabled={disabled || modeDisabled}
        label={t("comex.recap.products.label." + field) + ` (${currency})`}
        placeholder={t("comex.recap.products.placeholder." + field)}
        {...form.getInputProps(field)}
        onChange={(env) => {
          form.setFieldValue(field, env);
          setPrice(env);
        }}
      />
    );

    return ret;
  };

  const createAmountField = (field, icon, disabled) => {
    const modeDisabled = mode === CRUD_PAGE_MODE.delete ? true : false;

    const ret = (
      <NumberInput
        icon={icon}
        disabled={disabled || modeDisabled}
        label={t("comex.recap.products.label." + field)}
        placeholder={t("comex.recap.products.placeholder." + field)}
        {...form.getInputProps(field)}
        onChange={(env) => {
          form.setFieldValue(field, env);
          setAmountVal(env);
        }}
      />
    );

    return ret;
  };

  const createBoxesField = (field, icon, disabled) => {
    const modeDisabled = mode === CRUD_PAGE_MODE.delete ? true : false;

    const ret = (
      <NumberInput
        icon={icon}
        disabled={disabled || modeDisabled}
        label={t("comex.recap.products.label." + field)}
        placeholder={t("comex.recap.products.placeholder." + field)}
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  const createCheckField = (field, disabled) => {
    const localDisabled = mode === CRUD_PAGE_MODE.delete ? true : false;
    const ret = (
      <Checkbox
        labelPosition="left"
        disabled={localDisabled || disabled}
        label={t("comex.recap.products.label." + field)}
        placeholder={t("comex.recap.products.placeholder." + field)}
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  const createSelectCategory = (field, data) => {
    let localDisabled = false;
    if (mode === CRUD_PAGE_MODE.delete) {
      localDisabled = true;
    } else {
      localDisabled = data ? false : true;
    }
    const ret = (
      <Select
        label={t("comex.recap.label." + field)}
        data={data ? data : []}
        disabled={localDisabled}
        placeholder={t("comex.recap.products.placeholder." + field)}
        {...form.getInputProps(field)}
        onChange={(env) => {
          form.setFieldValue(field, env);
          form.setFieldValue("subcategory", null);
          selectCategory(env);
        }}
      />
    );

    return ret;
  };

  const createSelectSubcategory = (field, data) => {
    let localDisabled = false;
    if (mode === CRUD_PAGE_MODE.delete) {
      localDisabled = true;
    } else {
      localDisabled = data ? false : true;
    }
    const ret = (
      <Select
        label={t("comex.recap.label." + field)}
        data={data ? data : []}
        disabled={localDisabled}
        placeholder={t("comex.recap.products.placeholder." + field)}
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  const onClose = () => {
    navigate("../");
  };

  const onSave = async (values) => {
    let ret = null;
    const data = {
      categoryId: values.category,
      subCategoryId: values.subcategory,
      description: values.description,
      barcodeTypeId: values.barcodeType,
      barcode: values.barcode,
      productDisplayQuickly: values.pdq,
      quantity: values.quantity,
      boxes: values.boxes,
      image: null,
      pricePerUnit: values.priceByUnit,
      price: values.totalPrice,
    };

    const params = {
      apikey: config.COMEX_API_KEY,
      id: selectedRowId,
      itemId: item?.id,
      body: data,
    };

    setWorking(true);
    try {
      switch (mode) {
        case CRUD_PAGE_MODE.new:
          ret = await comexRecapAddItem(params);
          break;
          
        case CRUD_PAGE_MODE.update:
          ret = await comexRecapUpdateItem(params);
          break;
      }

      console.log("onSave ret -> ", ret);

      if (img1) {
        ret = await uploadFile(img1, ret.id);
        console.log("onSave uploadFile ret -> ", ret);
      }

      setReloadItems(Date.now());
      navigate("../");
    } catch (error) {
      setError(error);
    }
    setWorking(false);
  };

  const uploadFile = async (file, itemId) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", file.type);

    const params = {
      apikey: config.COMEX_API_KEY,
      itemId: itemId,
      data: formData,
    };

    const ret = await uploadItemImage(params);
    return ret;
  };

  const determinateTitle = () => {
    let ret = null;
    switch (mode) {
      case CRUD_PAGE_MODE.new:
        ret = t("comex.recap.products.title.add");
        break;

      case CRUD_PAGE_MODE.update:
        ret = t("comex.recap.products.title.update");
        break;

      case CRUD_PAGE_MODE.delete:
        ret = t("comex.recap.products.title.delete");
        break;
    }

    return(ret)
  };

  const onAccept = (values) => {
    switch (mode) {
      case CRUD_PAGE_MODE.new:
      case CRUD_PAGE_MODE.update:
        onSave(values);
        break;

      case CRUD_PAGE_MODE.delete:
        //onDelete(values);
        break;
    }
  };

  return (
    <Container size={"sm"} sx={{ width: "100%" }}>
      <LoadingOverlay overlayOpacity={0.5} visible={working} />

      <Stack spacing={"xs"}>
        <Title
          mb={"lg"}
          order={2}
          align="center"
          sx={(theme) => ({
            fontFamily: `Greycliff CF, ${theme.fontFamily}`,
            fontWeight: 700,
          })}
        >
          {determinateTitle()}
        </Title>

        <form
          onSubmit={form.onSubmit((values) => {
            onAccept(values);
          })}
        >
          <ScrollArea type="scroll" px={"md"} style={{ width: "100%", height: height - HEADER_HIGHT - 160 }}>
            <Group mb={"md"} grow>
              {createSelectCategory("category", categoriesList)}
              {createSelectSubcategory("subcategory", subcategoriesList)}
            </Group>
            <Group mb={"md"} grow>
              {createTextField("description")}
            </Group>
            <Group mb={"md"} grow>
              {createSelect("barcodeType", barcodeTypeList)}
              {createTextField("barcode")}
            </Group>
            <Group mb={"md"} grow>
              {createCheckField("pdq")}
            </Group>
            <Group mb={"md"} grow>
              {createAmountField("quantity", iconAmount)}
              {createBoxesField("boxes", iconBoxes)}
              {createSelect("unitOfMeasurement", unitsList)}
            </Group>
            <Group mb={"md"} position="apart" grow>
              {createPriceField("priceByUnit", iconCoin, currency)}
              <Group />
              {createTotalPriceField("totalPrice", iconCoin, currency, true)}
            </Group>

            <Group mb={"md"} position="apart" grow align="flex-start">
              <ProductImage imageUrl={img1} setImageUrl={setImg1} />
              <ProductImage imageUrl={img2} setImageUrl={setImg2} />
              <ProductImage imageUrl={img3} setImageUrl={setImg3} />
            </Group>
          </ScrollArea>

          <Group position="right" mt="xl" mb="xs" mx={"md"}>
            <Button type="submit">{t("button.accept")}</Button>
            <Button onClick={onClose}>{t("button.cancel")}</Button>
          </Group>
        </form>
      </Stack>
    </Container>
  );
}
