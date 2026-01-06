import { Proveedor } from '../../entities';
import ProveedorDatasource from './ProveedorDatasource';
import useProveedorDatasource from './useProveedorDatasource';
import { USE_MOCK_DATA, ProveedorMock } from '../../mock';

function useItemProveedorDatasource(listTitle: string, properties?:Array<string>, expand?:Array<string>) {
	const datasource = USE_MOCK_DATA 
		? new ProveedorMock() 
		: new ProveedorDatasource(listTitle, properties, expand);
	return useProveedorDatasource<Proveedor>(datasource as any);
}

export default useItemProveedorDatasource;
