import { ResponsableEtapa } from '../../entities';
import ResponsableEtapaDataSource from './ResponsableEtapaDataSource';
import useResponsableEtapaDatasource from './useResponsableEtapaDatasource';
import { USE_MOCK_DATA, ResponsableEtapaMock } from '../../mock';

function useItemResponsableEtapaDatasource(listTitle: string, properties?: Array<string>, expand?: Array<string>) {
	const datasource = USE_MOCK_DATA
		? new ResponsableEtapaMock()
		: new ResponsableEtapaDataSource(listTitle, properties, expand);
	return useResponsableEtapaDatasource<ResponsableEtapa>(datasource as any);
}

export default useItemResponsableEtapaDatasource;
