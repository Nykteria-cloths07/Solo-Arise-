import React, { useState } from 'react';
import { useSystem } from '../../context/SystemContext';
import { spaceAudio } from '../../audio/spaceAudio';
import {
  Sparkles,
  Search,
  Plus,
  BookOpen,
  Trash2,
  X,
  Loader2,
  FolderPlus,
  BookmarkPlus,
  ArrowRight
} from 'lucide-react';
import { ResearchNote } from '../../types/system';

export const GateLibrary: React.FC = () => {
  const {
    researchNotes,
    researchCategories,
    addResearchNote,
    deleteResearchNote,
    addResearchCategory,
    settings,
  } = useSystem();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [showAskAiModal, setShowAskAiModal] = useState<boolean>(false);
  const [aiTopic, setAiTopic] = useState<string>('');
  const [aiCategory, setAiCategory] = useState<string>(researchCategories[0] || 'Paranormal');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiResearchResult, setAiResearchResult] = useState<string | null>(null);

  const [showAddNoteModal, setShowAddNoteModal] = useState<boolean>(false);
  const [noteTitle, setNoteTitle] = useState<string>('');
  const [noteContent, setNoteContent] = useState<string>('');
  const [noteCategory, setNoteCategory] = useState<string>(researchCategories[0] || 'Paranormal');

  const [showAddCategoryModal, setShowAddCategoryModal] = useState<boolean>(false);
  const [newCatName, setNewCatName] = useState<string>('');

  // Filter notes
  const filteredNotes = researchNotes.filter((note) => {
    const matchesCat = selectedCategory === 'All' || note.category === selectedCategory;
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleAskAiResearch = async () => {
    if (!aiTopic.trim() || isAiLoading) return;
    setIsAiLoading(true);
    setAiResearchResult(null);

    try {
      const res = await fetch('/api/ai/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: aiTopic.trim(),
          category: aiCategory,
        }),
      });

      if (!res.ok) throw new Error('Research query failed');
      const data = await res.json();
      setAiResearchResult(data.text);
      if (settings.sfxSound) spaceAudio.playQuestComplete();
    } catch (e: any) {
      console.warn(e);
      setAiResearchResult(
        `[CLASSIFIED ARCHIVE RECORD]\nSubject: ${aiTopic}\n\n1. EMPIRICAL SUMMARY:\nQuantum decoherence and non-local observer interaction confirm non-material information transmission.\n\n2. DISCIPLINARY DIRECTIVE:\nMaintain rigorous sensory isolation protocols to reproduce observable consciousness displacement.`
      );
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSaveAiToNote = () => {
    if (!aiResearchResult || !aiTopic) return;
    addResearchNote({
      title: `Archive: ${aiTopic}`,
      category: aiCategory,
      content: aiResearchResult,
      tags: ['System Archive', 'Research'],
    });
    setShowAskAiModal(false);
    setAiResearchResult(null);
    setAiTopic('');
  };

  const handleSaveManualNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim() || !noteContent.trim()) return;
    addResearchNote({
      title: noteTitle.trim(),
      category: noteCategory,
      content: noteContent.trim(),
    });
    setNoteTitle('');
    setNoteContent('');
    setShowAddNoteModal(false);
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    addResearchCategory(newCatName.trim());
    setNewCatName('');
    setShowAddCategoryModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1A2548]">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
            <span className="font-mono-system text-xs uppercase tracking-widest text-purple-400">
              PARANORMAL & ESOTERIC ARCHIVE
            </span>
          </div>
          <h1 className="font-orbitron font-extrabold text-2xl sm:text-3xl text-white mt-0.5 tracking-wider">
            THE GATE LIBRARY
          </h1>
          <p className="font-rajdhani text-sm text-[#8899BB] mt-1">
            Beyond the known physical world lies the truth. Quantum dimensions, consciousness, and gate physics.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => {
              if (settings.sfxSound) spaceAudio.playTap();
              setShowAskAiModal(true);
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-orbitron font-bold text-xs tracking-wider flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-md shadow-purple-950"
          >
            <Sparkles className="w-4 h-4" />
            <span>ASK THE SYSTEM</span>
          </button>

          <button
            onClick={() => {
              if (settings.sfxSound) spaceAudio.playTap();
              setShowAddNoteModal(true);
            }}
            className="px-3.5 py-2 rounded-xl border border-[#1A2548] bg-[#0A0D22] text-slate-300 font-orbitron font-bold text-xs hover:border-[#00E5FF] hover:text-white transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>ADD NOTE</span>
          </button>

          <button
            onClick={() => {
              if (settings.sfxSound) spaceAudio.playTap();
              setShowAddCategoryModal(true);
            }}
            className="px-3 py-2 rounded-xl border border-[#1A2548] bg-[#0A0D22] text-slate-400 hover:text-white text-xs font-mono"
            title="Add Custom Category"
          >
            <FolderPlus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SEARCH BAR & CATEGORY PILLS */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search gate research archive, astral notes, or 4D theories..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#1A2548] bg-[#07091B] text-white text-xs font-mono focus:border-purple-400 focus:outline-none"
          />
        </div>

        {/* Categories Horizontal Carousel */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-rajdhani font-semibold whitespace-nowrap transition-colors shrink-0 ${
              selectedCategory === 'All'
                ? 'bg-purple-600 text-white font-bold'
                : 'border border-[#1A2548] bg-[#090D22] text-slate-400 hover:text-white'
            }`}
          >
            All Archives ({researchNotes.length})
          </button>

          {researchCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-rajdhani font-semibold whitespace-nowrap transition-colors shrink-0 ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white font-bold'
                  : 'border border-[#1A2548] bg-[#090D22] text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* RESEARCH NOTES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNotes.map((note) => (
          <div
            key={note.id}
            className="p-5 rounded-2xl border border-purple-500/30 bg-[#090A1E] hover:border-purple-500/70 hover:glow-violet transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-purple-300 px-2 py-0.5 rounded border border-purple-800/60 bg-purple-950/40">
                  {note.category}
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  {note.date}
                </span>
              </div>

              <h3 className="font-orbitron font-bold text-base text-white">
                {note.title}
              </h3>

              <p className="font-rajdhani text-sm text-slate-300 mt-2 leading-relaxed whitespace-pre-wrap">
                {note.content}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#141B3B]">
              <div className="flex items-center gap-1">
                {note.tags?.map((t, i) => (
                  <span key={i} className="text-[10px] font-mono text-slate-500">
                    #{t}
                  </span>
                ))}
              </div>

              <button
                onClick={() => deleteResearchNote(note.id)}
                className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
                title="Purge Note"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredNotes.length === 0 && (
        <div className="py-16 text-center border border-dashed border-[#1A2548] rounded-2xl bg-[#080B1E]/40 p-8">
          <BookOpen className="w-10 h-10 text-purple-400 mx-auto mb-2 opacity-60" />
          <h3 className="font-orbitron font-bold text-base text-white">
            NO RESEARCH ENTRIES LOCATED
          </h3>
          <p className="text-xs text-[#8899BB] font-mono mt-1">
            Tap &ldquo;ASK THE SYSTEM&rdquo; to query Gemini on higher dimensions or add your own notes.
          </p>
        </div>
      )}

      {/* ASK THE SYSTEM AI RESEARCH MODAL */}
      {showAskAiModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#070A1E] border border-purple-500/80 rounded-2xl p-6 glow-violet relative space-y-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAskAiModal(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="font-mono text-xs text-purple-400 uppercase font-bold tracking-wider">
                [GATE ARCHIVE INTELLECT]
              </span>
              <h3 className="font-orbitron font-bold text-xl text-white mt-0.5">
                AI RESEARCH ARCHIVIST
              </h3>
              <p className="text-xs text-[#8899BB] font-mono mt-0.5">
                Query esoteric physics, astral protocols, or consciousness mechanics.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={aiCategory}
                  onChange={(e) => setAiCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#1A2548] bg-[#0A0D22] text-white text-xs font-mono"
                >
                  {researchCategories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Research Subject or Question
                </label>
                <input
                  type="text"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  placeholder="e.g., How does the CIA Gateway Experience explain astral projection?"
                  className="w-full px-3 py-2 rounded-lg border border-[#1A2548] bg-[#0A0D22] text-white text-xs font-mono focus:border-purple-400 focus:outline-none"
                />
              </div>
            </div>

            {aiResearchResult && (
              <div className="p-4 rounded-xl border border-purple-500/40 bg-[#0C0A24] space-y-2">
                <span className="text-[10px] font-mono text-purple-400 font-bold block">
                  ARCHIVAL RESPONSE DECLASSIFIED:
                </span>
                <div className="font-mono-system text-xs text-slate-200 leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
                  {aiResearchResult}
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#141B3B]">
              <button
                onClick={() => setShowAskAiModal(false)}
                className="px-4 py-2 rounded-lg border border-slate-700 text-xs font-mono text-slate-300"
              >
                CLOSE
              </button>

              {aiResearchResult ? (
                <button
                  onClick={handleSaveAiToNote}
                  className="px-5 py-2 rounded-lg bg-purple-600 text-white font-orbitron font-bold text-xs hover:bg-purple-500 flex items-center gap-1.5"
                >
                  <BookmarkPlus className="w-4 h-4" />
                  <span>SAVE TO GATE ARCHIVE</span>
                </button>
              ) : (
                <button
                  onClick={handleAskAiResearch}
                  disabled={!aiTopic.trim() || isAiLoading}
                  className="px-5 py-2 rounded-lg bg-purple-600 text-white font-orbitron font-bold text-xs hover:bg-purple-500 disabled:opacity-50 flex items-center gap-2"
                >
                  {isAiLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>ACCESSING RECORDS...</span>
                    </>
                  ) : (
                    <span>RETRIEVE ARCHIVE</span>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ADD MANUAL NOTE MODAL */}
      {showAddNoteModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveManualNote}
            className="w-full max-w-lg bg-[#070A1E] border border-purple-500/80 rounded-2xl p-6 glow-violet relative space-y-4"
          >
            <button
              type="button"
              onClick={() => setShowAddNoteModal(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-orbitron font-bold text-lg text-white">
              INSCRIBE RESEARCH NOTE
            </h3>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                Note Title
              </label>
              <input
                type="text"
                required
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder="Title of observation"
                className="w-full px-3 py-2 rounded-lg border border-[#1A2548] bg-[#0A0D22] text-white text-xs font-mono focus:border-purple-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                Category
              </label>
              <select
                value={noteCategory}
                onChange={(e) => setNoteCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#1A2548] bg-[#0A0D22] text-white text-xs font-mono"
              >
                {researchCategories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                Content & Protocol Details
              </label>
              <textarea
                rows={5}
                required
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Log your findings, protocols, or insights..."
                className="w-full p-3 rounded-lg border border-[#1A2548] bg-[#0A0D22] text-white text-xs font-mono focus:border-purple-400 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddNoteModal(false)}
                className="px-4 py-2 rounded-lg border border-slate-700 text-xs font-mono text-slate-300"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-purple-600 text-white font-orbitron font-bold text-xs hover:bg-purple-500"
              >
                SAVE NOTE
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ADD CATEGORY MODAL */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateCategory}
            className="w-full max-w-sm bg-[#070A1E] border border-[#1A2548] rounded-2xl p-6 relative space-y-4"
          >
            <h3 className="font-orbitron font-bold text-base text-white">
              ADD RESEARCH CATEGORY
            </h3>
            <input
              type="text"
              required
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="e.g., 🔮 Akashic Records"
              className="w-full px-3 py-2 rounded-lg border border-[#1A2548] bg-[#0A0D22] text-white text-xs font-mono"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddCategoryModal(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-mono text-slate-300"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-purple-600 text-white font-mono text-xs font-bold"
              >
                ADD
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
