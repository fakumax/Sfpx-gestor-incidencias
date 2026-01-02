import { Equipo } from '../../entities';
import EquipoDatasource from './EquipoDataSource';
import useEquipoDatasource from './useEquipoDataSource';

function useItemEquipoDatasource(
  listTitle: string,
  properties?: Array<string>,
  expand?: Array<string>
) {
  return useEquipoDatasource<Equipo>(
    new EquipoDatasource(listTitle, properties, expand)
  );
}

export default useItemEquipoDatasource;
