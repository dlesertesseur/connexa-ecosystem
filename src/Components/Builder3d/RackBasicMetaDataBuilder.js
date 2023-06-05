import uuid from "react-uuid";
class RackBasicMetaDataBuilder {

  static createRack(values) {
    const totalX = values.numberOfModules * values.beamLength + (values.numberOfModules + 1) * values.columnSide;
    const totalY = values.maxLoadHeight * values.levels;
    const totalZ = values.uprightDepth;
    const posZ = values.uprightDepth / 2;

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
    const totalX = values.numberOfModulesX * values.beamLength + (values.numberOfModulesX - 1) * values.columnSide;
    const totalY = values.be;
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
    const totalX = values.numberOfModules * values.beamLength + (values.numberOfModules - 1) * values.columnSide;
    const totalY = values.maxLoadHeight * values.levels;
    const panel = {
      key: uuid(),
      number: 0,
      name: "COLUMN",
      positionx: totalX / 2 + values.columnSide / 2,
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

  static createSeparatorColumns(values) {
    const frames = [];
    const mw = values.beamLength;
    const mvp = values.columnSide / 2;
    const tm = values.numberOfModulesX;
    const posZ = values.uprightDepth / 2;
    let posX = -((values.numberOfModulesX * values.beamLength + (values.numberOfModulesX - 1) * values.columnSide) / 2);
    posX += values.beamLength + mvp;

    for (let index = 0; index < values.numberOfModulesX - 1 && tm > 0; index++, posX += mw + values.columnSide) {
      frames.push(RackBasicMetaDataBuilder.createSeparatorColumn(values, index + 1, posX, posZ));
      frames.push(RackBasicMetaDataBuilder.createSeparatorColumn(values, index + 1, posX, -posZ));
    }

    return frames;
  }

  static createSeparatorColumn(values, number, posX, posZ) {
    const totalY = values.maxLoadHeight * values.levels;
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
      dimensionx: values.columnSide,
      dimensiony: totalY,
      dimensionz: values.columnSide,
      type: 12,
    };

    return panel;
  }

  static createRackModules(values) {
    const modules = [];
    const mw = values.beamLength / 2;
    const mvp = values.columnSide / 2;
    const tm = values.numberOfModules - 1;
    let posX = -((tm * mw + tm * mvp) / 2);

    for (let index = 0; index < values.numberOfModules; index++, posX += mw + mvp) {
      modules.push(RackBasicMetaDataBuilder.createRackModule(values, index + 1, posX));
    }

    return modules;
  }

  static createRackModule(values, number, posX) {
    const parts = [];
    const mbh = values.baseHeight / 2;
    const msh = values.maxLoadHeight / 2;
    const mslh = values.beamHeight / 2;
    const deltaX = values.beamLength / 4;

    let posY = -(mbh + msh);
    const posZ = values.uprightDepth / 2;
    const module = {
      key: uuid(),
      number: number,
      positionx: posX,
      positiony: mbh,
      positionz: 0,
      rotationx: 0,
      rotationy: 0,
      rotationz: 0,
      dimensionx: values.maxLoadHeight,
      dimensiony: values.baseHeight,
      dimensionz: values.uprightDepth,
      parts: parts,
    };

    parts.push(RackBasicMetaDataBuilder.createRackBase(values, number, posX));

    for (let index = 0; index < values.levels; index++, posY -= values.maxLoadHeight + values.beamHeight) {
      parts.push(RackBasicMetaDataBuilder.createRackSpace(values, number, posX + deltaX, posY));
      parts.push(RackBasicMetaDataBuilder.createRackSpace(values, number, posX - deltaX, posY));
      if (index < values.levels - 1) {
        parts.push(RackBasicMetaDataBuilder.createRackBean(values, number, posX, posY - (msh + mslh), posZ));
        parts.push(RackBasicMetaDataBuilder.createRackBean(values, number, posX, posY - (msh + mslh), -posZ));
      }
    }
    return module;
  }

  static createRackSpace(values, number, posX, posY) {
    const separation = 0.05;
    const space = {
      key: uuid(),
      number: number,
      name: "SPACE",
      positionx: posX,
      positiony: posY,
      positionz: 0,
      rotationx: 0,
      rotationy: 0,
      rotationz: 0,
      dimensionx: values.beamLength / 2 - separation,
      dimensiony: values.maxLoadHeight,
      dimensionz: values.uprightDepth,
      type: 5,
      subspaces: [],
    };

    return space;
  }

  static createRackBean(values, number, posX, posY, posZ) {
    const shelf = {
      key: uuid(),
      number: number,
      name: "BEAN",
      positionx: posX,
      positiony: posY,
      positionz: posZ,
      rotationx: 0,
      rotationy: 0,
      rotationz: 0,
      dimensionx: values.beamLength,
      dimensiony: values.beamHeight,
      dimensionz: values.beamDepth,
      type: 11,
      subspaces: [],
    };

    return shelf;
  }

  static createRackBase(values, number, posX) {
    const base = {
      key: uuid(),
      number: number,
      name: "BASE",
      positionx: posX,
      positiony: 0,
      positionz: 0,
      rotationx: 0,
      rotationy: 0,
      rotationz: 0,
      dimensionx: values.beamLength,
      dimensiony: values.baseHeight,
      dimensionz: values.uprightDepth,
      type: 10,
      subspaces: [],
    };

    return base;
  }

  static createBasicRack(values) {
    const totalX = values.numberOfModulesX * values.beamLength + (values.numberOfModulesX + 1) * values.columnSide;
    const totalY = values.beamHeight;
    const totalZ = values.uprightDepth;
    const posZ = values.uprightDepth / 2;

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

}

export default RackBasicMetaDataBuilder;
