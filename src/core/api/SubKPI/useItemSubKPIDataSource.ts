import { SubKPI } from '../../entities';
import SubKPIDatasource from './SubKPIDataSource';
import useSubKPIDatasource from './useSubKPIDataSource';
import { USE_MOCK_DATA, SubKPIMock } from '../../mock';

function useItemSubKPIDatasource(listTitle: string, properties?: Array<string>, expand?: Array<string>) {
    const datasource = USE_MOCK_DATA
        ? new SubKPIMock()
        : new SubKPIDatasource(listTitle, properties, expand);
    return useSubKPIDatasource<SubKPI>(datasource as any);
}

export default useItemSubKPIDatasource;