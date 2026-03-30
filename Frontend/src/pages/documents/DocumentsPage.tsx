import { useEffect, useState } from "react";
import api from "../../lib/api";
import type { Document } from "../../../types";
import { FileText, Download, Search } from "lucide-react";

const TYPE_LABELS: Record<string, string> = {
  manuel: "Manuel", guide: "Guide", texte_loi: "Texte de loi", rapport: "Rapport", autre: "Autre",
};

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/documents").then(r => setDocuments(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = documents.filter(d =>
    d.titre.toLowerCase().includes(search.toLowerCase()) ||
    d.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3"><FileText className="text-primary" /> Ressources & Documents</h1>
        <p className="text-base-content/60 mt-2">Manuels, guides pédagogiques, textes réglementaires</p>
      </div>

      <label className="input input-bordered flex items-center gap-2 mb-6 focus-within:input-primary">
        <Search size={16} className="text-base-content/40" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un document..." className="grow" />
      </label>

      {loading ? (
        <div className="flex justify-center py-16"><span className="loading loading-spinner loading-lg text-primary" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-base-content/40 bg-base-100 rounded-xl border border-base-300">
          <FileText size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg">{search ? "Aucun résultat" : "Aucun document disponible"}</p>
        </div>
      ) : (
        <div className="card bg-base-100 shadow-sm">
          <div className="divide-y divide-base-300">
            {filtered.map(doc => (
              <div key={doc._id} className="flex items-center gap-4 p-4 hover:bg-base-200 transition-colors">
                <div className="w-12 h-12 bg-info/10 rounded-xl flex items-center justify-center shrink-0">
                  <FileText className="text-info" size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{doc.titre}</div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <div className="badge badge-info badge-xs">{TYPE_LABELS[doc.type] || doc.type}</div>
                    <span className="text-xs text-base-content/40">{new Date(doc.createdAt).toLocaleDateString("fr-FR")}</span>
                    <span className="text-xs text-base-content/40">{doc.telechargements} téléchargements</span>
                  </div>
                  {doc.description && <p className="text-xs text-base-content/50 mt-1 truncate">{doc.description}</p>}
                </div>
                {doc.fichier && (
                  <a href={doc.fichier} target="_blank" rel="noreferrer" className="btn btn-outline btn-primary btn-xs gap-1 shrink-0">
                    <Download size={13} /> Télécharger
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
