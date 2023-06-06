import uuid from "react-uuid";
import { lpad } from "../../Util";
class RackBasicMetaDataBuilder {
  static createRack(values) {
    const totalX = values.numberOfModulesX * values.moduleWidth + (values.numberOfModulesX + 1) * values.columnSide;
    const totalY = values.columnHeight;
    const totalZ = values.moduleDepth * values.numberOfModulesZ;
    const posZ = totalZ / 2;

    const framesList = RackBasicMetaDataBuilder.createSeparatorColumns(values);

    framesList.push(RackBasicMetaDataBuilder.createLeftColumns(values, posZ));
    framesList.push(RackBasicMetaDataBuilder.createLeftColumns(values, -posZ));
    framesList.push(RackBasicMetaDataBuilder.createRightColumns(values, posZ));
    framesList.push(RackBasicMetaDataBuilder.createRightColumns(values, -posZ));

    const modulesList = RackBasicMetaDataBuilder.createRackModules(values);

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

  static createLeftColumns(values, posZ) {
    const totalX = values.numberOfModulesX * values.moduleWidth + (values.numberOfModulesX - 1) * values.columnSide;
    const totalY = values.columnHeight;
    const panel = {
      key: uuid(),
      number: 0,
      name: "COLUMN",
      positionx: -(totalX / 2 + values.columnSide / 2),
      positiony: totalY / 2,
      positionz: posZ,
      rotationx: 0,
      rotationy: 0,
      rotationz: 0,
      dimensionx: values.columnSide,
      dimensiony: totalY,
      dimensionz: values.columnSide,
      type: 12,
    };

    return panel;
  }

  static createRightColumns(values, posZ) {
    const totalX = parseFloat(values.numberOfModulesX) * parseFloat(values.moduleWidth) + (parseFloat(values.numberOfModulesX) - 1) * parseFloat(values.columnSide);
    const totalY = parseFloat(values.columnHeight);
    const panel = {
      key: uuid(),
      number: 0,
      name: "COLUMN",
      positionx: totalX / 2 + parseFloat(values.columnSide) / 2,
      positiony: totalY / 2,
      positionz: posZ,
      rotationx: 0,
      rotationy: 0,
      rotationz: 0,
      dimensionx: parseFloat(values.columnSide),
      dimensiony: totalY,
      dimensionz: parseFloat(values.columnSide),
      type: 12,
    };

    return panel;
  }

  static createSeparatorColumns(values) {
    const frames = [];
    const mw = parseFloat(values.moduleWidth);
    const mvp = parseFloat(values.columnSide) / 2;
    const tm = parseFloat(values.numberOfModulesX);
    const posZ = (parseFloat(values.moduleDepth) * parseFloat(values.numberOfModulesZ)) / 2;
    let posX = -(
      (parseFloat(values.numberOfModulesX) * parseFloat(values.moduleWidth) +
        (parseFloat(values.numberOfModulesX) - 1) * parseFloat(values.columnSide)) /
      2
    );
    posX += parseFloat(values.moduleWidth) + mvp;

    for (
      let index = 0;
      index < parseFloat(values.numberOfModulesX) - 1 && tm > 0;
      index++, posX += mw + parseFloat(values.columnSide)
    ) {
      frames.push(RackBasicMetaDataBuilder.createSeparatorColumn(values, index + 1, posX, posZ));
      frames.push(RackBasicMetaDataBuilder.createSeparatorColumn(values, index + 1, posX, -posZ));
    }

    return frames;
  }

  static createSeparatorColumn(values, number, posX, posZ) {
    const totalY = parseFloat(values.columnHeight);
    const colSide = parseFloat(values.columnSide);
    const panel = {
      key: uuid(),
      number: number,
      name: "SEPARATOR COLUMN",
      positionx: posX,
      positiony: totalY / 2,
      positionz: posZ,
      rotationx: 0,
      rotationy: 0,
      rotationz: 0,
      dimensionx: colSide,
      dimensiony: totalY,
      dimensionz: colSide,
      type: 12,
    };
    return panel;
  }

  static createRackModules(values) {
    const modules = [];
    const mx = parseFloat(values.numberOfModulesX);
    const mz = parseFloat(values.numberOfModulesZ);
    const mDepth = parseFloat(values.moduleDepth);
    const mw = parseFloat(values.moduleWidth) / 2;
    const mvp = parseFloat(values.columnSide) / 2;
    const tm = parseFloat(values.numberOfModulesX) - 1;
    const totZ = parseFloat(values.moduleDepth) * mz;
    const deltaZ = parseFloat(values.moduleDepth) / 2;

    let posX = -((tm * mw + tm * mvp) / 2);
    let posZ = -(totZ / 2) + deltaZ;

    for (let z = 0; z < mz; z++, posZ += mDepth) {
      for (let index = 0; index < mx; index++, posX += mw + mvp) {
        modules.push(
          RackBasicMetaDataBuilder.createRackModule(values, index + 1, posX, posZ, mz - z)
        );
      }
      posX = -((tm * mw + tm * mvp) / 2);
    }

    return modules;
  }

  static createRackModule(values, number, posX, posZ, zOrder) {
    const parts = [];
    const mbh = parseFloat(values.baseHeight) / 2;
    const deltaZ = parseFloat(values.moduleWidth) / 4;

    const module = {
      key: uuid(),
      number: number,
      positionx: posX,
      positiony: mbh,
      positionz: 0,
      rotationx: 0,
      rotationy: 0,
      rotationz: 0,
      dimensionx: parseFloat(values.moduleWidth),
      dimensiony: parseFloat(values.baseHeight),
      dimensionz: parseFloat(values.moduleDepth),
      parts: parts,
    };

    parts.push(RackBasicMetaDataBuilder.createRackBase(values, number, posX - deltaZ, posZ, "L", zOrder));
    parts.push(RackBasicMetaDataBuilder.createRackBase(values, number, posX + deltaZ, posZ, "R", zOrder));
    return module;
  }

  static createRackBase(values, number, posX, posZ, xOrder, zOrder) {
    const name = `${values.name}-M${lpad(number, 2, "0")}-${xOrder + 1}${zOrder}`;
    const base = {
      key: uuid(),
      number: number,
      name: name,
      positionx: posX,
      positiony: 0,
      positionz: posZ,
      rotationx: 0,
      rotationy: 0,
      rotationz: 0,
      dimensionx: parseFloat(values.moduleWidth) / 2,
      dimensiony: parseFloat(values.baseHeight),
      dimensionz: parseFloat(values.moduleDepth),
      type: 10,
      subspaces: [],
    };

    return base;
  }
}

export default RackBasicMetaDataBuilder;
