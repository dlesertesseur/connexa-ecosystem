import { useEffect, useState } from "react";
import Viewer from "../AppModules/Views/Layout/FloorViewerMob/Viewer";
import { PIXEL_METER_RELATION } from "../Constants";
import { findAllLayoutMarkersById } from "../DataAccess/LayoutsMarkers";
import { findLayoutByFloorId, findRacksByZoneId } from "../DataAccess/Surfaces";

export function IndoorMap() {
  const [pixelmeterrelation, setPixelmeterrelation] = useState(null);
  const [racks, setRacks] = useState(null);
  const [layouts, setLayouts] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = {
      token:
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJvcmdhbml6YXRpb25JZCI6ImQ2MGQ0YWZkLTRhNTUtNDc0Ni04NmJiLTg3Mjg1NDZjZTZjNCIsInN1YiI6ImRhbmllbC52YXJnYXNAZ21haWwuY29tIiwiZXhwIjoxNjcyNjc3NTU0LCJhdXRob3JpdGllcyI6W119.WSUJeUTUymZMA0x1nULQtudIXku-o_1ZFRl2gZju9vvUhPb0b8ZP8QRrw7H6AAJ5NEDtwG0F-6c1nXyvkwX5rA",
      siteId: "fe742cc4-2bc0-4049-9a32-24cb01e74d26",
      floorId: "0f5bce2f-2b2f-4e73-9885-13080ed0b8f6",
    };


    findLayoutByFloorId(params).then((ret) => {
      console.log("loadData -> ret ", ret);

      console.log("################# IndoorMap ######################");

      const n = (1.0 / ret[0].pixelmeterrelation) * PIXEL_METER_RELATION;
      setPixelmeterrelation(n);

      setLayouts(ret);
      findRacksByZoneId(params).then((ret) => {
        setRacks(ret);
        findAllLayoutMarkersById(params).then((ret) => {
          setMarkers(ret);
          setLoading(false);
        });
      });
    });
  }, []);

  return (
    <div>
      <Viewer layouts={layouts} racks={racks} pixelmeterrelation={pixelmeterrelation} markers={markers} />
    </div>
  );
}
