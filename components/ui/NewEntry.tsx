import { Button, Box, TextField } from "@mui/material";
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import Add from '@mui/icons-material/AddCircleOutlineOutlined';
import { useState, ChangeEvent, useContext } from 'react';
import { EntriesContext } from '../../context/entries';
import { UIContext } from '../../context/ui';


export const NewEntry = () => {

    const { addNewEntry } = useContext(EntriesContext)
    const { isAddingEntry, setIsAddingEntry  } = useContext(UIContext)

    const [inputValue, setInputValue] = useState("")
    const [touch, setTouch] = useState(false)

    const onTextFieldChanged = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setInputValue(e.target.value)
    }

    const onSave = () => {
        if (inputValue.length === 0) return;
        addNewEntry(inputValue)
        setIsAddingEntry(false)
        setTouch(false)
        setInputValue("")
    }

    return (
        <Box sx={{ marginBottom: 2, paddingX: 2 }}>
            {
                isAddingEntry ? (
                    <>
                        <TextField
                            fullWidth
                            sx={{ marginTop: 2, marginBottom: 1 }}
                            autoFocus
                            multiline
                            label="Nueva entrada"
                            helperText={inputValue.length <= 0 && touch && "ingrese un valor"}
                            error={inputValue.length <= 0 && touch}
                            value={inputValue}
                            onChange={onTextFieldChanged}
                            onBlur={() => setTouch(true)}
                        />
                        <Box display="flex" justifyContent="space-between">
                            <Button variant="text" onClick={() => setIsAddingEntry(false)}>
                                Cancelar
                            </Button>
                            <Button
                                variant="outlined"
                                color="secondary"
                                endIcon={<SaveOutlinedIcon />}
                                onClick={onSave}
                            >
                                Guardar
                            </Button>
                        </Box>
                    </>
                )
                    : (
                        <Button
                            startIcon={<Add />}
                            fullWidth
                            variant="outlined"
                            onClick={() => setIsAddingEntry(true)}
                        >
                            Agregar Tarea
                        </Button>
                    )
            }

        </Box>
    )
}
