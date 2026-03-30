import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Menu, LogOut, User, Trophy, ShoppingBag, Calendar, BookOpen, Film, ChevronDown } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setDrawerOpen(false);
  };

  const getDashboardPath = () => {
    if (!user) return "/connexion";
    const paths: Record<string, string> = {
      admin: "/dashboard/admin",
      delegue: "/dashboard/delegue",
      president_ase: "/dashboard/ase",
      officiel: "/dashboard/officiel",
      etudiant: "/dashboard/etudiant",
    };
    return paths[user.role] || "/dashboard/etudiant";
  };

  const navLinkCls = ({ isActive }: { isActive: boolean }) =>
    `btn btn-ghost btn-sm text-primary-content ${isActive ? "btn-active" : ""}`;

  return (
    <div className="drawer">
      <input id="nav-drawer" type="checkbox" className="drawer-toggle" checked={drawerOpen} onChange={e => setDrawerOpen(e.target.checked)} />

      {/* Navbar */}
      <div className="drawer-content flex flex-col">
        <div className="navbar bg-primary text-primary-content shadow-lg sticky top-0 z-40 px-4">
          {/* Mobile hamburger */}
          <div className="flex-none lg:hidden">
            <label htmlFor="nav-drawer" className="btn btn-ghost btn-square text-primary-content">
              <Menu size={22} />
            </label>
          </div>

          {/* Logo */}
          <div className="flex-1">
            <Link to="/" className="flex items-center gap-2">
              <img src="/LogoOISSU.jpeg" alt="OISSU" className="h-10 w-10 rounded-full object-cover border-2 border-secondary" />
              <span className="font-bold text-xl hidden sm:block">OISSU</span>
            </Link>
          </div>

          {/* Desktop nav */}
          <div className="flex-none hidden lg:flex items-center gap-1">
            <NavLink to="/" end className={navLinkCls}>Accueil</NavLink>

            {/* Compétitions dropdown */}
            <div className="dropdown dropdown-hover dropdown-bottom">
              <div tabIndex={0} className="btn btn-ghost btn-sm text-primary-content flex items-center gap-1">
                <Trophy size={14} /> Compétitions <ChevronDown size={13} />
              </div>
              <ul tabIndex={0} className="dropdown-content menu bg-base-100 text-base-content rounded-box shadow-xl w-52 z-50 p-2">
                <li><Link to="/competitions?type=masse">Masse</Link></li>
                <li><Link to="/competitions?type=elite">Élite</Link></li>
                <li><Link to="/competitions?type=detection">Détection</Link></li>
                <li><Link to="/disciplines">Disciplines</Link></li>
                <li className="menu-title mt-1">Calendrier</li>
                <li><Link to="/calendrier">Matchs & Résultats</Link></li>
              </ul>
            </div>

            <NavLink to="/evenements" className={navLinkCls}>
              <BookOpen size={14} className="mr-1" />Événements
            </NavLink>
            <NavLink to="/medias" className={navLinkCls}>
              <Film size={14} className="mr-1" />Médias
            </NavLink>
            <NavLink to="/boutique" className={navLinkCls}>
              <ShoppingBag size={14} className="mr-1" />Boutique
            </NavLink>
            <NavLink to="/oissu" className={navLinkCls}>L'OISSU</NavLink>
          </div>

          {/* Auth */}
          <div className="flex-none ml-3">
            {user ? (
              <div className="dropdown dropdown-bottom dropdown-end">
                <div tabIndex={0} className="btn btn-secondary btn-sm gap-2">
                  <User size={16} />
                  <span className="hidden sm:inline">{user.prenom}</span>
                </div>
                <ul tabIndex={0} className="dropdown-content menu bg-base-100 text-base-content rounded-box shadow-xl w-52 z-50 p-2">
                  <li className="menu-title">{user.nom} {user.prenom}</li>
                  <li><Link to={getDashboardPath()}><Trophy size={14} /> Tableau de bord</Link></li>
                  <li><Link to="/mes-licences"><Calendar size={14} /> Mes licences</Link></li>
                  <li><hr /></li>
                  <li>
                    <button onClick={handleLogout} className="text-error">
                      <LogOut size={14} /> Déconnexion
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/connexion" className="btn btn-ghost btn-sm text-primary-content hidden sm:inline-flex">Connexion</Link>
                <Link to="/inscription" className="btn btn-secondary btn-sm">S'inscrire</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile drawer sidebar */}
      <div className="drawer-side z-50">
        <label htmlFor="nav-drawer" className="drawer-overlay" />
        <ul className="menu bg-base-100 min-h-full w-72 p-4 gap-1">
          <li className="mb-4">
            <Link to="/" onClick={() => setDrawerOpen(false)} className="flex items-center gap-2 text-lg font-bold">
              <img src="/LogoOISSU.jpeg" alt="OISSU" className="h-10 w-10 rounded-full object-cover" />
              OISSU
            </Link>
          </li>
          <li><Link to="/" onClick={() => setDrawerOpen(false)}>Accueil</Link></li>
          <li>
            <details>
              <summary><Trophy size={16} /> Compétitions</summary>
              <ul>
                <li><Link to="/competitions?type=masse" onClick={() => setDrawerOpen(false)}>Masse</Link></li>
                <li><Link to="/competitions?type=elite" onClick={() => setDrawerOpen(false)}>Élite</Link></li>
                <li><Link to="/disciplines" onClick={() => setDrawerOpen(false)}>Disciplines</Link></li>
                <li><Link to="/calendrier" onClick={() => setDrawerOpen(false)}>Calendrier</Link></li>
              </ul>
            </details>
          </li>
          <li><Link to="/evenements" onClick={() => setDrawerOpen(false)}><BookOpen size={16} /> Événements</Link></li>
          <li><Link to="/medias" onClick={() => setDrawerOpen(false)}><Film size={16} /> Médias</Link></li>
          <li><Link to="/boutique" onClick={() => setDrawerOpen(false)}><ShoppingBag size={16} /> Boutique</Link></li>
          <li><Link to="/oissu" onClick={() => setDrawerOpen(false)}>L'OISSU</Link></li>
          <div className="divider" />
          {user ? (
            <>
              <li><Link to={getDashboardPath()} onClick={() => setDrawerOpen(false)}>Mon tableau de bord</Link></li>
              <li><Link to="/mes-licences" onClick={() => setDrawerOpen(false)}>Mes licences</Link></li>
              <li><button onClick={handleLogout} className="text-error"><LogOut size={14} /> Déconnexion</button></li>
            </>
          ) : (
            <>
              <li><Link to="/connexion" onClick={() => setDrawerOpen(false)}>Connexion</Link></li>
              <li><Link to="/inscription" onClick={() => setDrawerOpen(false)} className="btn btn-secondary btn-sm mt-1">S'inscrire</Link></li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
