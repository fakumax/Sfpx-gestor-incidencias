import { Proveedor } from '../../entities';
import ProveedorDatasource from './ProveedorDatasource';
import useProveedorDatasource from './useProveedorDatasource';

function useItemProveedorDatasource(listTitle: string, properties?:Array<string>, expand?:Array<string>) {
	return useProveedorDatasource<Proveedor>(new ProveedorDatasource(listTitle, properties, expand));
}

export default useItemProveedorDatasource;
