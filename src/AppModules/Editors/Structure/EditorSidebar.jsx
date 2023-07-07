import * as THREE from "three";
import React from "react";
import { Dialog, Paper, ScrollArea, Stack, TextInput } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { AbmStateContext } from "./Context";
import NumberProperty from "../../../Components/NumberProperty";
import CustomColorPicker from "../../../Components/CustomColorPicker";

const EditorSidebar = ({ open, part }) => {
  const { t } = useTranslation();
  const { updateEditedPart } = useContext(AbmStateContext);

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

  const updateUserDataFromObject = () => {
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

  const updateUserDataFromMetadata = (ud) => {
    if (ud) {
      setPosX(ud.positionx * 2.0);
      setPosY(ud.positiony * 2.0);
      setPosZ(ud.positionz * 2.0);

      setRotX(ud.rotationx);
      setRotY(ud.rotationy);
      setRotZ(ud.rotationz);

      setDimX(ud.dimensionx);
      setDimY(ud.dimensiony);
      setDimZ(ud.dimensionz);
    }
  };

  useEffect(() => {
    if (part) {
      updateUserDataFromObject();
    }
  }, [name, posX, posY, posZ, rotX, rotY, rotZ, dimX, dimY, dimZ, color]);

  useEffect(() => {
    console.log(updateEditedPart);
    updateUserDataFromMetadata(updateEditedPart);
  }, [updateEditedPart]);

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
            <CustomColorPicker value={color} onChange={setColor} />
          </Stack>
        </Paper>
      </ScrollArea>
    </Dialog>
  );
};

export default EditorSidebar;
