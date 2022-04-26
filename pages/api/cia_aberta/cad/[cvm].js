import { connectToDatabase } from "../../../../utils/mongodb";
import { hasArgs } from "../../../../utils/utils";
import { getCia } from "../../../../utils/api.js";

export default async function handler(req, res) {
  if (hasArgs(req.query)) {
    const { cvm } = req.query;
    const result = await getCia(cvm);

    res.status(200).json(result);
  } else {
    res.status(404);
  }
}