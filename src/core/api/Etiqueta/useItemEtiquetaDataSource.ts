import { Etiqueta } from '../../entities';
import EtiquetaDataSource from './EtiquetaDataSource';
import useEtiquetaDataSource from './useEtiquetaDataSource';


function useItemEtiquetaDataSource(
    listTitle: string,
    properties?: Array<string>
) {
    return useEtiquetaDataSource<Etiqueta>(
        new EtiquetaDataSource(listTitle, properties)
    );
}

export default useItemEtiquetaDataSource;
