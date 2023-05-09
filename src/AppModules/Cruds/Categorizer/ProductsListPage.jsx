import ResponceNotification from "../../../Modal/ResponceNotification";
import { Title, Container, LoadingOverlay, TransferList, Group, Button } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  categorizeProduct,
  clearError,
  getCategorizeProducts,
  getUncategorizeProducts,
  resetAppState,
} from "../../../Features/Categorizer";

export default function ProductsListPage() {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const {
    error,
    errorCode,
    errorMessage,
    loading,
    uncategorizeProducts,
    categorizeProducts,
    category,
  } = useSelector((state) => state.categorizer.value);

  const dispatch = useDispatch();
  const [data, setData] = useState([[], []]);
  const [categoryName, setCategoryName] = useState(null);

  const onClose = () => {
    dispatch(clearError());
  };

  useEffect(() => {
    if (category) {
      setCategoryName(category.name);

      const params = { token: user.token, id: category.id };
      dispatch(getCategorizeProducts(params));
      dispatch(getUncategorizeProducts(params));
    } else {
      setCategoryName(null);
    }
  }, [category, dispatch, user]);

  useEffect(() => {
    if (uncategorizeProducts && categorizeProducts) {
      const categorized = categorizeProducts.map((p) => {
        const ret = { value: p.id, label: p.description };
        return ret;
      });

      const uncategorized = uncategorizeProducts.map((p) => {
        const ret = { value: p.id, label: p.description };
        return ret;
      });

      setData([categorized, uncategorized]);
    }
  }, [uncategorizeProducts, categorizeProducts]);

  const onAccept = (event) => {
    console.log(data[0]);
    const parameters = {};
    dispatch(categorizeProduct(parameters));
  };

  return (
    <Container size={"xl"} sx={{ width: "100%" }}>
      {error ? (
        <ResponceNotification opened={error} onClose={onClose} code={errorCode} title={error} text={errorMessage} />
      ) : null}

      <LoadingOverlay overlayOpacity={0.5} visible={loading} />
      <Container size={"xl"} sx={{ width: "100%" }}>
        <Title
          mb={"lg"}
          order={2}
          align="center"
          sx={(theme) => ({
            fontFamily: `Greycliff CF, ${theme.fontFamily}`,
            fontWeight: 700,
          })}
        >
          {t("crud.categorizer.title.addProducts")}
          {categoryName ? " : " + categoryName : ""}
        </Title>
        <TransferList
          value={data}
          onChange={setData}
          searchPlaceholder={t("crud.categorizer.label.search")}
          nothingFound=""
          titles={[t("crud.categorizer.label.assignedProducts"), t("crud.categorizer.label.unassignedProducts")]}
          breakpoint="sm"
        />
        <Group position="right" mt="xl" mb="xs">
          <Button onClick={onAccept}>{t("button.accept")}</Button>
          <Button
            onClick={(event) => {
              dispatch(resetAppState());
            }}
          >
            {t("button.cancel")}
          </Button>
        </Group>
      </Container>
    </Container>
  );
}
