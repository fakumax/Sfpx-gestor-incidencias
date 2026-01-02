import { GestionAnormalidad } from "../../entities";
import { GestionAnormalidadDataSource } from "./GestionAnormalidadDataSource";
import useGestionAnormalidadDataSource from "./useGestionAnormalidadDataSource";

function useItemGestionAnormalidadDataSource(
  listTitle: string,
  properties?: Array<string>,
  expand?: Array<string>
) {
  return useGestionAnormalidadDataSource(
    new GestionAnormalidadDataSource(listTitle, properties, expand)
  );
}

export default useItemGestionAnormalidadDataSource;
