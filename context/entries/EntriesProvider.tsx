import { FC, useEffect, useReducer } from 'react';
import { EntriesContext, entriesReducer } from './';
import { Entry } from '../../interfaces';
import { entriesApi } from '../../apis';
import { useSnackbar } from 'notistack';



export interface EntriesState {
    entries: Entry[];
}

const Entries_INITIAL_STATE: EntriesState = {
    entries: [],
}

interface Props {
    children: JSX.Element | JSX.Element[]
}


export const EntriesProvider: FC<Props> = ({ children }) => {

    const [state, dispatch] = useReducer(entriesReducer, Entries_INITIAL_STATE)
    const { enqueueSnackbar } = useSnackbar();

    //CREAR UNA ENTRADA
    const addNewEntry = async (description: string) => {

        const { data } = await entriesApi.post<Entry>("/entries", { description })

        dispatch({ type: 'Add-Entry', payload: data })
    }

    // TRAER LAS ENTRADAS AL CARGAR EL HOME
    const refreshEntries = async () => {
        const { data } = await entriesApi.get<Entry[]>("/entries")
        dispatch({ type: "Refresh Data", payload: data })
    }

    // ACTUALIZAR UNA ENTRADA
    const updateEntry = async ({ _id, description, status }: Entry, showSnackbar = false) => {


        try {

            const { data } = await entriesApi.put<Entry>(`/entries/${_id}`, { description, status })

            dispatch({ type: "Entry-Updated", payload: data })

            if (showSnackbar) {

                enqueueSnackbar('Entrada actualizada', {

                    variant: "success",
                    autoHideDuration: 1500,
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right'
                    }

                })
            }

        } catch (error) {

        }

    }

    useEffect(() => {
        refreshEntries()
    }, [])

    const deleteEntry = async (entry: Entry, showSnackbar = false) => {
        try {
            const { data } = await entriesApi.delete<Entry>(`/entries/${entry._id}`)

            dispatch({
                type: '[Entry] - Entry-Deleted',
                payload: data
            })

            if (showSnackbar) {
                enqueueSnackbar('Entrada borrada correctamente', {
                    variant: 'success',
                    autoHideDuration: 1500,
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right',
                    }
                })
            }



        } catch (error) {
            console.log({ error });
        }
    }

    return (
        <EntriesContext.Provider value={{
            ...state,
            addNewEntry,
            updateEntry,
            deleteEntry
        }}>
            {children}
        </EntriesContext.Provider>
    )
}