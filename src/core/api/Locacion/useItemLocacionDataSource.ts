import { Locacion } from '../../entities';
import LocacionDatasource from './LocacionDataSource';
import useLocacionDatasource from './useLocacionDataSource';
import { USE_MOCK_DATA, LocacionMock } from '../../mock';

function useItemLocacionDatasource(
  listTitle: string,
  properties?: Array<string>,
  expand?: Array<string>
) {
  const datasource = USE_MOCK_DATA
    ? new LocacionMock()
    : new LocacionDatasource(listTitle, properties, expand);
  return useLocacionDatasource<Locacion>(datasource as any);
}

export default useItemLocacionDatasource;
