import uuid from "react-uuid";

class StructureBuilder {
  static createShelving(values) {
    const totalX =
      values.numberOfModules * values.moduleWidth + (values.numberOfModules + 1) * values.verticalPanelWidth;
    const totalY = values.moduleHeight;
    const totalZ = values.moduleDepth + values.panelThickness;

    const framesList = StructureBuilder.createSeparators(values);
    framesList.push(StructureBuilder.createBackPanel(values));
    framesList.push(StructureBuilder.createLeftPanel(values));
    framesList.push(StructureBuilder.createRightPanel(values));

    const modulesList = StructureBuilder.createModules(values);

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
    let posX = -((
      (values.numberOfModules) * values.moduleWidth +
      (values.numberOfModules - 1) * values.verticalPanelWidth
    ) / 2);
    posX += values.moduleWidth + mvp;

    for (let index = 0; index < values.numberOfModules - 1 && tm > 0; index++, posX += mw + values.verticalPanelWidth) {
      frames.push(StructureBuilder.createPanel(values, index + 1, posX));
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
      modules.push(StructureBuilder.createModule(values, index + 1, posX));
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

    parts.push(StructureBuilder.createBase(values, number, posX));

    for (
      let index = 0;
      index < values.numberOfShelvesByModule;
      index++, posY -= values.spaceHeight + values.shelfHeight
    ) {
      parts.push(StructureBuilder.createSpace(values, number, posX, posY));
      if(index < (values.numberOfShelvesByModule - 1)){
          parts.push(StructureBuilder.createShelf(values, number, posX, posY - (msh + mslh)));
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
}

export default StructureBuilder;
