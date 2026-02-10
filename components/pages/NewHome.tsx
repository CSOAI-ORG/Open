              <span>Byzantine Fault-Tolerant Consensus</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-gray-600" />
              <span>Public Accountability</span>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-white/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* What is CSOAI? Mission Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <Badge className="mb-6 bg-green-100 text-green-800 border-green-300">
              Our Mission
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
              What is CSOAI?
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed mb-6">
              CSOAI (Council for Safety of AI) is the world's first comprehensive platform revolutionizing the relationship between humanity and artificial intelligence. We create <strong>transparency, accountability, and safety</strong> for AI systems through a unique combination of human expertise and Byzantine fault-tolerant AI consensus.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Our platform serves <strong>everyone</strong>—governments ensuring regulatory compliance, enterprises building trustworthy AI, individuals pursuing AI safety careers, and the public holding AI systems accountable. One platform. Complete coverage. Full transparency.
            </p>
          </div>

          {/* Three Pillars */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-8 text-center hover:shadow-xl transition-shadow border-2 border-green-100">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-gray-900 dark:text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Transparency</h3>
              <p className="text-gray-600">
                Every AI system, every decision, every compliance score visible to the public. No secrets, no hidden risks.
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-xl transition-shadow border-2 border-gray-200">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-gray-900 dark:text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Accountability</h3>
              <p className="text-gray-600">
                33-Agent Byzantine consensus with human oversight ensures no single entity controls AI safety decisions.
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-xl transition-shadow border-2 border-green-100">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="h-8 w-8 text-gray-900 dark:text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">For Everyone</h3>
              <p className="text-gray-600">
                Governments, enterprises, safety professionals, and concerned citizens all have a voice in AI governance.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Job Creation Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Turn AI Anxiety Into AI Income
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              As AI grows, so does the need for AI safety oversight. When robotics go mainstream, 
              demand for watchdog analysts will explode 10x.
            </p>
          </div>

          {/* Job Creation Visual */}
          <div className="mb-16">
            <img 
              src="/job-creation-visual.png" 
              alt="Diverse analysts working from home" 
              className="w-full max-w-5xl mx-auto rounded-2xl shadow-2xl"
            />
          </div>

          {/* 3-Step Process */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="p-8 text-center hover:shadow-xl transition-shadow border-2 border-green-100">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="h-8 w-8 text-gray-900 dark:text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">1. Train</h3>
              <p className="text-gray-600 mb-6">