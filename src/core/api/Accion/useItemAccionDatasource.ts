import { Accion } from '../../entities';
import AccionDatasource from './AccionDatasource';
import useAccionDatasource from './useAccionDatasource';

function useItemAccionDatasource(listTitle: string, properties?:Array<string>, expand?:Array<string>) {
	return useAccionDatasource<Accion>(new AccionDatasource(listTitle, properties, expand));
}

export default useItemAccionDatasource;
