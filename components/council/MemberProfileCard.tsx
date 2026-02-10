import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Achievement {
  title: string;
  description: string;
}

interface MemberProfile {
  name: string;
  title: string;
  organization: string;
  credentials: string[];
  bio: string;
  achievements: Achievement[];
}

interface MemberProfileCardProps {
  member: MemberProfile;
}

export default function MemberProfileCard({ member }: MemberProfileCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border border-slate-700 overflow-hidden hover:border-emerald-500/50 transition-colors"
      whileHover={{ y: -4 }}
    >
      {/* Header Section */}
      <div className="p-6 border-b border-slate-700">
        <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
        <p className="text-emerald-400 font-semibold mb-1">{member.title}</p>
        <p className="text-sm text-slate-400 mb-4">{member.organization}</p>
        
        {/* Credentials Tags */}
        <div className="flex flex-wrap gap-2">
          {member.credentials.map((credential, idx) => (
            <span
              key={idx}
              className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs rounded-full border border-emerald-500/30"
            >
              {credential}
            </span>
          ))}
        </div>
      </div>

      {/* Expandable Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-slate-700"
          >
            {/* Biography */}
            <div className="p-6 border-b border-slate-700">
              <h4 className="text-sm font-semibold text-emerald-400 mb-3 uppercase tracking-wide">Biography</h4>
              <p className="text-slate-300 leading-relaxed text-sm">{member.bio}</p>
            </div>

            {/* Key Achievements */}
            <div className="p-6">
              <h4 className="text-sm font-semibold text-emerald-400 mb-4 uppercase tracking-wide">Key Achievements</h4>
              <div className="space-y-4">
                {member.achievements.map((achievement, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="flex-shrink-0 w-2 h-2 rounded-full bg-emerald-500 mt-2" />
                    <div>
                      <p className="font-semibold text-white text-sm">{achievement.title}</p>
                      <p className="text-slate-400 text-sm mt-1">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expand/Collapse Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 bg-slate-800/50 hover:bg-slate-700/50 transition-colors flex items-center justify-center gap-2 text-slate-300 hover:text-emerald-400 border-t border-slate-700"
      >
        <span className="text-sm font-medium">
          {isExpanded ? 'Show Less' : 'View Full Profile'}
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>
    </motion.div>
  );
}
