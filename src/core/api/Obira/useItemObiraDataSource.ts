import { Obira } from "../../entities";
import ObiraDataSource from "./ObiraDataSource";
import useObiraDataSource from "./useObiraDataSource";

function useItemObiraDataSource(
  listTitle: string,
  properties?: Array<string>,
  expand?: Array<string>
) {
  return useObiraDataSource(new ObiraDataSource(listTitle, properties, expand));
}

export default useItemObiraDataSource;
