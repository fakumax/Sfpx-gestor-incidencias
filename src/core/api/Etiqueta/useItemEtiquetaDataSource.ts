import { Etiqueta } from '../../entities';
import EtiquetaDataSource from './EtiquetaDataSource';
import useEtiquetaDataSource from './useEtiquetaDataSource';
import { USE_MOCK_DATA, EtiquetaMock } from '../../mock';

function useItemEtiquetaDataSource(
    listTitle: string,
    properties?: Array<string>
) {
    const datasource = USE_MOCK_DATA
        ? new EtiquetaMock()
        : new EtiquetaDataSource(listTitle, properties);
    return useEtiquetaDataSource<Etiqueta>(datasource as any);
}

export default useItemEtiquetaDataSource;
