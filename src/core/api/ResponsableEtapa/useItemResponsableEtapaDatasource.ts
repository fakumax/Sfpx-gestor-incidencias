

import { ResponsableEtapa } from '../../entities';
import ResponsableEtapaDataSource from './ResponsableEtapaDataSource';
import useResponsableEtapaDatasource from './useResponsableEtapaDatasource';

function useItemResponsableEtapaDatasource(listTitle: string, properties?: Array<string>, expand?: Array<string>) {
	return useResponsableEtapaDatasource<ResponsableEtapa>(new ResponsableEtapaDataSource(listTitle, properties, expand));
}

export default useItemResponsableEtapaDatasource;
