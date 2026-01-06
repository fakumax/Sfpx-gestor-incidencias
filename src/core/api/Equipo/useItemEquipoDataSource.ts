import { Equipo } from '../../entities';
import EquipoDatasource from './EquipoDataSource';
import useEquipoDatasource from './useEquipoDataSource';
import { USE_MOCK_DATA, EquipoMock } from '../../mock';

function useItemEquipoDatasource(
  listTitle: string,
  properties?: Array<string>,
  expand?: Array<string>
) {
  const datasource = USE_MOCK_DATA
    ? new EquipoMock()
    : new EquipoDatasource(listTitle, properties, expand);
  return useEquipoDatasource<Equipo>(datasource as any);
}

export default useItemEquipoDatasource;
