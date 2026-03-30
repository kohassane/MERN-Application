import {UserCollection} from "../models/users.js"

export const getUser = async (req, res) => {
    try {
        const { uid } = req.body; // ou req.query si tu veux utiliser GET

        if (!uid) {
            return res.json({ message: "id utilisateur requis" });
        }

        const user = await UserCollection.findOne({ uid });

        if (user) {
            return res.json({ message: "Utilisateur trouvé", user });
        } else {
            return res.json({ message: "Utilisateur non trouvé" });
        }

    } catch (error) {
        console.log(error);
        res.json({ message: "Une erreur s'est produite" });
    }
};