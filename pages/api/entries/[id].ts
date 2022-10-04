import type { NextApiRequest, NextApiResponse } from 'next'
import mongoose from 'mongoose';
import { db } from '../../../database';
import { Entry, IEntry } from '../../../models';

type Data = {
    message: string
} | IEntry

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    const { id } = req.query;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ message: "el id no es valido" })
    }

    switch (req.method) {
        case "PUT":
            return updateEntry(req, res);
        case "GET":
            return getEntry(req, res);
        case 'DELETE':                     ///// esto modificado
            return deleteEntry(req, res);

        default:
            return res.status(400).json({ message: "el metodo no existe" })
    }


}

const getEntry = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { id } = req.query;

    await db.connect()
    const entryInDB = await Entry.findById(id)
    await db.disconnect()

    if (!entryInDB) {
        return res.status(400).json({ message: "no hay entrada con ese id" })
    }

    return res.status(200).json(entryInDB)
}

const updateEntry = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { id } = req.query;

    await db.connect()

    const entryToUpdate = await Entry.findById(id)

    if (!entryToUpdate) {
        await db.disconnect()
        return res.status(400).json({ message: "no hay entrada con ese id" })
    }

    const {
        description = entryToUpdate.description,
        status = entryToUpdate.status
    } = req.body;

    try {
        const updatedEntry = await Entry.findByIdAndUpdate(id, { description, status }, { runValidators: true, new: true },)
        await db.disconnect()
        res.status(200).json(updatedEntry!)
    } catch (error) {
        await db.disconnect()
        res.status(400).json({ message: "Bad request" })
    }

}

const deleteEntry = async ( req: NextApiRequest, res: NextApiResponse<Data> ) => {
    console.log('entre en el api/entries/id/index.ts')
    const { id } = req.query;   
 
    await db.connect();
    const entryDBTodelete = await Entry.findByIdAndDelete( id );
    await db.disconnect();
 
    console.log('estoy antes del if en  api/entries/id/index.ts')
 
    if ( !entryDBTodelete ) {
        return res.status(400).json({message: 'No hay entrada con ese id ' + id });
    }
    
    return res.status(200).json( entryDBTodelete );
 
} 