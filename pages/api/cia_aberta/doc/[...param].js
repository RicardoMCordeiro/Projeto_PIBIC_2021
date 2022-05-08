import { hasArgs } from "../../../../utils/utils.js";
import { connectToDatabase } from "../../../../utils/mongodb";

export default async function handler(req, res) {
  if (hasArgs(req.query)) {
    const { db } = await connectToDatabase();

    const { param } = req.query;

    if (param.length === 6) {
      const periods = ["03-31", "06-30", "09-30"];
      const filtering = {
        tipo: param[0],
        ano: param[1],
        demonstrativo: param[2],
        info: param[3],
        cdCvm: parseInt(param[4]),
      };

      if (filtering.tipo != "DFP") {
        filtering.dtRefer = `${filtering.ano}-${periods[param[5]]}`;
      }

      const result = await db
        .collection("cia_aberta_doc")
        .find(filtering)
        .limit(1)
        .toArray();

      res.status(200).json(result);
    } else {
      res.status(404);
    }
  } else {
    res.status(404);
  }
}