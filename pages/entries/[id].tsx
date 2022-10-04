import { capitalize, Button, Card, CardActions, CardContent, CardHeader, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, TextField, IconButton } from "@mui/material"
import { Layout } from "../../components/layouts"
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { EntryStatus, Entry } from "../../interfaces";
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import { ChangeEvent, FC, useMemo, useState, useContext } from 'react';
import { GetServerSideProps } from 'next'
import { dbEntries } from "../../database";
import { EntriesContext } from '../../context/entries/EntriesContext';
import { useRouter } from 'next/router';
import { dateFunctions } from "../../utils";


const validStatus: EntryStatus[] = ['pending', 'in-progress', "finished"]

interface Props {
    entry: Entry

}

export const EntryPage: FC<Props> = ({ entry }) => {

    const { updateEntry, deleteEntry } = useContext(EntriesContext)
    const [inputValue, setInputValue] = useState(entry.description);
    const [status, setStatus] = useState<EntryStatus>(entry.status);
    const [touched, setTouched] = useState(false);
    const router = useRouter();

    const isNotValid = useMemo(() => inputValue.length <= 0 && touched, [inputValue, touched])

    const onInputValueChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setInputValue(e.target.value)
    }

    const onStatusChanged = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setStatus(e.target.value as EntryStatus)
    }

    const onSave = () => {
        if (inputValue.trim().length === 0) return;
        const updatedEntry: Entry = {
            ...entry,
            status,
            description: inputValue
        }
        updateEntry(updatedEntry, true)
        router.push('/')

    }

    const onDelete = () => {    ///// esto modificado
        deleteEntry( entry, true );
        router.push('/')
    }



    return (
        <Layout title={inputValue.substring(0, 20) + "...."}>

            <Grid
                container
                justifyContent='center'
                sx={{ marginTop: 2 }}
            >
                <Grid item xs={12} sm={8} md={6}>
                    <Card>
                        <CardHeader title={`Entrada:`} subheader={`creada ${dateFunctions.getFormatDistanceToNow(entry.createdAt)}`} />
                        <CardContent>
                            <TextField
                                sx={{ marginTop: 2, marginBotttom: 1 }}
                                fullWidth
                                label="nueva entrada"
                                multiline
                                autoFocus
                                value={inputValue}
                                onChange={onInputValueChange}
                                helperText={isNotValid && 'Ingrese un valor'}
                                onBlur={() => setTouched(true)}
                                error={isNotValid}
                            />

                            <FormControl>
                                <FormLabel>Estado:</FormLabel>
                                <RadioGroup row value={status} onChange={onStatusChanged}>
                                    {
                                        validStatus.map(option => (
                                            <FormControlLabel
                                                key={option}
                                                value={option}
                                                control={<Radio />}
                                                label={capitalize(option)}
                                            />
                                        ))
                                    }
                                </RadioGroup>
                            </FormControl>
                        </CardContent>
                        <CardActions>
                            <Button startIcon={<SaveOutlinedIcon />}
                                variant="contained"
                                fullWidth
                                onClick={onSave}
                                disabled={inputValue.length <= 0}
                            >
                                Save
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>

            <IconButton
            onClick={ onDelete }    
            sx={{
                position: 'fixed',
                bottom: 30,
                right: 30,
                backgroundColor: "error.dark"
            }}>
                <DeleteForeverOutlinedIcon />
            </IconButton>
        </Layout>
    )
};




export const getServerSideProps: GetServerSideProps = async ({ params }) => {

    const { id } = params as { id: string };

    const entry = await dbEntries.getEntryById(id)


    if (!entry) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            }
        }
    }

    return {
        props: {
            entry
        }
    }
}



export default EntryPage