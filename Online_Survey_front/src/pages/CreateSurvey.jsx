// src/pages/CreateSurvey.jsx
import { useState } from "react";
import { createSurvey } from "../api";
import { useNavigate } from "react-router-dom";

export default function CreateSurvey() {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([""]);
  const [shareLink, setShareLink] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const addQuestion = () => setQuestions([...questions, ""]);
  const updateQuestion = (i, v) => {
    const copy = [...questions];
    copy[i] = v;
    setQuestions(copy);
  };
  const removeQuestion = (i) => {
    const copy = questions.filter((_, idx) => idx !== i);
    setQuestions(copy.length ? copy : [""]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || questions.every(q=>!q.trim())) {
      alert("Please provide a title and at least one question.");
      return;
    }
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return navigate("/login");

    const payload = {
      title,
      createdBy: user.id,
      questions: questions.filter(q => q.trim() !== "")
    };

    try {
      setSaving(true);
      const { data } = await createSurvey(payload);
      // backend returns created survey
      setShareLink(`${window.location.origin}/take-survey/${data.id}`);
      alert("Survey created — share the link!");
    } catch (err) {
      console.error(err);
      alert("Failed to create survey.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-10 bg-gradient-to-br from-[#0b1120] via-[#0f172a] to-[#1e293b]">
      <div className="max-w-3xl mx-auto bg-white/6 backdrop-blur-md border border-white/6 rounded-2xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Create New Survey</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            value={title}
            onChange={(e)=>setTitle(e.target.value)}
            placeholder="Survey title (e.g., Customer Feedback)"
            className="w-full bg-[#0f1724]/60 border border-gray-700 text-white px-4 py-2 rounded-md"
            required
          />

          <div className="space-y-3">
            {questions.map((q,i) => (
              <div key={i} className="flex gap-2 items-start">
                <span className="text-gray-300 shrink-0 mt-2">{i+1}.</span>
                <input
                  value={q}
                  onChange={(e)=>updateQuestion(i, e.target.value)}
                  placeholder={`Question ${i+1}`}
                  className="flex-1 bg-[#0f1724]/60 border border-gray-700 text-white px-4 py-2 rounded-md"
                  required
                />
                <button
                  type="button"
                  onClick={()=>removeQuestion(i)}
                  className="text-sm text-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={addQuestion}
              className="px-4 py-2 rounded-md bg-[#111827] border border-white/6 text-white hover:opacity-90"
            >
              + Add Question
            </button>

            <button
              type="submit"
              disabled={saving}
              className="ml-auto px-6 py-2 rounded-md bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-medium hover:shadow-lg"
            >
              {saving ? "Creating..." : "Create Survey"}
            </button>
          </div>
        </form>

        {shareLink && (
          <div className="mt-6 bg-white/4 border border-white/6 rounded-md p-4">
            <p className="text-sm text-gray-300 mb-2">Share this link with respondents:</p>
            <div className="flex gap-2 items-center">
              <input readOnly value={shareLink} className="flex-1 bg-transparent border border-gray-700 text-white px-3 py-2 rounded-md" />
              <button
                onClick={()=>navigator.clipboard.writeText(shareLink)}
                className="px-3 py-2 rounded-md bg-green-600 hover:opacity-90 text-white"
              >
                Copy
              </button>
              <a href={shareLink} target="_blank" rel="noreferrer" className="px-3 py-2 rounded-md bg-gray-700 text-white">Open</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
