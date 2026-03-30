import {UserCollection} from "../models/users.js"

export const addUser = async (req, res) => {
    try {
        const {nom, prenom, tel, uid} = req.body 
            if (!req?.body){
                return res.json({message: "Données manquantes"})
            }

            const data = new UserCollection ({
                uid, nom, prenom, tel,
            })
            const user = await data.save 

            return res.json({message: "OK", user})

    } catch (error) {
        console.log (error)
        res.json({message: "Une erreur s'est produite"})
    }
}