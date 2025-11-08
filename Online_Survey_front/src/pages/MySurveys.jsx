// src/pages/MySurveys.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSurveysByUser } from "../api";

export default function MySurveys() {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      window.location.href = "/login";
      return;
    }
    getSurveysByUser(user.id)
      .then(res => setSurveys(res.data || []))
      .catch(err => {
        console.error(err);
        alert("Failed to load your surveys");
      })
      .finally(()=>setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center text-gray-300">Loading your surveys...</div>
  );

  if (!surveys.length) return (
    <div className="min-h-[60vh] flex items-center justify-center text-gray-300">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">No surveys yet</h3>
        <p className="text-gray-400 mb-4">Create your first survey to get started.</p>
        <Link to="/create" className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-500 rounded-md text-white">Create Survey</Link>
      </div>
    </div>
  );

  return (
    <div className="px-4 py-10 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">My Surveys</h2>
      <div className="grid md:grid-cols-2 gap-5">
        {surveys.map(s => {
          const share = `${window.location.origin}/take-survey/${s.id}`;
          return (
            <div key={s.id} className="bg-white/4 border border-white/6 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{s.title || "Untitled Survey"}</h3>
                  <p className="text-sm text-gray-300 mt-1">Questions: {s.questions?.length || 0}</p>
                </div>

                <div className="flex flex-col gap-2">
                  <a href={share} target="_blank" rel="noreferrer" className="text-xs px-3 py-1 rounded bg-green-600 text-white">Open</a>
                  <Link to={`/analysis/${s.id}`} className="text-xs px-3 py-1 rounded bg-indigo-600 text-white">Analyze</Link>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <input readOnly value={share} className="flex-1 bg-transparent border border-gray-700 text-white px-3 py-2 rounded-md text-sm" />
                <button onClick={()=>navigator.clipboard.writeText(share)} className="px-3 py-1.5 rounded-md bg-gray-700 text-white text-sm">Copy</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
