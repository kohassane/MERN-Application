import { UserCollection } from "../models/users.js";
import { EtablissementCollection } from "../models/etablissement.js";
import { CompetitionCollection } from "../models/competition.js";
import { MatchCollection } from "../models/match.js";
import { LicenceCollection } from "../models/licence.js";

export const getStats = async (req, res) => {
  try {
    const [users, etablissements, competitions, matchs, licences] = await Promise.all([
      UserCollection.countDocuments(),
      EtablissementCollection.countDocuments({ statut: "actif" }),
      CompetitionCollection.countDocuments(),
      MatchCollection.countDocuments({ statut: "termine" }),
      LicenceCollection.countDocuments({ statut: "validee" }),
    ]);
    res.json({ users, etablissements, competitions, matchs, licences });
  } catch { res.status(500).json({ message: "Erreur serveur" }); }
};
