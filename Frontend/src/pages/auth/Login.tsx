import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { LogIn, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Connexion réussie !");
      navigate("/");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Identifiants incorrects";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen hero bg-primary">
      <div className="hero-content flex-col w-full max-w-md">
        <div className="text-center text-primary-content">
          <img src="/LogoOISSU.jpeg" alt="OISSU" className="h-20 w-20 rounded-full object-cover mx-auto mb-4 border-4 border-secondary shadow-xl" />
          <h1 className="text-3xl font-bold">Connexion</h1>
          <p className="text-primary-content/70 mt-1">Accédez à votre espace OISSU</p>
        </div>

        <div className="card bg-base-100 w-full shadow-2xl">
          <form onSubmit={handleSubmit} className="card-body gap-4">
            <div className="form-control">
              <label className="label"><span className="label-text font-medium">Adresse email</span></label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="votre@email.com"
                className="input input-bordered w-full focus:input-primary"
              />
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text font-medium">Mot de passe</span></label>
              <label className="input input-bordered flex items-center gap-2 focus-within:input-primary">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="grow"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="text-base-content/50 hover:text-base-content">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </label>
            </div>

            <div className="form-control mt-2">
              <button type="submit" disabled={loading} className="btn btn-primary w-full gap-2">
                {loading ? <span className="loading loading-spinner loading-sm" /> : <LogIn size={18} />}
                Se connecter
              </button>
            </div>

            <p className="text-center text-sm text-base-content/60">
              Pas encore de compte ?{" "}
              <Link to="/inscription" className="link link-primary font-semibold">S'inscrire</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
