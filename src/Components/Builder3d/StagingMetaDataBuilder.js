import uuid from "react-uuid";
import { lpad } from "../../Util";

class StagingMetaDataBuilder {
  static createRack(values) {
    const totalX = values.numberOfModulesX * values.moduleWidth + (values.numberOfModulesX - 1) * values.separationX;
    const totalY = 0;
    const totalZ = values.moduleDepth;

    const modulesList = StagingMetaDataBuilder.createRackModules(values);
    const framesList = [];

    const structure = {
      key: uuid(),
      name: values.name,
      positionx: 0,
      positiony: 0,
      positionz: 0,
      rotationx: 0,
      rotationy: 0,
      rotationz: 0,
      dimensionx: totalX,
      dimensiony: totalY,
      dimensionz: totalZ,
      frames: framesList,
      modules: modulesList,
    };

    return structure;
  }

  static createRackModules(values) {
    const modules = [];
    const mx = parseFloat(values.numberOfModulesX);
    const md = parseFloat(values.moduleDepth);
    const mw = parseFloat(values.moduleWidth);
    const sx = parseFloat(values.separationX);

    let posX = 0;
    let posZ = 0;

    if (mx > 1) {
      posX = -((mx * mw + (mx - 1) * sx) / 2);
    }

    let mNum = 1;
    for (let x = 0; x < mx; x++, posX += mw + sx, mNum++) {
      modules.push(StagingMetaDataBuilder.createRackModule(values, mNum, posX, posZ));
    }

    return modules;
  }

  static createRackModule(values, number, posX, posZ) {
    const parts = [];

    const module = {
      key: uuid(),
      number: number,
      positionx: posX,
      positiony: 0,
      positionz: posZ,
      rotationx: 0,
      rotationy: 0,
      rotationz: 0,
      dimensionx: parseFloat(values.moduleWidth),
      dimensiony: parseFloat(values.baseHeight),
      dimensionz: parseFloat(values.moduleDepth),
      parts: parts,
    };

    parts.push(StagingMetaDataBuilder.createRackBase(values, number));
    return module;
  }

  static createRackBase(values, number) {
    const name = `${values.name}-M${lpad(number, 2, "0")}`;
    const mw = parseFloat(values.moduleWidth) / 2;
    const mx = parseFloat(values.numberOfModulesX);
    const base = {
      key: uuid(),
      number: number,
      name: name,
      positionx: mx > 1 ? mw : 0,
      positiony: 0,
      positionz: 0,
      rotationx: 0,
      rotationy: 0,
      rotationz: 0,
      dimensionx: parseFloat(values.moduleWidth),
      dimensiony: parseFloat(values.baseHeight),
      dimensionz: parseFloat(values.moduleDepth),
      type: 10,
      color: "#00ff00",
      subspaces: [],
    };

    return base;
  }
}

export default StagingMetaDataBuilder;
