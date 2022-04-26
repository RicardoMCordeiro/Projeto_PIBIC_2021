import { connectToDatabase } from "./mongodb";

export async function getCia(cvm) {
  const { db } = await connectToDatabase();

  const result = await db
    .collection("cia_aberta_cad")
    .find({ cdCvm: parseInt(cvm) })
    .project({ _id: 0 })
    .toArray();

  return result || [];
}