/*
 * CSOAI Founding Council Page - 24+ Founding Members
 */

import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Users, Award, Globe, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import MemberProfileCard from "@/components/MemberProfileCard";
import { foundingMembers } from "@/data/foundingMembers";

export default function Council() {
  const [, setLocation] = useLocation();

  const councilMembers = foundingMembers.map(member => ({
    ...member,
    category: "Leadership"
  }));

  const categories = [
    { name: "Leadership", color: "from-blue-500 to-cyan-500", count: 5 },
  ];

  const categoryColors: { [key: string]: string } = {
    "Leadership": "bg-blue-500/20 text-blue-300 border-blue-500/30",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={() => setLocation("/")}
            className="text-blue-400 hover:text-blue-300 mb-6 flex items-center gap-2 text-sm"
          >
            ← Back to Home
          </button>
          <h1 className="text-5xl font-bold mb-4">Founding Council</h1>
          <p className="text-xl text-slate-300 max-w-2xl">
            24 visionary leaders from academia, industry, government, and civil society establishing the global standard for AI safety.
          </p>
        </motion.div>
      </div>

      {/* Category Overview */}
      <section className="bg-slate-800/50 border-y border-slate-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat, index) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className={`text-3xl font-bold bg-gradient-to-r ${cat.color} bg-clip-text text-transparent mb-2`}>
                  {cat.count}
                </div>
                <div className="text-sm text-slate-300">{cat.name}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Council Members Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="space-y-12">
          {categories.map((category) => {
            const members = councilMembers.filter(m => m.category === category.name);
            return (
              <div key={category.name}>
                <div className="flex items-center gap-3 mb-8">
                  <div className={`h-1 w-12 bg-gradient-to-r ${category.color}`}></div>
                  <h2 className="text-2xl font-bold">{category.name}</h2>
                  <span className="text-slate-400">({members.length})</span>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                  {members.map((member, index) => (
                    <motion.div
                      key={member.name}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <MemberProfileCard member={member} />
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Council Charter Section */}
      <section className="bg-slate-800/50 border-y border-slate-700 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">52-Article Charter</h2>
            <p className="text-xl text-slate-300">Establishing enforceable, transparent AI safety standards</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-slate-700/50 border border-slate-600 rounded-xl p-8"
            >
              <Award className="h-8 w-8 text-blue-400 mb-4" />
              <h3 className="text-lg font-semibold mb-3">Governance</h3>
              <p className="text-slate-300 text-sm">
                Clear decision-making processes, voting procedures, and dispute resolution mechanisms. Ensures fair representation across all stakeholder groups.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-slate-700/50 border border-slate-600 rounded-xl p-8"
            >
              <Globe className="h-8 w-8 text-cyan-400 mb-4" />
              <h3 className="text-lg font-semibold mb-3">Global Reach</h3>
              <p className="text-slate-300 text-sm">
                Operates across 21 NATO-friendly countries with localized compliance frameworks. Respects regional regulations while maintaining unified standards.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-slate-700/50 border border-slate-600 rounded-xl p-8"
            >
              <Users className="h-8 w-8 text-green-400 mb-4" />
              <h3 className="text-lg font-semibold mb-3">Transparency</h3>
              <p className="text-slate-300 text-sm">
                All decisions, standards, and assessments are publicly available. Complete audit trails ensure accountability and prevent conflicts of interest.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-slate-700/50 border border-slate-600 rounded-xl p-8"
            >
              <Award className="h-8 w-8 text-purple-400 mb-4" />
              <h3 className="text-lg font-semibold mb-3">Evolution</h3>
              <p className="text-slate-300 text-sm">
                Regular review and update processes ensure standards remain current with AI technology advances. Continuous improvement built into the framework.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Join Council CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-12 text-center"
        >
          <h2 className="text-4xl font-bold mb-4">Interested in Joining?</h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            We're continuously expanding our Founding Council to include more voices from academia, industry, government, and civil society. If you're passionate about AI safety and want to contribute, we'd love to hear from you.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-slate-100"
              onClick={() => setLocation("/partnership")}
            >
              Learn About Partnership
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-blue-700"
              onClick={() => window.location.href = "mailto:council@csoai.org"}
            >
              Contact Us
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
