import { useReducer } from "react";
import { Environment, EnvironmentType } from "@microsoft/sp-core-library";
import { GestionAnormalidad } from "../../entities";
import { createReducer } from "../../utils";
import IGestionAnormalidadDataSource from "./IGestionAnormalidadDataSource";
import { stringIsNullOrEmpty } from "@pnp/core";

const ADD = "ADD";
const EDIT = "EDIT";
const DELETE = "DELETE";
const GET_ALL = "GET_ALL";
const LOAD = "LOAD";
const ERROR = "ERROR";
const GET_BY_ID = "GET_BY_ID";

interface IDatasourceState {
  items: Array<GestionAnormalidad>;
  item?: GestionAnormalidad;
  isLoading: boolean;
  error: boolean;
}

export type DatasourceHook = [
  IDatasourceState,
  () => Promise<void>,
  (item: GestionAnormalidad) => Promise<void>,
  (item: GestionAnormalidad) => Promise<void>,
  (itemId: number) => Promise<void>,
  (itemId: number) => Promise<void>,
  (obiraId: number) => Promise<void>,
];

function useGestionAnormalidadDataSource(
  entityDatasource: IGestionAnormalidadDataSource<GestionAnormalidad>
): DatasourceHook {
  const datasource: IGestionAnormalidadDataSource<GestionAnormalidad> =
    Environment.type === EnvironmentType.SharePoint &&
    entityDatasource &&
    !stringIsNullOrEmpty(entityDatasource.listTitle)
      ? entityDatasource
      : null;

  const datasourceReducer = createReducer<IDatasourceState>({
    [LOAD]: (state) => ({ ...state, isLoading: true, error: false }),
    [ERROR]: (state) => ({ ...state, error: true }),
    [ADD]: (state, action) => ({
      items: [...state.items, action.payload],
      item: action.payload,
      isLoading: false,
      error: false,
    }),
    [EDIT]: (state, action) => ({
      items: state.items.map((entity) =>
        entity.Id === action.payload.Id ? action.payload : entity
      ),
      item: action.payload,
      isLoading: false,
      error: false,
    }),
    [DELETE]: (state, action) => ({
      items: state.items.filter((entity) => entity.Id !== action.payload),
      isLoading: false,
      error: false,
    }),
    [GET_ALL]: (state, action) => ({
      ...state,
      items: action.payload,
      isLoading: false,
      error: false,
    }),
    [GET_BY_ID]: (state, action) => ({
      ...state,
      item: action.payload,
      isLoading: false,
      error: false,
    }),
  });

  const [datasourceState, dispatch] = useReducer(datasourceReducer, {
    items: [],
    isLoading: false,
    error: false,
  });

  const handleAsync =
    (asyncFn: (...args: any[]) => Promise<void>) =>
    async (...args: any[]) => {
      try {
        await asyncFn(...args);
      } catch (error) {
        console.error(error);
        dispatch({ type: ERROR });
      }
    };

  const addItem = handleAsync(async (item: GestionAnormalidad) => {
    dispatch({ type: LOAD });
    const itemResult = await datasource.add(item);
    dispatch({ type: ADD, payload: itemResult });
  });

  const editItem = handleAsync(async (item: GestionAnormalidad) => {
    dispatch({ type: LOAD });
    const itemResult = await datasource.edit(item);
    dispatch({ type: EDIT, payload: itemResult });
  });

  const deleteItem = handleAsync(async (itemId: number) => {
    dispatch({ type: LOAD });
    await datasource.delete(itemId);
    dispatch({ type: DELETE, payload: itemId });
  });

  const getItems = handleAsync(async () => {
    dispatch({ type: LOAD });
    const itemsResult = await datasource.getItems();
    dispatch({ type: GET_ALL, payload: itemsResult });
  });

  const getById = handleAsync(async (itemId: number) => {
    dispatch({ type: LOAD });
    const item = await datasource.getById(itemId);
    dispatch({ type: GET_BY_ID, payload: item });
  });

  const getAnormalidadesByObira = handleAsync(async (obiraId: number) => {
    dispatch({ type: LOAD });
    const items = await datasource.getAnormalidadesByObira(obiraId);
    dispatch({ type: GET_ALL, payload: items });
  });

  return [datasourceState, getItems, addItem, editItem, deleteItem, getById, getAnormalidadesByObira];
}

export default useGestionAnormalidadDataSource;
