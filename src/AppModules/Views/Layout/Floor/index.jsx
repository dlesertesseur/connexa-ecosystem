import SurfaceMap from "./SurfaceMap";
import { useState } from "react";
import StorageStructureDialog from "../../../../Components/Dialogs/StorageStructureDialog";

const DynamicApp = () => {
  const [rack, setRack] = useState(null);
  const [openPlanogram, setOpenPlanogram] = useState(false);

  const inspectRack = (rack) => {
    setRack(rack);
    setOpenPlanogram(true);
  };

  return (
    <>
      <SurfaceMap editingEnabled={false} inspectRack={inspectRack} drawCenter={true} />

      {openPlanogram && rack ? (
        <StorageStructureDialog open={openPlanogram} setOpen={setOpenPlanogram} storageStructure={rack} />
      ) : null}
    </>
  );
};

export default DynamicApp;
