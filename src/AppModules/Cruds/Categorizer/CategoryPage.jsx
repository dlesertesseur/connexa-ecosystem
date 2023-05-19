import { Container, Button, ScrollArea, Accordion, Box, Title, LoadingOverlay } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useViewportSize } from "@mantine/hooks";
import { findCategoryById, getAllCategories } from "../../../Features/Categorizer";

const CategoryPage = () => {
  const { user } = useSelector((state) => state.auth.value);
  const { loading, categories } = useSelector((state) => state.categorizer.value);
  const { height } = useViewportSize();
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const onSelectCategory = (event) => {
    console.log("onChange -> id[" + event + "]");
  };

  useEffect(() => {
    const parameters = {
      token: user.token,
    };
    dispatch(getAllCategories(parameters));
  }, [dispatch, user]);

  const AccordionControl = ({ node, children }) => {
    const leafNode = !(node.children.length > 0);

    return (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Accordion.Control>{children}</Accordion.Control>
        {leafNode ? (
          <Button
            mr={15}
            size="xs"
            onClick={() => {
              const params = {
                token: user.token,
                id: node.id,
              };
              dispatch(findCategoryById(params));
            }}
          >
            {t("crud.categorizer.label.addProducts")}
          </Button>
        ) : null}
      </Box>
    );
  };

  const createNodes = () => {
    let ret = null;
    ret = categories.children?.map((c) => createNode(c));

    return ret;
  };

  const createNode = (node) => {
    const ret = (
      <Accordion.Item key={node.id} value={node.id}>
        <AccordionControl node={node}>{node.name}</AccordionControl>
        <Accordion.Panel>
          {node.children && node.children.length > 0 ? (
            <Accordion
              variant="contained"
              chevronPosition="left"
              onChange={(event) => {
                onSelectCategory(event);
              }}
            >
              {node.children.map((c) => createNode(c))}
            </Accordion>
          ) : null}
        </Accordion.Panel>
      </Accordion.Item>
    );

    return ret;
  };

  return (
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
        {t("crud.categorizer.title.categoriesTree")}
      </Title>
      <LoadingOverlay overlayOpacity={0.5} visible={loading} />
      <ScrollArea type="never" style={{ width: "100%", height: height - 250 }}>
        <Container size={"lg"}>
          <Accordion
            variant="contained"
            chevronPosition="left"
            onChange={(event) => {
              onSelectCategory(event);
            }}
          >
            {categories ? createNodes(categories) : null}
          </Accordion>
        </Container>
      </ScrollArea>
    </Container>
  );
};
export default CategoryPage;
