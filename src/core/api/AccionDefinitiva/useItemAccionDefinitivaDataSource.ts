import { AccionDefinitiva } from "../../entities";
import { AccionDefinitivaDataSource } from "./AccionDefinitivaDataSource";
import useAccionDefinitivaDataSource from "./useAccionDefinitivaDataSource";
import { USE_MOCK_DATA, AccionDefinitivaMock } from '../../mock';

function useItemAccionDefinitivaDataSource(
  listTitle: string,
  properties?: Array<string>,
  expand?: Array<string>
) {
  const datasource = USE_MOCK_DATA
    ? new AccionDefinitivaMock()
    : new AccionDefinitivaDataSource(listTitle, properties, expand);
  return useAccionDefinitivaDataSource(datasource as any);
}

export default useItemAccionDefinitivaDataSource;
