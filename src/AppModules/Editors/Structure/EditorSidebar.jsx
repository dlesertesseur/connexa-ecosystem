import * as THREE from "three";
import React from "react";
import { ColorPicker, Dialog, Paper, ScrollArea, Stack, TextInput } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useWindowSize } from "../../../Hook";
import { useState } from "react";
import { useEffect } from "react";
import NumberProperty from "../../../Components/NumberProperty";

const EditorSidebar = ({ open, part }) => {
  const { t } = useTranslation();
  const wSize = useWindowSize();

  const [posX, setPosX] = useState();
  const [posY, setPosY] = useState();
  const [posZ, setPosZ] = useState();

  const [rotX, setRotX] = useState();
  const [rotY, setRotY] = useState();
  const [rotZ, setRotZ] = useState();

  const [dimX, setDimX] = useState();
  const [dimY, setDimY] = useState();
  const [dimZ, setDimZ] = useState();

  const [color, setColor] = useState("#f5f5f5");
  const [name, setName] = useState("");

  const panelBaseColor = "#f5f5f5";

  useEffect(() => {
    if (part) {
      const gRot = part.parent;
      const gPos = gRot.parent;

      const pos = gPos.position;
      const rot = gRot.rotation;
      const dim = part.scale;
      const color = part.userData.color;

      setPosX(pos.x);
      setPosY(pos.y);
      setPosZ(pos.z);

      setRotX(THREE.MathUtils.radToDeg(rot.x));
      setRotY(THREE.MathUtils.radToDeg(rot.y));
      setRotZ(THREE.MathUtils.radToDeg(rot.z));

      setDimX(dim.x);
      setDimY(dim.y);
      setDimZ(dim.z);

      setName(part.userData.name);
      setColor(color);
    }
  }, [part]);

  const updateUserData = () => {
    const ud = part.userData;
    const gRot = part.parent;
    const gPos = gRot.parent;

    ud.positionx = posX;
    ud.positiony = posY;
    ud.positionz = posZ;

    ud.rotationx = rotX;
    ud.rotationy = rotY;
    ud.rotationz = rotZ;

    ud.dimensionx = dimX;
    ud.dimensiony = dimY;
    ud.dimensionz = dimZ;

    ud.name = name;

    ud.color = color;

    part.material.color.set(color);

    part.name = name;
    part.scale.set(dimX, dimY, dimZ);
    gRot.rotation.set(THREE.MathUtils.degToRad(rotX), THREE.MathUtils.degToRad(rotY), THREE.MathUtils.degToRad(rotZ));
    gPos.position.set(posX, posY, posZ);
  };

  useEffect(() => {
    if (part) {
      updateUserData();
    }
  }, [name, posX, posY, posZ, rotX, rotY, rotZ, dimX, dimY, dimZ, color]);

  return (
    <Dialog position={{ top: 185, right: 20 }} opened={open} size="mb">
      <ScrollArea h={400}>
        <Stack spacing={"xs"} mb={"xs"}>
          <TextInput size="xs" value={name} onChange={(event) => setName(event.currentTarget.value)} />
        </Stack>

        <Paper withBorder p={"xs"} bg={panelBaseColor} mb={"xs"}>
          <Stack spacing={"xs"}>
            <NumberProperty label={t("label.locationX")} value={posX} setValue={setPosX} />
            <NumberProperty label={t("label.locationY")} value={posY} setValue={setPosY} />
            <NumberProperty label={t("label.locationZ")} value={posZ} setValue={setPosZ} />
          </Stack>
        </Paper>

        <Paper withBorder p={"xs"} bg={panelBaseColor} mb={"xs"}>
          <Stack spacing={"xs"}>
            <NumberProperty label={t("label.rotationX")} value={rotX} setValue={setRotX} />
            <NumberProperty label={t("label.rotationY")} value={rotY} setValue={setRotY} />
            <NumberProperty label={t("label.rotationZ")} value={rotZ} setValue={setRotZ} />
          </Stack>
        </Paper>

        <Paper withBorder p={"xs"} bg={panelBaseColor} mb={"xs"}>
          <Stack spacing={"xs"}>
            <NumberProperty label={t("label.dimensionX")} value={dimX} setValue={setDimX} />
            <NumberProperty label={t("label.dimensionY")} value={dimY} setValue={setDimY} />
            <NumberProperty label={t("label.dimensionZ")} value={dimZ} setValue={setDimZ} />
          </Stack>
        </Paper>

        <Paper withBorder p={"xs"} bg={panelBaseColor}>
          <Stack spacing={"xs"}>
            <ColorPicker format="rgb" value={color} onChange={setColor} fullWidth withPicker={true} />
          </Stack>
        </Paper>
      </ScrollArea>
    </Dialog>
  );
};

export default EditorSidebar;
