// src/pages/Analysis.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api, getAnalysis } from "../api"; // api is named export in your api.js

export default function Analysis() {
  const { id } = useParams();
  const [analysisData, setAnalysisData] = useState(null); // aggregated data from getAnalysis
  const [responses, setResponses] = useState([]); // individual responses list
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("aggregated"); // "aggregated" | "individual"
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    // fetch aggregated analysis + individual responses in parallel
    Promise.all([
      getAnalysis(id).then((r) => r.data).catch((e) => {
        console.error("getAnalysis error", e);
        return null;
      }),
      api.get(`/surveys/${id}/responses`).then((r) => r.data).catch((e) => {
        console.error("responses fetch error", e);
        return [];
      }),
      api.get(`/surveys/${id}`).then((r) => r.data).catch((e) => {
        console.error("survey fetch error", e);
        return null;
      }),
    ])
      .then(([analysisRes, responsesRes, surveyRes]) => {
        // The aggregated endpoint returns:
        // { surveyTitle, totalResponses, analysis: [ { question, counts, average? } ] }
        setAnalysisData(analysisRes || (surveyRes ? {
          surveyTitle: surveyRes.title,
          totalResponses: (responsesRes || []).length,
          analysis: (surveyRes.questions || []).map((q) => ({ question: q, counts: {} }))
        } : null));

        // responsesRes should be an array of Response objects: { id, surveyId, answers, ... }
        // normalize to include timestamp if not present
        const normalized = (responsesRes || []).map((r, idx) => ({
          id: r.id ?? idx + 1,
          timestamp: r.timestamp ?? r.createdAt ?? new Date().toISOString(),
          answers: r.answers || [],
        }));
        setResponses(normalized);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-300">
        Loading analysis...
      </div>
    );
  }

  if (!analysisData && responses.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-300">
        No analysis available
      </div>
    );
  }

  const surveyTitle = analysisData?.surveyTitle || "Survey Analysis";
  const aggregatedQuestions = analysisData?.analysis || [];
  const totalResponses = analysisData?.totalResponses ?? responses.length;

  // ----------------------
  // Helpers
  // ----------------------
  const exportAggregatedCSV = () => {
    if (!aggregatedQuestions.length) return alert("No aggregated data to export.");
    const lines = ["Question,Answer,Count"];
    aggregatedQuestions.forEach((q) => {
      Object.entries(q.counts || {}).forEach(([opt, cnt]) => {
        lines.push(`"${q.question.replace(/"/g, '""')}","${String(opt).replace(/"/g, '""')}",${cnt}`);
      });
    });
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${surveyTitle.replace(/\s+/g, "_")}_aggregated.csv`;
    a.click();
  };

  const exportIndividualCSV = () => {
    if (!responses.length) return alert("No responses to export.");
    // header: ResponseID, Timestamp, Q1, Q2, ...
    const questions = aggregatedQuestions.map((q) => q.question);
    const header = ["ResponseID", "Timestamp", ...questions];
    const rows = responses.map((r, idx) => {
      const cells = [idx + 1, r.timestamp];
      for (let i = 0; i < questions.length; i++) cells.push(`"${String(r.answers[i] ?? "").replace(/"/g, '""')}"`);
      return cells.join(",");
    });
    const csv = [header.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${surveyTitle.replace(/\s+/g, "_")}_responses.csv`;
    a.click();
  };

  // Filter helpers
  const lowerSearch = search.trim().toLowerCase();
  const filteredAggregated = aggregatedQuestions.map((q) => {
    const entries = Object.entries(q.counts || {});
    const filtered = entries.filter(([opt]) => opt.toLowerCase().includes(lowerSearch));
    return { question: q.question, counts: Object.fromEntries(filtered) };
  });

  const filteredResponses = responses.filter((r) => {
    if (!lowerSearch) return true;
    // check entire answers array and timestamp
    return (
      r.answers.some((a) => String(a).toLowerCase().includes(lowerSearch)) ||
      String(r.timestamp).toLowerCase().includes(lowerSearch) ||
      String(r.id).toLowerCase().includes(lowerSearch)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1120] via-[#0f172a] to-[#1e293b] text-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-4xl font-extrabold text-blue-400">{surveyTitle}</h2>
            <p className="text-gray-400 mt-1">
              Responses collected:{" "}
              <span className="text-blue-400 font-semibold">{totalResponses}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Mode toggle */}
            <div className="bg-white/5 rounded-full p-1 flex items-center">
              <button
                onClick={() => setMode("aggregated")}
                className={`px-4 py-1 rounded-full font-medium transition ${
                  mode === "aggregated"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-500 text-white shadow"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                Aggregated
              </button>
              <button
                onClick={() => setMode("individual")}
                className={`px-4 py-1 rounded-full font-medium transition ${
                  mode === "individual"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-500 text-white shadow"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                Individual
              </button>
            </div>

            <input
              type="text"
              placeholder={mode === "aggregated" ? "Filter answers..." : "Filter responses..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-2 rounded-lg bg-[#1e293b]/60 border border-white/10 text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <div className="flex gap-2">
              {mode === "aggregated" ? (
                <button
                  onClick={exportAggregatedCSV}
                  className="bg-gradient-to-r from-blue-600 to-indigo-500 px-3 py-2 rounded-lg font-semibold text-white"
                >
                  ⬇️ Export Aggregated
                </button>
              ) : (
                <button
                  onClick={exportIndividualCSV}
                  className="bg-gradient-to-r from-blue-600 to-indigo-500 px-3 py-2 rounded-lg font-semibold text-white"
                >
                  ⬇️ Export Responses
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Body */}
        {mode === "aggregated" ? (
          <div className="space-y-6">
            {filteredAggregated.map((q, qi) => {
              const entries = Object.entries(q.counts || {});
              return (
                <div
                  key={qi}
                  className="bg-white/4 border border-white/6 rounded-lg p-6"
                >
                  <h3 className="text-xl font-semibold text-blue-300 mb-4">
                    {qi + 1}. {q.question}
                  </h3>

                  {entries.length ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead className="bg-white/6 text-gray-300">
                          <tr>
                            <th className="px-4 py-3 text-left font-medium">Answer</th>
                            <th className="px-4 py-3 text-left font-medium">Count</th>
                          </tr>
                        </thead>
                        <tbody>
                          {entries.map(([opt, cnt], idx) => (
                            <tr key={idx} className="border-t border-white/6">
                              <td className="px-4 py-3 text-gray-200">{opt}</td>
                              <td className="px-4 py-3 text-gray-300">{cnt}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-400">No matching answers.</p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          // Individual view
          <div className="space-y-6">
            {filteredResponses.length ? (
              filteredResponses.map((r, idx) => (
                <div
                  key={r.id ?? idx}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-blue-300">
                        🧍 Response #{idx + 1}
                      </h4>
                      <p className="text-sm text-gray-400">
                        ID: {r.id} · {new Date(r.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {aggregatedQuestions.map((q, qi) => (
                      <div
                        key={qi}
                        className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-t border-white/10 pt-3"
                      >
                        <div className="text-gray-300 font-medium">
                          {qi + 1}. {q.question}
                        </div>
                        <div className="text-gray-200 italic mt-2 sm:mt-0">
                          {r.answers[qi] ?? "-"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400 py-10">
                No responses found.
              </div>
            )}
          </div>
        )}

        {/* Footer summary */}
        <div className="mt-10 text-center text-gray-400 border-t border-white/10 pt-6">
          <p className="text-lg">
            🧾 You’ve collected{" "}
            <span className="text-blue-400 font-semibold">{responses.length}</span>{" "}
            {responses.length === 1 ? "response" : "responses"} in total.
          </p>
        </div>
      </div>
    </div>
  );
}
