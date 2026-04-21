'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Github, MonitorPlay, Zap, Database, Globe, PlayCircle } from 'lucide-react';

const SKILLS = [
  {
    id: 'github',
    name: 'GitHub Server',
    category: 'Development',
    description: 'Interact with GitHub using the gh CLI. Manage repos, issues, and pull requests directly from your agent.',
    installs: 3900,
    author: 'steipete',
    icon: Github,
    color: 'text-zinc-800 dark:text-zinc-200',
    bg: 'bg-zinc-100 dark:bg-zinc-800/50',
    featured: true
  },
  {
    id: 'google-workspace',
    name: 'Google Workspace',
    category: 'Productivity',
    description: 'Google Workspace CLI for Gmail, Calendar, Drive, Contacts, Sheets, and Docs.',
    installs: 3254,
    author: 'steipete',
    icon: Database,
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-500/10',
    featured: true
  },
  {
    id: 'playwright',
    name: 'Playwright MCP',
    category: 'Web',
    description: 'Browser automation via Playwright MCP server. Allow your agent to visually inspect, crawl, and interact with dynamic web pages.',
    installs: 473,
    author: 'spiceman161',
    icon: MonitorPlay,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
    featured: true
  },
  {
    id: 'youtube',
    name: 'YouTube Watcher',
    category: 'Media',
    description: 'Fetch and read transcripts from YouTube videos instantly. Give your agent the ability to summarize video content.',
    installs: 466,
    author: 'michaelgathara',
    icon: PlayCircle,
    color: 'text-red-500',
    bg: 'bg-red-50 dark:bg-red-500/10',
    featured: false
  },
  {
    id: 'n8n',
    name: 'n8n Workflow Automation',
    category: 'Automation',
    description: 'Design auditable n8n workflows with retries and logging and trigger them natively via agent commands.',
    installs: 273,
    author: 'kowl64',
    icon: Zap,
    color: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-500/10',
    featured: true
  }
];

export default function SkillsPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [enabledSkills, setEnabledSkills] = useState<{ [key: string]: boolean }>({});

  const toggleSkill = (id: string) => {
    setEnabledSkills(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const categories = ['All', 'Installed', 'Development', 'Productivity', 'Web', 'Media', 'Automation'];

  const filteredSkills = SKILLS.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(search.toLowerCase()) || skill.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || 
                            (activeCategory === 'Installed' && enabledSkills[skill.id]) || 
                            skill.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 max-w-5xl pb-20">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black font-space mb-2 tracking-tighter text-zinc-900 dark:text-white uppercase">Skills Library</h1>
          <p className="text-zinc-500 dark:text-zinc-400 font-light">Add powerful capabilities and native integrations to your active instances.</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-zinc-400" />
          </div>
          <input 
            type="text" 
            placeholder="Search skills..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-[#111318] border border-zinc-200 dark:border-white/10 rounded-full focus:outline-none focus:border-coral transition-all text-zinc-900 dark:text-white font-medium shadow-sm"
          />
        </div>
      </div>

      {/* Categories Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-all ${
              activeCategory === cat 
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-black shadow-md' 
                : 'bg-white dark:bg-[#111318] border border-zinc-200 dark:border-white/5 text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {filteredSkills.map((skill) => (
          <motion.div 
            key={skill.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`p-6 rounded-[2rem] bg-white dark:bg-[#111318] border transition-all flex flex-col group ${
              enabledSkills[skill.id] 
                ? 'border-coral/50 shadow-[0_0_20px_rgba(255,90,95,0.05)]' 
                : 'border-zinc-200 dark:border-white/5 hover:border-zinc-300 dark:hover:border-white/10'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border border-black/5 dark:border-white/5 ${skill.bg}`}>
                  <skill.icon className={`w-6 h-6 ${skill.color}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-zinc-900 dark:text-white font-space text-lg">{skill.name}</h3>
                    {skill.featured && (
                      <span className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border border-yellow-500/20">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-1">{skill.category}</p>
                </div>
              </div>

              {/* Toggle Switch */}
              <button 
                onClick={() => toggleSkill(skill.id)}
                className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                  enabledSkills[skill.id] ? 'bg-coral' : 'bg-zinc-200 dark:bg-zinc-800'
                }`}
              >
                <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 shadow-sm ${
                  enabledSkills[skill.id] ? 'transform translate-x-6' : ''
                }`} />
              </button>
            </div>

            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6 flex-grow">{skill.description}</p>

            <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-white/5">
              <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-400">
                <div className={`w-2 h-2 rounded-full ${enabledSkills[skill.id] ? 'bg-coral animate-pulse' : 'bg-zinc-300 dark:bg-zinc-700'}`} />
                {enabledSkills[skill.id] ? 'Active on Instance' : 'Available'}
              </div>
              <div className="text-xs font-medium text-zinc-400">
                {skill.installs.toLocaleString()} installs • by <span className="text-zinc-600 dark:text-zinc-300">{skill.author}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
}
