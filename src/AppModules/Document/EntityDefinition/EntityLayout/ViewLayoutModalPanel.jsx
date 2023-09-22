import {
  Checkbox,
  Container,
  Group,
  NumberInput,
  ScrollArea,
  Select,
  Stack,
  TextInput,
  Textarea,
  Button,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useWindowSize } from "../../../../Hook";
import { useTranslation } from "react-i18next";
import EntityList from "./Components/EntityList";
import ViewLayoutModalHeader from "./ViewLayoutModalHeader";
import { useNavigate } from "react-router-dom";

const ViewLayoutModalPanel = ({ formConfig, panels, widgetByPanel, relatedEntities, size, close, height, entity }) => {
  const { t } = useTranslation();
  const wsize = useWindowSize();
  const form = useForm(formConfig);
  const navigate = useNavigate();
  const totalHeaderHeight = 220 + (relatedEntities ? 60 : 0);

  const buildGroup = (group, index) => {
    const ret = (
      <Group key={index} grow mb={"md"}>
        {group?.map((f) => buildField(f))}
      </Group>
    );

    return ret;
  };

  const buildField = (field) => {
    let ret = null;
    switch (field.widget) {
      case 1:
        ret = (
          <TextInput
            {...form.getInputProps(field.name)}
            key={field.id}
            withAsterisk={field.required}
            label={field.description}
            placeholder={field.name}
          />
        );
        break;
      case 2:
        ret = (
          <Textarea
            key={field.id}
            withAsterisk={field.required}
            label={field.description}
            placeholder={field.name}
            {...form.getInputProps(field.name)}
          />
        );
        break;
      case 3:
        ret = (
          <NumberInput
            key={field.id}
            withAsterisk={field.required}
            label={field.description}
            placeholder={field.name}
            {...form.getInputProps(field.name)}
          />
        );
        break;
      case 4:
        ret = (
          <Select
            key={field.id}
            withAsterisk={field.required}
            label={field.description}
            placeholder={field.name}
            data={[]}
            {...form.getInputProps(field.name)}
          />
        );
        break;
      case 5:
        ret = (
          <Checkbox
            key={field.id}
            withAsterisk={field.required}
            label={field.description}
            placeholder={field.name}
            {...form.getInputProps(field.name)}
          />
        );
        break;
      case 6:
        ret = <EntityList key={field.id} field={field} />;
        break;

      default:
        break;
    }
    return ret;
  };

  const buildForm = (panels) => {
    const rows = panels?.map((f, index) => {
      const group = widgetByPanel.get(f.id);
      const ret = buildGroup(group, index);
      return ret;
    });

    return rows;
  };

  return (
    <Container size={size} bg={"gray.0"}>
      <Stack spacing={"xs"}>
        <form
          onSubmit={form.onSubmit((values) => {
            console.log("onSubmit ->", values);
            form.reset();
          })}
        >
          <ViewLayoutModalHeader name={entity?.name} description={entity?.description} />

          {relatedEntities ? (
            <Group position="left" mb={"xs"} spacing={"xs"}>
              {relatedEntities.map((re) => {
                return (
                  <Button
                    key={re.entity.id}
                    onClick={() => {
                      navigate("uno");
                    }}
                  >
                    {re.entity.name}
                  </Button>
                );
              })}
            </Group>
          ) : null}

          <ScrollArea offsetScrollbars h={height ? height : wsize.height - totalHeaderHeight}>
            {buildForm(panels)}
          </ScrollArea>

          <Group position="right" my={"xs"}>
            <Button type="submit">{t("button.accept")}</Button>
            <Button
              onClick={() => {
                close();
                form.reset();
              }}
            >
              {t("button.cancel")}
            </Button>
          </Group>
        </form>
      </Stack>
    </Container>
  );
};

export { ViewLayoutModalPanel };
