import { hasArgs } from "../../../../utils/utils.js";
import { connectToDatabase } from "../../../../utils/mongodb";

export default async function handler(req, res) {
  if (hasArgs(req.query)) {
    const { db } = await connectToDatabase();
    const { q } = req.query;
    const projection = { _id: 0, denomCia: 1, cdCvm: 1 };
    const filtering = { denomCia: { $regex: q, $options: "i" } };

    const result = await db
      .collection("cia_aberta_doc")
      .find(filtering)
      .project(projection)
      .toArray();

    res
      .status(200)
      .json(
        Array.from(new Set(result.map((r) => r.cdCvm))).map((cvm) =>
          result.find((c) => c.cdCvm === cvm)
        )
      );
  }
}