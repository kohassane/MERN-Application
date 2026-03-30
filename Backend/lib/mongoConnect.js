import mongoose from "mongoose"


export const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connexion MongoDB réussie")
    } catch (error) {
        console.error("Erreur MongoDB :", error.message)
        process.exit(1)
    }
}