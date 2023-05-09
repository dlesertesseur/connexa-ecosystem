import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { findRackById } from "../../../DataAccess/Surfaces";
import { Dialog } from "@mantine/core";

const StorageStructureDialog = ({ open, setOpen, storageStructure }) => {
  const { user } = useSelector((state) => state.auth.value);

  const [setLoadingData] = useState(true);
  const [setRack] = useState(null);

  useEffect(() => {
    const params = {
      token: user.token,
      id: storageStructure.id,
    };

    findRackById(params).then((ret) => {
      setLoadingData(false);
      setRack(ret);
    });

    console.log("StorageStructureDialog::useEffect");
  }, [setLoadingData, setRack, storageStructure, user]);

  function handleClose() {
    setOpen(false);
  }

  return (
    <Dialog fullScreen={false} fullWidth={true} maxWidth={"lg"} open={open} onClose={handleClose}>
      {/* <DialogTitle>{t("dialog.storageStructure.title") + " " + storageStructure.name}</DialogTitle>
      <DialogContent>
        <Group display={"flex"} justifyContent={"center"} alignItems={"center"}>
          {loadingData ? (
            <CircularProgress sx={{ marginTop: 10 }} />
          ) : (
            <StorageStructureView
              dimensions={{ width: 1000, height: 600 }}
              rack={rack}
              pixelMeterRelation={150.0}
              showCenterPoint={false}
            />
          )}
        </Group>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleClose}>
          {t("button.close")}
        </Button>
      </DialogActions>

      {console.log("REPAINT ----> StorageStructureDialog " + Date.now())} */}
    </Dialog>
  );
};

export default StorageStructureDialog;
