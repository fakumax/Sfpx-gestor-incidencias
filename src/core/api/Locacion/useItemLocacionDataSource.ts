import { Locacion } from '../../entities';
import LocacionDatasource from './LocacionDataSource';
import useLocacionDatasource from './useLocacionDataSource';

function useItemLocacionDatasource(
  listTitle: string,
  properties?: Array<string>,
  expand?: Array<string>
) {
  return useLocacionDatasource<Locacion>(
    new LocacionDatasource(listTitle, properties, expand)
  );
}

export default useItemLocacionDatasource;
