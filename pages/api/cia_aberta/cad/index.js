import { connectToDatabase } from "../../../../utils/mongodb";
import { hasArgs } from "../../../../utils/utils";

export default async function handler(req, res) {
  if (hasArgs(req.query)) {
    const { db } = await connectToDatabase();
    
    const {
      denomSocial,
      uf,
      dtReg,
      dtCancel,
      sit,
      firstChar,
    } = req.query;

    const projection = {
      cdCvm: 1,
      denomSocial: 1,
      cnpjCia: 1,
      uf: 1,
      sit: 1,
    };
    
    const filtering = {
      ...(denomSocial && {
        denomSocial: { $regex: denomSocial, $options: "i" },
      }),
      ...(uf && uf !== "TODAS" && { uf: uf }),
      ...(dtReg && { dtReg: { $gte: dtReg } }),
      ...(dtCancel && { dtCancel: { $lte: dtCancel } }),
      ...(sit && sit !== "TODAS" && { sit: sit }),
      ...(!denomSocial &&
        firstChar && {
          denomSocial: { $regex: `^${firstChar}`, $options: "i" },
        }),
    };

    const result = await db
      .collection("cia_aberta_cad")
      .find(filtering)
      .project(projection)
      .toArray();

    res.status(200).json(result);
  } else {
    res.status(404);
  }
}