import { Button, Menu } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconPolaroid } from "@tabler/icons";

function ImageSelctor({ loadImage, imageList, disabled }) {
  const { t } = useTranslation();

  const localLoadImage = (path) => {
    loadImage("loadImage", path);
  };

  return (
    <Menu withArrow>
      <Menu.Target>
        <Button leftIcon={<IconPolaroid size={22} />} color="blue" size="xs" disabled={disabled}>
          {t("button.backImage")}
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        {imageList?.map((i) => {
          return (
            <Menu.Item
              key={i.name}
              icon={<IconPolaroid size={14} />}
              onClick={() => {
                localLoadImage(i.path);
              }}
            >
              {i.name}
            </Menu.Item>
          );
        })}
      </Menu.Dropdown>
    </Menu>
  );
}

export { ImageSelctor };
