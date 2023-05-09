import EditablePolygon from "./EditablePolygon";

const EditingLayout = ({
  layout,
  pixelMeterRelation,
  center = false,
  parts,
  setParts,
  selectedPartId,
  editingPartId,
  editPointSelected,
  setEditPointSelected,
}) => {
  const updatePart = (partId, geometry) => {
    const ret = parts?.map((p) => {
      if (p.id === partId) {
        p.geometry = geometry;
      }
      return p;
    });

    setParts(ret);
  };

  const updatePartLocation = (partId, location) => {
    const part = parts.find((p) => p.id === partId);
    if (part) {
      part.positionx = location.x;
      part.positionz = location.y;
    }
  };

  const ret = parts?.map((part) => {
    return (
      <EditablePolygon
        key={part.id}
        partId={part.id}
        x={part.positionx * pixelMeterRelation}
        y={part.positionz * pixelMeterRelation}
        rotation={part.rotationy}
        width={part.dimensionx}
        height={part.dimensionz}
        color={part.color}
        borderColor={part.borderColor}
        geometry={part.geometries[0]}
        type={part.primitivetype}
        pixelMeterRelation={pixelMeterRelation}
        name={layout.name}
        updatePart={updatePart}
        updatePartLocation={updatePartLocation}
        selected={part.id === selectedPartId}
        editing={part.id === editingPartId}
        editPointSelected={editPointSelected}
        setEditPointSelected={setEditPointSelected}
      />
    );
  });

  return ret;
};

export default EditingLayout;
