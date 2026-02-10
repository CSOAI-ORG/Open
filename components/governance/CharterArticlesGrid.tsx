import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Filter, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  charterArticles,
  getPhases,
  getCategories,
  searchArticles,
  getArticlesByPhase,
  type CharterArticle,
} from "@/data/charterArticles";

export default function CharterArticlesGrid() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedArticle, setExpandedArticle] = useState<number | null>(null);

  const phases = getPhases();
  const categories = getCategories();

  // Filter articles based on search and selected filters
  const filteredArticles = useMemo(() => {
    let results = searchQuery ? searchArticles(searchQuery) : charterArticles;

    if (selectedPhase) {
      results = results.filter((article) => article.phase === selectedPhase);
    }

    if (selectedCategory) {
      results = results.filter((article) => article.category === selectedCategory);
    }

    return results;
  }, [searchQuery, selectedPhase, selectedCategory]);

  const getPhaseColor = (phase: string): string => {
    const phaseIndex = phases.indexOf(phase);
    const colors = [
      "from-blue-500 to-blue-600",
      "from-purple-500 to-purple-600",
      "from-pink-500 to-pink-600",
      "from-orange-500 to-orange-600",
      "from-green-500 to-green-600",
      "from-indigo-500 to-indigo-600",
    ];
    return colors[phaseIndex % colors.length];
  };

  const getCategoryIcon = (category: string): string => {
    const icons: { [key: string]: string } = {
      "Core Philosophy": "🧠",
      "Technical Standards": "⚙️",
      "Governance Structure": "🏛️",
      "Ethical Framework": "⚖️",
      "Legal Framework": "📜",
      "Future Readiness": "🔮",
      "System Design": "🎯",
      "Economic Framework": "💰",
      "Transparency": "👁️",
      "Stakeholder Engagement": "🤝",
      "Audit & Verification": "✅",
      "Technical Governance": "🔧",
      "Data Protection": "🔐",
      "Security": "🛡️",
      "Development Process": "🛠️",
      "Quality Assurance": "🧪",
      "Documentation": "📚",
      "Measurement": "📊",
      "System Integration": "🔗",
      "Human Development": "👨‍🎓",
      "Innovation": "💡",
      "Sustainability": "🌱",
      "Economic Analysis": "📈",
      "Social Impact": "👥",
      "Social Justice": "⚡",
      "Community Engagement": "🌍",
      "Cultural Considerations": "🎭",
      "Social Policy": "🏥",
      "Economic Distribution": "💳",
      "Innovation Policy": "🚀",
      "Business Development": "🏢",
      "International Relations": "🌐",
      "Development": "🌏",
      "Cultural Integration": "🎨",
      "Strategic Vision": "🎪",
      "Governance Evolution": "📈",
      "Adaptive Systems": "🔄",
      "Risk Management": "⚠️",
      "Long-term Responsibility": "🌳",
      "Oversight": "👀",
      "Knowledge Management": "🧠",
      "Accountability": "📋",
      "Vision & Mission": "✨",
    };
    return icons[category] || "📌";
  };

  return (
    <div className="w-full bg-gradient-to-b from-background via-background/95 to-background/90 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
            52 Charter Articles
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore the complete CSOAI Charter framework organized across 6 phases and multiple categories.
            Search, filter, and discover the principles guiding AI safety and prosperity.
          </p>
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder="Search articles by title, description, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-6 text-base bg-background/50 border-border/50 hover:border-border transition-colors"
            />
          </div>

          {/* Filter Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Phase Filter */}
            <div>
              <label className="text-sm font-semibold text-muted-foreground mb-2 block">
                <Filter className="inline h-4 w-4 mr-2" />
                Filter by Phase
              </label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedPhase === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedPhase(null)}
                  className="text-xs"
                >
                  All Phases
                </Button>
                {phases.map((phase) => (
                  <Button
                    key={phase}
                    variant={selectedPhase === phase ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedPhase(phase)}
                    className="text-xs"
                  >
                    {phase.split(": ")[1]?.substring(0, 10)}...
                  </Button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="text-sm font-semibold text-muted-foreground mb-2 block">
                <Filter className="inline h-4 w-4 mr-2" />
                Filter by Category
              </label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                  className="text-xs"
                >
                  All Categories
                </Button>
                {categories.slice(0, 5).map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="text-xs"
                  >
                    {category.substring(0, 12)}...
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-6 text-sm text-muted-foreground"
        >
          Showing <span className="font-semibold text-foreground">{filteredArticles.length}</span> of{" "}
          <span className="font-semibold text-foreground">{charterArticles.length}</span> articles
        </motion.div>

        {/* Articles Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredArticles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ y: -8 }}
              className="group cursor-pointer"
              onClick={() =>
                setExpandedArticle(expandedArticle === article.id ? null : article.id)
              }
            >
              <div className="relative h-full bg-gradient-to-br from-background/80 to-background/40 border border-border/50 rounded-lg p-6 hover:border-border transition-all duration-300 overflow-hidden">
                {/* Background gradient accent */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${getPhaseColor(
                    article.phase
                  )} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                />

                {/* Article Number Badge */}
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                  {article.id}
                </div>

                {/* Content */}
                <div className="relative z-10">
                  {/* Category Icon and Label */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{getCategoryIcon(article.category)}</span>
                    <span className="text-xs font-semibold text-green-400 uppercase tracking-wider">
                      {article.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-green-400 transition-colors line-clamp-2">
                    {article.title}
                  </h3>

                  {/* Phase Badge */}
                  <div className={`inline-block mb-3 px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${getPhaseColor(article.phase)}`}>
                    {article.phase.split(": ")[1]}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {article.description}
                  </p>

                  {/* Expanded Content */}
                  {expandedArticle === article.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 pt-4 border-t border-border/50 space-y-3"
                    >
                      {/* Key Points */}
                      <div>
                        <h4 className="text-xs font-semibold text-green-400 uppercase tracking-wider mb-2">
                          Key Points
                        </h4>
                        <ul className="space-y-1">
                          {article.keyPoints.map((point, idx) => (
                            <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                              <ChevronRight className="h-3 w-3 text-green-400 mt-0.5 flex-shrink-0" />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Related Frameworks */}
                      <div>
                        <h4 className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">
                          Related Frameworks
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {article.relatedFrameworks.map((framework, idx) => (
                            <span
                              key={idx}
                              className="text-xs px-2 py-1 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20"
                            >
                              {framework}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Expand Indicator */}
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {expandedArticle === article.id ? "Click to collapse" : "Click to expand"}
                    </span>
                    <motion.div
                      animate={{ rotate: expandedArticle === article.id ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-green-400 transition-colors" />
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredArticles.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center py-12"
          >
            <p className="text-lg text-muted-foreground mb-4">
              No articles found matching your search criteria.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedPhase(null);
                setSelectedCategory(null);
              }}
            >
              Clear Filters
            </Button>
          </motion.div>
        )}

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">52</div>
            <div className="text-sm text-muted-foreground">Total Articles</div>
          </div>
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">{phases.length}</div>
            <div className="text-sm text-muted-foreground">Phases</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">{categories.length}</div>
            <div className="text-sm text-muted-foreground">Categories</div>
          </div>
          <div className="bg-gradient-to-br from-pink-500/10 to-pink-600/5 border border-pink-500/20 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-pink-400 mb-2">∞</div>
            <div className="text-sm text-muted-foreground">Prosperity</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
