'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Link as LinkIcon, Database, Mail, Calendar, FileText, MessagesSquare, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

const INTEGRATIONS = [
  {
    id: 'asana',
    name: 'Asana',
    category: 'Productivity',
    description: 'Track tasks and projects',
    icon: Database,
    color: 'text-rose-500',
    bg: 'bg-rose-50 dark:bg-rose-500/10'
  },
  {
    id: 'discord',
    name: 'Discord',
    category: 'Communication',
    description: 'Send messages and manage servers',
    icon: MessagesSquare,
    color: 'text-indigo-500',
    bg: 'bg-indigo-50 dark:bg-indigo-500/10'
  },
  {
    id: 'dropbox',
    name: 'Dropbox',
    category: 'Productivity',
    description: 'Store and share files',
    icon: Database,
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-500/10'
  },
  {
    id: 'figma',
    name: 'Figma',
    category: 'Design',
    description: 'Access designs and components',
    icon: Database,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-500/10'
  },
  {
    id: 'gmail',
    name: 'Gmail',
    category: 'Communication',
    description: 'Read, send, and manage emails',
    icon: Mail,
    color: 'text-red-500',
    bg: 'bg-red-50 dark:bg-red-500/10'
  },
  {
    id: 'gcal',
    name: 'Google Calendar',
    category: 'Productivity',
    description: 'View and create calendar events',
    icon: Calendar,
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-500/10'
  },
  {
    id: 'gdocs',
    name: 'Google Docs',
    category: 'Productivity',
    description: 'Read and edit documents',
    icon: FileText,
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-500/10'
  }
];

export default function IntegrationsPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [connected, setConnected] = useState<{ [key: string]: boolean }>({});

  const handleConnect = (id: string) => {
    setConnected(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const categories = ['All', 'Communication', 'Productivity', 'Business', 'Development', 'Design', 'Other'];

  const filtered = INTEGRATIONS.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 max-w-5xl pb-20">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black font-space mb-2 tracking-tighter text-zinc-900 dark:text-white uppercase">Integrations</h1>
          <p className="text-zinc-500 dark:text-zinc-400 font-light">Connect external tools directly into your instance configurations.</p>
        </div>
        
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-zinc-400" />
          </div>
          <input 
            type="text" 
            placeholder="Search integrations..." 
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

      <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
        Showing {filtered.length} of {INTEGRATIONS.length} integrations
      </div>

      {/* Integrations List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item, i) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-6 rounded-[1.5rem] bg-white dark:bg-[#111318] border border-zinc-200 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border border-black/5 dark:border-white/5 ${item.bg}`}>
                <item.icon className={`w-6 h-6 ${item.color}`} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-zinc-900 dark:text-white font-space group-hover:text-coral transition-colors">{item.name}</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">{item.category}</p>
                </div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{item.description}</p>
              </div>
            </div>

            <button 
              onClick={() => handleConnect(item.id)}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-full font-bold text-sm transition-all focus:scale-95 ${
                connected[item.id] 
                  ? 'bg-zinc-100 dark:bg-white/5 text-zinc-900 dark:text-white border border-zinc-200 dark:border-white/10' 
                  : 'bg-[#4B6BFB] hover:bg-[#3D5FE4] text-white shadow-md'
              }`}
            >
              {connected[item.id] ? (
                 <span className="flex items-center justify-center gap-2">
                   <CheckCircle2 className="w-4 h-4 text-green-500" /> Connected
                 </span>
              ) : 'Connect'}
            </button>
          </motion.div>
        ))}
      </div>

    </div>
  );
}
