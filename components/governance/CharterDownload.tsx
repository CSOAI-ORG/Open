import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Download, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export default function CharterDownload() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<"charter" | "solutions" | null>(null);

  const documents = [
    {
      id: "charter",
      title: "CSOAI Partnership Charter",
      description: "Complete 52-article framework establishing enforceable, transparent AI safety standards",
      size: "2.4 MB",
      pages: "48 pages",
      icon: "📋"
    },
    {
      id: "solutions",
      title: "11 Critical Solutions",
      description: "Comprehensive guide to the core problems CSOAI solves for enterprises and governments",
      size: "1.8 MB",
      pages: "32 pages",
      icon: "✅"
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !selectedDocument) {
      toast.error("Please enter your email and select a document");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const docName = selectedDocument === "charter" ? "CSOAI_Partnership_Charter_Complete.pdf" : "CSOAI_11_Critical_Solutions.pdf";
      const link = document.createElement("a");
      const pdfPath = selectedDocument === "charter" ? "/CSOAI_Partnership_Charter.pdf" : "/CSOAI_11_Critical_Solutions.pdf";
      link.href = pdfPath;
      link.download = docName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setSubmitted(true);
      setEmail("");
      setSelectedDocument(null);
      toast.success("Email captured! Download starting...");

      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (error) {
      toast.error("Failed to process request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <section className="py-20 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-bold mb-6 text-gray-900">
              Access CSOAI Strategic Documents
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Download our comprehensive charter and critical solutions framework. Join enterprises and governments building the future of AI safety.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-bold mb-6">Available Documents</h2>
              {documents.map((doc) => (
                <Card
                  key={doc.id}
                  className={`p-6 cursor-pointer transition-all border-2 ${selectedDocument === doc.id ? "border-emerald-500 bg-emerald-50" : "border-gray-200 hover:border-emerald-300"}`}
                  onClick={() => setSelectedDocument(doc.id as "charter" | "solutions")}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{doc.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">{doc.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{doc.description}</p>
                      <div className="flex gap-4 text-xs text-gray-500">
                        <span>{doc.pages}</span>
                        <span>•</span>
                        <span>{doc.size}</span>
                      </div>
                    </div>
                    {selectedDocument === doc.id && (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                    )}
                  </div>
                </Card>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="p-8 border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white sticky top-20">
                <h2 className="text-2xl font-bold mb-6">Get Instant Access</h2>

                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-100 mx-auto mb-4 flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Download Started!</h3>
                    <p className="text-gray-600 mb-4">
                      Check your email for confirmation and future updates about CSOAI.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Email Address</label>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full"
                        disabled={isLoading}
                      />
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-blue-700">
                          Select a document above to download. Your email helps us track interest from enterprises and governments.
                        </p>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={!selectedDocument || isLoading}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 text-lg font-semibold flex items-center justify-center gap-2"
                    >
                      <Download className="w-5 h-5" />
                      {isLoading ? "Processing..." : "Download Document"}
                    </Button>

                    <p className="text-xs text-gray-500 text-center">
                      We respect your privacy. No spam, ever.
                    </p>
                  </form>
                )}
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-8 text-white"
          >
            <h3 className="text-2xl font-bold mb-6">Why Download These Documents?</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="text-3xl mb-3">🏛️</div>
                <h4 className="font-bold mb-2">For Governments</h4>
                <p className="text-emerald-100">Understand how CSOAI aligns with EU AI Act, NIST RMF, and ISO 42001 requirements</p>
              </div>
              <div>
                <div className="text-3xl mb-3">🏢</div>
                <h4 className="font-bold mb-2">For Enterprises</h4>
                <p className="text-emerald-100">Discover how to achieve compliance and build trust with customers and regulators</p>
              </div>
              <div>
                <div className="text-3xl mb-3">🎓</div>
                <h4 className="font-bold mb-2">For Researchers</h4>
                <p className="text-emerald-100">Explore cutting-edge AI safety frameworks and governance architectures</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
