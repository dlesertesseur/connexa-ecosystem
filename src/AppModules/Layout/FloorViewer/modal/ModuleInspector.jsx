import React from "react";
import { Canvas} from "@react-three/fiber";
import { Grid, OrbitControls, Select } from "@react-three/drei";
import { Drawer, Group, Stack, Tabs, Title } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useWindowSize } from "../../../../Hook";
import { SelectebleBox } from "../../../../Components/Builder3d";
import { useSelector } from "react-redux";
import { IconInfoCircle, IconView360 } from "@tabler/icons-react";
import ModuleInformationPanel from "../panel/ModuleInformationPanel";

const ModuleInspector = ({ opened, close, positions, actorName }) => {
  const { t } = useTranslation();
  const { user, siteId, floorId } = useSelector((state) => state.auth.value);
  const [title, setTitle] = useState(null);
  const [rack, setRack] = useState(null);
  const [working, setWorking] = useState(false);
  const wSize = useWindowSize();

  return (
    <Drawer
      size={400}
      position="right"
      opened={opened}
      onClose={close}
      withCloseButton={false}
    >
      <Tabs mt={"xs"} variant="outline" defaultValue="information">
        <Tabs.List>
          <Tabs.Tab value="information" icon={<IconInfoCircle size={16} />}>
            {t("view.floorViewer.moduleInspector.tabs.information")}
          </Tabs.Tab>
          <Tabs.Tab value="view3d" icon={<IconView360 size={16} />}>
          {t("view.floorViewer.moduleInspector.tabs.view3d")}
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="information" pt="xs">
          <ModuleInformationPanel positions={positions} actorName={actorName}/>
        </Tabs.Panel>

        <Tabs.Panel value="view3d" pt="xs">
          <Stack p={"xs"} mr={"xs"}>
            <Title order={5}>{t("editor.modelStructure.title.partInspector")}</Title>

            <Group h={wSize.height - 70}>
              <Canvas camera={{ position: [0, 15, 20], fov: 25 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} />

                <Select box multiple onChange={console.log}>
                  <SelectebleBox
                    position={[0, 0.5, 0]}
                    dimension={[1, 1, 1]}
                    rotations={[0, 0, 0]}
                    userData={{ id: "test" }}
                  />
                </Select>

                <Grid infiniteGrid position={[0, 0, 0]} />
                <OrbitControls minPolarAngle={0} maxPolarAngle={Math.PI / 2.1} makeDefault />
              </Canvas>
            </Group>

            {/* <Group position="right">
          <Button type="submit">{t("button.accept")}</Button>
          <Button
            onClick={() => {
              close();
            }}
          >
            {t("button.close")}
          </Button>
        </Group> */}
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </Drawer>
  );
};

export default ModuleInspector;
