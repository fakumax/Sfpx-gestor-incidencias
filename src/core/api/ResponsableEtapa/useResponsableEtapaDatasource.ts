
import { useReducer } from 'react';
import { Environment, EnvironmentType } from '@microsoft/sp-core-library';

import { BaseEntity } from '../../entities';
import { createReducer } from '../../utils';
import { stringIsNullOrEmpty } from '@pnp/core';
import IResponsableEtapaDatasource from './IResponsableEtapaDatasource';

const ADD = 'ADD';
const EDIT = 'EDIT';
const DELETE = 'DELETE';
const GET_ALL = 'GET_ALL';
const LOAD = 'LOAD';
const ERROR = 'ERROR';
const GET_BY_ID = 'GET_BY_ID';

export interface IDatasourceState<TItem extends BaseEntity> {
    items: Array<TItem>;
    item?: TItem;
    isLoading: boolean;
    error: boolean;
}


export type DatasourceHook<TItem extends BaseEntity> = [
    IDatasourceState<TItem>,
    () => Promise<void>,
    (item: TItem) => Promise<void>,
    (item: TItem) => Promise<void>,
    (itemId: number) => Promise<void>,
    (itemId: number) => Promise<void>,
    () => Promise<void>,
    (filter: string) => Promise<void>,
];


function useResponsableEtapaDatasource<TItem extends BaseEntity>(
    entityDatasource: IResponsableEtapaDatasource<TItem>
): DatasourceHook<TItem> {
    const datasource = (Environment.type === EnvironmentType.SharePoint && entityDatasource && !stringIsNullOrEmpty(entityDatasource.listTitle)) ? entityDatasource : undefined;

    const datasourceReducer = createReducer<IDatasourceState<TItem>>({
        [LOAD]: (state) => ({ ...state, isLoading: true, error: false }),
        [ERROR]: (state) => ({ ...state, error: true }),
        [ADD]: (state, action) => ({ items: [...state.items, action.payload], item: action.payload, isLoading: false, error: false }),
        [EDIT]: (state, action) => ({
            items: state.items.map(entity => entity.Id === action.payload.Id ? action.payload : entity),
            item: action.payload,
            isLoading: false,
            error: false
        }),
        [DELETE]: (state, action) => ({
            items: state.items.filter(entity => entity.Id !== action.payload),
            isLoading: false,
            error: false
        }),
        [GET_ALL]: (state, action) => ({ ...state, items: action.payload, isLoading: false, error: false }),
        [GET_BY_ID]: (state, action) => ({ ...state, item: action.payload, isLoading: false, error: false }),
    });

    const [datasourceState, dispatch] = useReducer(datasourceReducer, { items: [], isLoading: false, error: false });

    const handleAsync = (asyncFn: (...args: any[]) => Promise<void>) => (
        async (...args: any[]) => {
            try {
                await asyncFn(...args);
            } catch (error) {
                console.error(error);
                dispatch({ type: ERROR });
            }
        }
    );

    const addItem = handleAsync(async (item: TItem) => {
        if (!datasource) throw new Error('Datasource is not available');
        dispatch({ type: LOAD });
        const itemResult = await datasource.add(item);
        dispatch({ type: ADD, payload: itemResult });
    });

    const editItem = handleAsync(async (item: TItem) => {
        if (!datasource) throw new Error('Datasource is not available');
        dispatch({ type: LOAD });
        const itemResult = await datasource.edit(item);
        dispatch({ type: EDIT, payload: itemResult });
    });

    const deleteItem = handleAsync(async (itemId: number) => {
        if (!datasource) throw new Error('Datasource is not available');
        dispatch({ type: LOAD });
        await datasource.delete(itemId);
        dispatch({ type: DELETE, payload: itemId });
    });

    const getItems = handleAsync(async () => {
        if (!datasource) throw new Error('Datasource is not available');
        dispatch({ type: LOAD });
        const itemsResult = await datasource.getItems();
        dispatch({ type: GET_ALL, payload: itemsResult });
    });

    const getItemsSimple = handleAsync(async () => {
        if (!datasource) throw new Error('Datasource is not available');
        dispatch({ type: LOAD });
        const itemsSimpleResult = await datasource.getItemsSimple();
        dispatch({ type: GET_ALL, payload: itemsSimpleResult });
    });

    const getById = handleAsync(async (itemId: number) => {
        if (!datasource) throw new Error('Datasource is not available');
        dispatch({ type: LOAD });
        const item = await datasource.getById(itemId);
        dispatch({ type: GET_BY_ID, payload: item });
    });

    const getFilteredItems = handleAsync(async (filter: string) => {
        if (!datasource) throw new Error('Datasource is not available');
        dispatch({ type: LOAD });
        const itemsResult = await datasource.getFilteredItems(filter);
        dispatch({ type: GET_ALL, payload: itemsResult });
    });

    return [datasourceState, getItems, addItem, editItem, deleteItem, getById, getItemsSimple, getFilteredItems];
}

export default useResponsableEtapaDatasource;
