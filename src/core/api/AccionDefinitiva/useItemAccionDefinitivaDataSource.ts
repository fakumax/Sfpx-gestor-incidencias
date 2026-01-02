import { AccionDefinitiva } from "../../entities";
import { AccionDefinitivaDataSource } from "./AccionDefinitivaDataSource";
import useAccionDefinitivaDataSource from "./useAccionDefinitivaDataSource";

function useItemAccionDefinitivaDataSource(
  listTitle: string,
  properties?: Array<string>,
  expand?: Array<string>
) {
  return useAccionDefinitivaDataSource(
    new AccionDefinitivaDataSource(listTitle, properties, expand)
  );
}

export default useItemAccionDefinitivaDataSource;
