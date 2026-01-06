import { Obira } from "../../entities";
import ObiraDataSource from "./ObiraDataSource";
import useObiraDataSource from "./useObiraDataSource";
import { USE_MOCK_DATA, ObiraMock } from '../../mock';

function useItemObiraDataSource(
  listTitle: string,
  properties?: Array<string>,
  expand?: Array<string>
) {
  const datasource = USE_MOCK_DATA
    ? new ObiraMock()
    : new ObiraDataSource(listTitle, properties, expand);
  return useObiraDataSource(datasource as any);
}

export default useItemObiraDataSource;
