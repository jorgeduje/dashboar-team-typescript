import { EntriesState } from './';
import { Entry } from '../../interfaces';

type EntriesActionType =
    | { type: 'Add-Entry', payload: Entry }
    | { type: 'Entry-Updated', payload: Entry }
    | { type: 'Refresh Data', payload: Entry[] }
    | { type: '[Entry] - Entry-Deleted', payload: Entry }


export const entriesReducer = (state: EntriesState, action: EntriesActionType): EntriesState => {

    switch (action.type) {
        case 'Add-Entry':
            return {
                ...state,
                entries: [...state.entries, action.payload]
            }
        case 'Entry-Updated':
            return {
                ...state,
                entries: state.entries.map(entry => {
                    if (entry._id === action.payload._id) {
                        entry.status = action.payload.status
                        entry.description = action.payload.description
                    }
                    return entry
                })
            }
        case "Refresh Data":
            return {
                ...state,
                entries: [...action.payload]
            }
        case '[Entry] - Entry-Deleted':
            return {
                ...state,
                entries: state.entries.filter(entry => entry._id !== action.payload._id)
            }
        default:
            return state;
    }

}