import uuid from "react-uuid";
import { PRIMITIVE_BOX } from "../../Constants/structures";

class PrimitiveMetaDataBuilder {
  static createBox() {
    const metaData = {
      id: uuid(),
      number: 0,
      name: "BOX",
      positionx: 0,
      positiony: 0.5,
      positionz: 0,
      rotationx: 0,
      rotationy: 0,
      rotationz: 0,
      dimensionx: 1,
      dimensiony: 1,
      dimensionz: 1,
      type: PRIMITIVE_BOX,
    };

    return metaData;
  }
}

export { PrimitiveMetaDataBuilder };
