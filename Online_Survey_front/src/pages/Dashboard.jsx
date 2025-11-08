import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0b1120] via-[#0f172a] to-[#1e293b] text-gray-100">
      {/* 🌟 Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-16 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(37,99,235,0.1),transparent_60%)] pointer-events-none"></div>

        <motion.h1
          className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Welcome back, {user?.name || "User"} 👋
        </motion.h1>

        <motion.p
          className="max-w-2xl mx-auto text-gray-400 text-lg leading-relaxed mb-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Manage your surveys, track responses, and uncover insights — all from
          one sleek dashboard built for simplicity.
        </motion.p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/create"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-semibold shadow-lg hover:shadow-[0_0_25px_rgba(59,130,246,0.7)] hover:-translate-y-1 transition-all"
          >
            ➕ Create New Survey
          </Link>
         
        </div>
      </section>

      {/* 💡 Features Section */}
      <section className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 px-6 py-20">
        {[
          {
            title: "📊 Analyze Responses",
            color: "text-blue-400",
            desc: "View real-time analytics and response trends in beautiful charts and graphs.",
          },
          {
            title: "🔗 Share Instantly",
            color: "text-indigo-400",
            desc: "Generate and share unique links effortlessly with anyone, anytime.",
          },
          {
            title: "💬 Collect Feedback",
            color: "text-purple-400",
            desc: "Gather responses in real-time and keep your audience engaged.",
          },
        ].map((f, i) => (
          <motion.div
            key={i}
            className="bg-white/5 border border-white/10 rounded-2xl p-8 shadow-lg backdrop-blur-md hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(59,130,246,0.2)] transition-all"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
          >
            <h3 className={`text-xl font-semibold mb-3 ${f.color}`}>
              {f.title}
            </h3>
            <p className="text-gray-400 leading-relaxed text-sm">{f.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* 📈 Insight Preview Section */}
      <section className="relative bg-gradient-to-r from-blue-950/40 to-indigo-950/30 py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-4 text-blue-400">
              Real-time Insights
            </h2>
            <p className="text-gray-400 leading-relaxed mb-6">
              Instantly view results as your audience responds. With live
              analytics, you can visualize data trends and make informed
              decisions faster.
            </p>
            <Link
              to="/dashboard"
              className="inline-block bg-gradient-to-r from-blue-600 to-indigo-500 text-white px-5 py-2.5 rounded-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] transition-all"
            >
              Explore My Surveys →
            </Link>
          </motion.div>

          <motion.div
            className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src="https://mir-s3-cdn-cf.behance.net/project_modules/fs/7638c885943033.5d8af3b054e89.png"
              alt="Survey Analytics Dashboard"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* 🧭 Footer */}
      <footer className="border-t border-white/10 text-center py-6 text-sm text-gray-500 bg-[#0b1120]/80 backdrop-blur">
        <p>
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-blue-400">Surveyly</span> — Designed
          for creators who love clean insights ✨
        </p>
      </footer>
    </div>
  );
}
