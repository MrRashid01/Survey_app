// src/pages/TakeSurvey.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSurvey, submitAnswers } from "../api";

export default function TakeSurvey() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!id) return;
    getSurvey(id)
      .then((res) => {
        const data = res.data;
        setSurvey(data);
        setAnswers(new Array(data.questions.length).fill(""));
      })
      .catch(() => alert("Failed to load survey"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (answers.some((a) => !a.trim())) {
      alert("Please answer all questions.");
      return;
    }

    try {
      await submitAnswers(id, answers);
      setSubmitted(true);
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      console.error(err);
      alert("Failed to submit responses.");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 bg-gradient-to-br from-[#0b1120] via-[#0f172a] to-[#1e293b]">
        Loading survey...
      </div>
    );

  if (!survey)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 bg-gradient-to-br from-[#0b1120] via-[#0f172a] to-[#1e293b]">
        Survey not found.
      </div>
    );

  if (submitted)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0b1120] via-[#0f172a] to-[#1e293b] text-center text-gray-100">
        <h2 className="text-3xl font-semibold text-blue-400 mb-3">
          🎉 Thank you!
        </h2>
        <p>Your response has been recorded successfully.</p>
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b1120] via-[#0f172a] to-[#1e293b] px-4 py-10">
      <div className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-md p-8 text-white">
        <h2 className="text-3xl font-bold mb-6 text-blue-400">{survey.title}</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {survey.questions.map((q, idx) => (
            <div key={idx}>
              <label className="block mb-2 text-gray-300 text-sm">
                {idx + 1}. {q}
              </label>
              <input
                type="text"
                value={answers[idx]}
                onChange={(e) => {
                  const newAnswers = [...answers];
                  newAnswers[idx] = e.target.value;
                  setAnswers(newAnswers);
                }}
                placeholder="Type your answer here..."
                className="w-full bg-[#0f172a] border border-gray-700 focus:border-blue-500 text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                required
              />
            </div>
          ))}

          <button
            type="submit"
            className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-medium py-2.5 rounded-lg hover:shadow-[0_0_15px_rgba(37,99,235,0.6)] transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
