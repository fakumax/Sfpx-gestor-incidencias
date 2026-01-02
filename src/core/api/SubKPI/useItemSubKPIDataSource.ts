import { SubKPI } from '../../entities';
import SubKPIDatasource from './SubKPIDataSource';
import useSubKPIDatasource from './useSubKPIDataSource';

function useItemSubKPIDatasource(listTitle: string, properties?: Array<string>, expand?: Array<string>) {
    return useSubKPIDatasource<SubKPI>(new SubKPIDatasource(listTitle, properties, expand));
}

export default useItemSubKPIDatasource;