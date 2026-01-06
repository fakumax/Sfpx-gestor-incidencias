import { GestionAnormalidad } from "../../entities";
import { GestionAnormalidadDataSource } from "./GestionAnormalidadDataSource";
import useGestionAnormalidadDataSource from "./useGestionAnormalidadDataSource";
import { USE_MOCK_DATA, GestionAnormalidadMock } from '../../mock';

function useItemGestionAnormalidadDataSource(
  listTitle: string,
  properties?: Array<string>,
  expand?: Array<string>
) {
  const datasource = USE_MOCK_DATA
    ? new GestionAnormalidadMock()
    : new GestionAnormalidadDataSource(listTitle, properties, expand);
  return useGestionAnormalidadDataSource(datasource as any);
}

export default useItemGestionAnormalidadDataSource;
