/*
 * CSOAI News & Press Page - Strategic Partnership Announcements
 */

import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Calendar, ArrowRight, ExternalLink, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function News() {
  const [, setLocation] = useLocation();

  const news = [
    {
      date: "January 19, 2026",
      title: "Terranova & CSOAI Announce Strategic Leadership Alliance for Global AI Safety",
      subtitle: "Defense-Grade Infrastructure Meets Open-Source Governance",
      excerpt: "Terranova Aerospace and Defense Group and CSOAI announced a strategic leadership alliance. James Castle joins as Co-Founder and Chairperson. This partnership establishes enforceable, transparent, and globally accessible standards for AI safety, ethics, and governance.",
      content: `**PRESS RELEASE - January 19, 2026**

**Terranova Aerospace and Defense Group and CSOAI Announce Strategic Leadership Alliance**

*Establishing Enforceable, Transparent, and Globally Accessible Standards for AI Safety, Ethics, and Governance*

**London, United Kingdom | New York, USA**

Terranova Aerospace and Defense Group, in partnership with the Council for the Safety of Artificial Intelligence (CSOAI Ltd), today announced a strategic leadership, partnership and governance alliance focused on establishing enforceable, transparent, and globally accessible standards for Artificial Intelligence safety, ethics, and governance.

**Historic Leadership Appointments:**

**James Castle**, CEO and Chief Security Officer of Terranova Aerospace and Defense Group and Chairperson of the Cyber Security Global Alliance (CSGA), has formally joined CSOAI as **Co-Founder and Chairperson**. In this role, Mr. Castle will provide strategic governance leadership across defense, civilian, academic, and regulatory sectors.

"This is not about market dominance or proprietary control," said James Castle. "This is about trust, accountability, and global stewardship. AI has become a critical infrastructure issue. If we fail to govern it transparently and ethically now, the consequences will be irreversible."

**Nicholas Templeman**, Founder and Executive Director of CSOAI, has been appointed as an **AI Executive Engineer** within the AI Governance Division of both CSGA and Terranova, leading global AI safety policy development and open-source governance architectures.

"AI cannot be governed behind closed doors or owned by a handful of corporations," said Nicholas Templeman. "True safety requires openness, shared responsibility, and public accountability."

**Strengthening Global AI Governance:**

CSGAI has developed the world's first fully open-source, vendor-neutral governance framework for Artificial Intelligence, designed as an FAA-equivalent authority for AI systems.

**Key Principles:**
- 100% open-source governance architecture
- Zero vendor dependency or technology lock-in
- Complete transparency and auditability
- Human-centric AI safety and risk mitigation
- Cross-border interoperability and compliance

**Launching Global AI Safety Analyst Programs:**

CSGAI and Terranova will jointly introduce AI MOOC programs for individuals seeking to become AI Safety Analysts, with integration through CSGA's international education ecosystem and Terranova's AI Governance Division.

**A Global Commitment to Protect Humanity:**

This alliance represents a decisive shift away from closed, opaque AI control models toward open, defensible, and globally trusted governance structures.

**Download Full Press Release:** [View PDF](/press-release-2026-01-19.pdf)

**Learn More:**
- CSOAI: https://csoai.org
- Terranova: https://terranova-secdef.com
- CSGA: https://csga-global.org`,
      featured: true,
      category: "Partnership",
      color: "from-blue-500 to-cyan-500",
      pdfLink: "/press-release-2026-01-19.pdf",
    },
    {
      date: "January 15, 2026",
      title: "Dr. Richard Y Kim Joins as Founder & Chief Architect",
      subtitle: "Creator of 4MQ Protocol Leads CSOAI Vision",
      excerpt: "Dr. Richard Y Kim, creator of the 4MQ Protocol and PhD Ethics Attorney with US Supreme Court citations, joins CSOAI as Founder and Chief Architect. Dr. Kim brings decades of experience in AI ethics, financial identity frameworks, and governance architecture.",
      content: `Dr. Richard Y Kim, renowned AI ethics expert and creator of the 4MQ Protocol, has joined CSOAI as Founder and Chief Architect. This appointment marks a significant milestone in CSOAI's mission to establish global standards for AI safety.

Dr. Kim's background includes:
- Creator of the 4MQ Protocol (Modeling, Quality, Monitoring, Quantification)
- PhD Ethics Attorney with citations in US Supreme Court decisions
- Architect of the Financial Identity framework
- 20+ years of experience in AI governance and ethics

"The time for voluntary AI safety measures has passed," said Dr. Kim. "We need enforceable, transparent standards that protect society while enabling innovation. The 4MQ Protocol and CSOAI's governance framework make this possible."

Dr. Kim will lead CSOAI's technical vision, including the development and deployment of the 4MQ Protocol and the 33-Agent Council Byzantine consensus system.`,
      featured: false,
      category: "Leadership",
      color: "from-purple-500 to-pink-500"
    },
    {
      date: "January 10, 2026",
      title: "CSOAI Reaches 24 Founding Council Members",
      subtitle: "Global Experts Unite for AI Safety",
      excerpt: "CSOAI announces the completion of its 24-member Founding Council, bringing together world-class experts from academia, industry, government, and civil society. Council members represent 6 continents and 15 countries.",
      content: `CSOAI is pleased to announce the completion of its 24-member Founding Council. This diverse group of world-class experts will guide CSOAI's mission to establish global standards for AI safety.

Founding Council members include:
- 5 Leadership positions
- 7 Academia representatives
- 6 Government officials
- 6 Industry executives

"This council represents the best of global expertise in AI safety," said CSOAI leadership. "From IEEE standards experts to Fortune 100 CIOs, from government regulators to university researchers, we have assembled the team needed to build the future of AI safety."

The Founding Council will meet quarterly to review standards, approve new frameworks, and guide CSOAI's strategic direction.`,
      featured: false,
      category: "Governance",
      color: "from-green-500 to-emerald-500"
    },
    {
      date: "January 5, 2026",
      title: "CSOAI Launches 4MQ Protocol Beta",
      subtitle: "Advanced AI Safety Analysis Now Available",
      excerpt: "CSOAI announces the beta launch of the 4MQ Protocol, a revolutionary cognitive operating system for AI safety analysis. The protocol uses Byzantine consensus across 33 AI agents from 12 different providers for unbiased assessments.",
      content: `CSOAI is excited to announce the beta launch of the 4MQ Protocol, a groundbreaking cognitive operating system for AI safety analysis.

The 4MQ Protocol stands for:
- **Modeling**: Advanced AI analysis and risk modeling
- **Quality**: Comprehensive quality assessment
- **Monitoring**: Continuous oversight and tracking
- **Quantification**: Measurable outcomes and metrics

**Key Features:**
- Byzantine consensus across 33 AI agents
- 12 different AI providers for unbiased analysis
- Real-time threat detection
- Predictive risk modeling
- Comprehensive compliance assessment

"The 4MQ Protocol represents a paradigm shift in AI safety analysis," said Dr. Richard Y Kim, Chief Architect. "By using Byzantine consensus across multiple AI providers, we ensure that no single vendor can bias the outcome. This is democracy for AI safety decisions."

The beta is now available to select partners and will be rolled out globally in Q2 2026.`,
      featured: false,
      category: "Technology",
      color: "from-yellow-500 to-orange-500"
    },
    {
      date: "December 28, 2025",
      title: "EU AI Act Compliance Framework Published",
      subtitle: "CSOAI Releases Comprehensive Compliance Guide",
      excerpt: "CSOAI publishes a comprehensive framework for EU AI Act compliance, covering all 52 articles and providing practical guidance for organizations preparing for the August 2, 2026 deadline.",
      content: `CSOAI has published a comprehensive framework for EU AI Act compliance, helping organizations prepare for the August 2, 2026 implementation deadline.

The framework covers:
- All 52 articles of the EU AI Act
- Risk classification methodology
- Documentation requirements
- Human oversight mechanisms
- Bias monitoring and mitigation
- Data governance standards

"The EU AI Act is the most comprehensive AI regulation in the world," said CSOAI. "Our framework helps organizations understand and implement these requirements effectively."

The framework is available to all CSOAI members and is being adopted by regulatory bodies across the EU.`,
      featured: false,
      category: "Compliance",
      color: "from-red-500 to-pink-500"
    },
  ];

  const categories = ["All", "Partnership", "Leadership", "Governance", "Technology", "Compliance"];

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
          <h1 className="text-5xl font-bold mb-4">News & Press</h1>
          <p className="text-xl text-slate-300 max-w-2xl">
            Latest announcements and updates from the Council for the Safety of Artificial Intelligence.
          </p>
        </motion.div>
      </div>

      {/* Featured Article */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {news.filter(n => n.featured).map((article, index) => (
          <motion.div
            key={article.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`bg-gradient-to-r ${article.color} rounded-xl p-8 md:p-12 mb-12`}
          >
            <div className="flex items-center gap-2 mb-4">
              <Newspaper className="h-5 w-5" />
              <span className="text-sm font-semibold">Featured</span>
            </div>
            <h2 className="text-4xl font-bold mb-2">{article.title}</h2>
            <p className="text-lg opacity-90 mb-4">{article.subtitle}</p>
            <div className="flex items-center gap-2 text-sm opacity-75 mb-6">
              <Calendar className="h-4 w-4" />
              {article.date}
            </div>
            <p className="text-lg leading-relaxed mb-6">{article.excerpt}</p>
            <Button
              variant="secondary"
              onClick={() => window.location.href = "#article-detail"}
              className="bg-white text-slate-900 hover:bg-slate-100"
            >
              Read Full Article <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        ))}
      </section>

      {/* News Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">All News</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {news.filter(n => !n.featured).map((article, index) => (
            <motion.div
              key={article.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-700/50 border border-slate-600 rounded-xl p-8 hover:border-blue-400 transition group"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${article.color} bg-clip-text text-transparent`}>
                      {article.category}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {article.date}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold group-hover:text-blue-300 transition">{article.title}</h3>
                  <p className="text-slate-400 text-sm mt-1">{article.subtitle}</p>
                </div>
              </div>

              <p className="text-slate-300 mb-4 line-clamp-2">{article.excerpt}</p>

              <Button
                variant="ghost"
                className="text-blue-400 hover:text-blue-300 p-0 h-auto"
                onClick={() => window.location.href = "#article-detail"}
              >
                Read More <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Press Kit CTA */}
      <section className="bg-slate-800/50 border-y border-slate-700 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">Press Kit Available</h2>
            <p className="text-xl text-slate-300 mb-8">
              Download logos, fact sheets, and high-resolution images for media coverage.
            </p>
            <Button
              size="lg"
              className="bg-blue-500 hover:bg-blue-600"
              onClick={() => window.location.href = "mailto:press@csoai.org"}
            >
              Request Press Kit <ExternalLink className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Subscribe CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-12 text-center"
        >
          <h2 className="text-4xl font-bold mb-4">Stay Updated</h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Subscribe to CSOAI news and announcements to stay informed about the latest developments in AI safety.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-slate-100"
              onClick={() => window.location.href = "mailto:subscribe@csoai.org"}
            >
              Subscribe to Newsletter
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-blue-700"
              onClick={() => setLocation("/")}
            >
              Back to Home
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
