import { Accion } from '../../entities';
import AccionDatasource from './AccionDatasource';
import useAccionDatasource from './useAccionDatasource';
import { USE_MOCK_DATA, AccionDefinitivaMock } from '../../mock';

function useItemAccionDatasource(listTitle: string, properties?:Array<string>, expand?:Array<string>) {
	const datasource = USE_MOCK_DATA 
		? new AccionDefinitivaMock() 
		: new AccionDatasource(listTitle, properties, expand);
	return useAccionDatasource<Accion>(datasource as any);
}

export default useItemAccionDatasource;
