import uuid from "react-uuid";

class StructureMetaDataBuilder {
  static createShelving(values) {
    const totalX =
      values.numberOfModules * values.moduleWidth + (values.numberOfModules + 1) * values.verticalPanelWidth;
    const totalY = values.moduleHeight;
    const totalZ = values.moduleDepth + values.panelThickness;

    const framesList = StructureMetaDataBuilder.createSeparators(values);
    framesList.push(StructureMetaDataBuilder.createBackPanel(values));
    framesList.push(StructureMetaDataBuilder.createLeftPanel(values));
    framesList.push(StructureMetaDataBuilder.createRightPanel(values));

    const modulesList = StructureMetaDataBuilder.createModules(values);

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

  static createSeparators(values) {
    const frames = [];
    const mw = values.moduleWidth;
    const mvp = values.verticalPanelWidth / 2;
    const tm = values.numberOfModules;
    let posX = -(
      (values.numberOfModules * values.moduleWidth + (values.numberOfModules - 1) * values.verticalPanelWidth) /
      2
    );
    posX += values.moduleWidth + mvp;

    for (let index = 0; index < values.numberOfModules - 1 && tm > 0; index++, posX += mw + values.verticalPanelWidth) {
      frames.push(StructureMetaDataBuilder.createPanel(values, index + 1, posX));
    }

    return frames;
  }

  static createModules(values) {
    const modules = [];
    const mw = values.moduleWidth / 2;
    const mvp = values.verticalPanelWidth / 2;
    const tm = values.numberOfModules - 1;
    let posX = -((tm * mw + tm * mvp) / 2);

    for (let index = 0; index < values.numberOfModules; index++, posX += mw + mvp) {
      modules.push(StructureMetaDataBuilder.createModule(values, index + 1, posX));
    }

    return modules;
  }

  static createModule(values, number, posX) {
    const parts = [];
    const mbh = values.baseHeight / 2;
    const msh = values.spaceHeight / 2;
    const mslh = values.shelfHeight / 2;

    let posY = -(mbh + msh);

    const module = {
      key: uuid(),
      number: number,
      positionx: posX,
      positiony: mbh,
      positionz: 0,
      rotationx: 0,
      rotationy: 0,
      rotationz: 0,
      dimensionx: values.moduleWidth,
      dimensiony: values.baseHeight,
      dimensionz: values.moduleDepth,
      parts: parts,
    };

    parts.push(StructureMetaDataBuilder.createBase(values, number, posX));

    for (
      let index = 0;
      index < values.numberOfShelvesByModule;
      index++, posY -= values.spaceHeight + values.shelfHeight
    ) {
      parts.push(StructureMetaDataBuilder.createSpace(values, number, posX, posY));
      if (index < values.numberOfShelvesByModule - 1) {
        parts.push(StructureMetaDataBuilder.createShelf(values, number, posX, posY - (msh + mslh)));
      }
    }
    return module;
  }

  static createSpace(values, number, posX, posY) {
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
      dimensionx: values.moduleWidth,
      dimensiony: values.spaceHeight,
      dimensionz: values.moduleDepth,
      type: 5,
      subspaces: [],
    };

    return space;
  }

  static createShelf(values, number, posX, posY) {
    const shelf = {
      key: uuid(),
      number: number,
      name: "SHELF",
      positionx: posX,
      positiony: posY,
      positionz: 0,
      rotationx: 0,
      rotationy: 0,
      rotationz: 0,
      dimensionx: values.moduleWidth,
      dimensiony: values.shelfHeight,
      dimensionz: values.moduleDepth,
      type: 4,
      subspaces: [],
    };

    return shelf;
  }

  static createBase(values, number, posX) {
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
      dimensionx: values.moduleWidth,
      dimensiony: values.baseHeight,
      dimensionz: values.moduleDepth,
      type: 2,
      subspaces: [],
    };

    return base;
  }

  static createBackPanel(values) {
    const totalX =
      values.numberOfModules * values.moduleWidth + (values.numberOfModules + 1) * values.verticalPanelWidth;
    const panel = {
      key: uuid(),
      number: 0,
      name: "BACK PANEL",
      positionx: 0,
      positiony: values.moduleHeight / 2,
      positionz: -(values.moduleDepth / 2 + values.panelThickness / 2),
      rotationx: 0,
      rotationy: 0,
      rotationz: 0,
      dimensionx: totalX,
      dimensiony: values.moduleHeight,
      dimensionz: values.panelThickness,
      type: 1,
    };

    return panel;
  }

  static createLeftPanel(values) {
    const totalX =
      values.numberOfModules * values.moduleWidth + (values.numberOfModules - 1) * values.verticalPanelWidth;
    const panel = {
      key: uuid(),
      number: 0,
      name: "VERTICAL PANEL",
      positionx: -(totalX / 2 + values.verticalPanelWidth / 2),
      positiony: values.moduleHeight / 2,
      positionz: 0,
      rotationx: 0,
      rotationy: 0,
      rotationz: 0,
      dimensionx: values.verticalPanelWidth,
      dimensiony: values.moduleHeight,
      dimensionz: values.moduleDepth,
      type: 1,
    };

    return panel;
  }

  static createRightPanel(values) {
    const totalX =
      values.numberOfModules * values.moduleWidth + (values.numberOfModules - 1) * values.verticalPanelWidth;
    const panel = {
      key: uuid(),
      number: 0,
      name: "VERTICAL PANEL",
      positionx: totalX / 2 + values.verticalPanelWidth / 2,
      positiony: values.moduleHeight / 2,
      positionz: 0,
      rotationx: 0,
      rotationy: 0,
      rotationz: 0,
      dimensionx: values.verticalPanelWidth,
      dimensiony: values.moduleHeight,
      dimensionz: values.moduleDepth,
      type: 1,
    };

    return panel;
  }

  static createPanel(values, number, posX) {
    const panel = {
      key: uuid(),
      number: number,
      name: "VERTICAL PANEL",
      positionx: posX,
      positiony: values.moduleHeight / 2,
      positionz: 0,
      rotationx: 0,
      rotationy: 0,
      rotationz: 0,
      dimensionx: values.verticalPanelWidth,
      dimensiony: values.moduleHeight,
      dimensionz: values.moduleDepth,
      type: 1,
    };

    return panel;
  }

  static createRack(values) {
    const totalX = values.numberOfModules * values.beamLength + (values.numberOfModules + 1) * values.columnSide;
    const totalY = values.maxLoadHeight * values.levels;
    const totalZ = values.uprightDepth;
    const posZ = (values.uprightDepth / 2);

    const framesList = StructureMetaDataBuilder.createSeparatorColumns(values);
    framesList.push(StructureMetaDataBuilder.createLeftColumns(values, posZ));
    framesList.push(StructureMetaDataBuilder.createLeftColumns(values, -posZ));
    framesList.push(StructureMetaDataBuilder.createRightColumns(values, posZ));
    framesList.push(StructureMetaDataBuilder.createRightColumns(values, -posZ));

    const modulesList = StructureMetaDataBuilder.createRackModules(values);

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
    const totalX = values.numberOfModules * values.beamLength + (values.numberOfModules - 1) * values.columnSide;
    const totalY = values.maxLoadHeight * values.levels;
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
    const tm = values.numberOfModules;
    const posZ = (values.uprightDepth / 2);
    let posX = -(
      (values.numberOfModules * values.beamLength + (values.numberOfModules - 1) * values.columnSide) /
      2
    );
    posX += values.beamLength + mvp;

    for (let index = 0; index < values.numberOfModules - 1 && tm > 0; index++, posX += mw + values.columnSide) {
      frames.push(StructureMetaDataBuilder.createSeparatorColumn(values, index + 1, posX, posZ));
      frames.push(StructureMetaDataBuilder.createSeparatorColumn(values, index + 1, posX, -posZ));    }

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
      modules.push(StructureMetaDataBuilder.createRackModule(values, index + 1, posX));
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
    const posZ = (values.uprightDepth / 2);
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

    parts.push(StructureMetaDataBuilder.createRackBase(values, number, posX));

    for (
      let index = 0;
      index < values.levels;
      index++, posY -= values.maxLoadHeight + values.beamHeight
    ) {
      parts.push(StructureMetaDataBuilder.createRackSpace(values, number, posX + deltaX, posY));
      parts.push(StructureMetaDataBuilder.createRackSpace(values, number, posX - deltaX, posY));
      if (index < values.levels - 1) {
        parts.push(StructureMetaDataBuilder.createRackBean(values, number, posX, posY - (msh + mslh), posZ));
        parts.push(StructureMetaDataBuilder.createRackBean(values, number, posX, posY - (msh + mslh), -posZ));
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
      dimensionx: (values.beamLength / 2) - separation,
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

}

export default StructureMetaDataBuilder;
