'use client';

import { useState, useTransition } from 'react';
import { signOut } from 'next-auth/react';
import MarkdownIt from 'markdown-it';
import {
  updateSystemStatus,
  updateListeningTrack,
  upsertProject,
  deleteProject,
  upsertBlogPost,
  deleteBlogPost,
  approveComment,
  deleteComment,
} from '@/app/actions/admin';
import {
  Terminal,
  LogOut,
  FolderOpen,
  FileText,
  MessageSquare,
  Activity,
  Plus,
  Trash2,
  Edit3,
  Check,
  Eye,
  Radio,
  FileCode,
  Globe,
  Settings,
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  stack: string;
  liveLink?: string | null;
  githubLink?: string | null;
  imageUrl: string;
  featured: boolean;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string;
  category: string;
  published: boolean;
  readingTime: number;
}

interface Comment {
  id: string;
  authorName: string;
  authorEmail: string;
  content: string;
  approved: boolean;
  createdAt: Date;
  post: {
    title: string;
  };
}

interface DashboardClientProps {
  initialProjects: Project[];
  initialBlogPosts: BlogPost[];
  initialComments: Comment[];
  initialStatus: {
    statusText: string;
    location: string;
    availability: string;
  };
  initialMusic: {
    trackName: string;
    artistName: string;
    albumName: string;
    artworkUrl: string;
    mood?: string | null;
    notes?: string | null;
  };
}

export default function DashboardClient({
  initialProjects,
  initialBlogPosts,
  initialComments,
  initialStatus,
  initialMusic,
}: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState<'metrics' | 'blogs' | 'projects' | 'comments'>('metrics');
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(initialBlogPosts);
  const [comments, setComments] = useState<Comment[]>(initialComments);

  // Status Form States
  const [statusText, setStatusText] = useState(initialStatus.statusText);
  const [location, setLocation] = useState(initialStatus.location);
  const [availability, setAvailability] = useState(initialStatus.availability);

  // Music Form States
  const [trackName, setTrackName] = useState(initialMusic.trackName);
  const [artistName, setArtistName] = useState(initialMusic.artistName);
  const [albumName, setAlbumName] = useState(initialMusic.albumName);
  const [artworkUrl, setArtworkUrl] = useState(initialMusic.artworkUrl);
  const [mood, setMood] = useState(initialMusic.mood || '');
  const [notes, setNotes] = useState(initialMusic.notes || '');

  // Active Project Form State
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [pTitle, setPTitle] = useState('');
  const [pDesc, setPDesc] = useState('');
  const [pStack, setPStack] = useState('');
  const [pLive, setPLive] = useState('');
  const [pGithub, setPGithub] = useState('');
  const [pImg, setPImg] = useState('');
  const [pFeatured, setPFeatured] = useState(false);

  // Active Blog Form State
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [bTitle, setBTitle] = useState('');
  const [bSlug, setBSlug] = useState('');
  const [bExcerpt, setBExcerpt] = useState('');
  const [bContent, setBContent] = useState('');
  const [bTags, setBTags] = useState('');
  const [bCategory, setBCategory] = useState('Engineering');
  const [bReadingTime, setBReadingTime] = useState(1);
  const [bPublished, setBPublished] = useState(false);

  const [isPending, startTransition] = useTransition();
  const [hudMessage, setHudMessage] = useState('');

  const md = new MarkdownIt({ html: true });

  const displayHUD = (msg: string) => {
    setHudMessage(msg);
    setTimeout(() => setHudMessage(''), 4000);
  };

  // 1. UPDATE SYSTEM STATUS ACTION
  const handleUpdateStatus = () => {
    startTransition(async () => {
      const res = await updateSystemStatus(statusText, location, availability);
      if (res.success) displayHUD('SYS: STATUS TELEMETRY DOCK SYNCHRONIZED.');
      else displayHUD('ERR: TRANSACTION CONFLICT ENCOUNTERED.');
    });
  };

  // 2. UPDATE LISTENING TRACK ACTION
  const handleUpdateMusic = () => {
    startTransition(async () => {
      const res = await updateListeningTrack(trackName, artistName, albumName, artworkUrl, mood, notes);
      if (res.success) displayHUD('SYS: LISTENING FREQUENCY ALIGNED.');
      else displayHUD('ERR: ATMOSPHERE UPDATE FAULT.');
    });
  };

  // 3. PROJECT SYNC (CREATE OR UPDATE) ACTION
  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const data = {
        title: pTitle,
        description: pDesc,
        stack: pStack,
        liveLink: pLive || null,
        githubLink: pGithub || null,
        imageUrl: pImg,
        featured: pFeatured,
      };

      const res = await upsertProject(editingProject?.id || null, data);
      if (res.success) {
        displayHUD('SYS: SHOWCASE PROJECT SYNCED.');
        // Refresh local array
        fetch('/api/projects')
          .then((r) => r.json())
          .then((p) => setProjects(p));
        resetProjectForm();
      } else {
        displayHUD('ERR: PROJECT SYNC EXCEPTION.');
      }
    });
  };

  const resetProjectForm = () => {
    setEditingProject(null);
    setShowProjectForm(false);
    setPTitle('');
    setPDesc('');
    setPStack('');
    setPLive('');
    setPGithub('');
    setPImg('');
    setPFeatured(false);
  };

  const handleEditProject = (proj: Project) => {
    setEditingProject(proj);
    setPTitle(proj.title);
    setPDesc(proj.description);
    setPStack(proj.stack);
    setPLive(proj.liveLink || '');
    setPGithub(proj.githubLink || '');
    setPImg(proj.imageUrl);
    setPFeatured(proj.featured);
    setShowProjectForm(true);
  };

  const handleDeleteProject = (id: string) => {
    if (!confirm('Confirm deletion of this showcased node?')) return;
    startTransition(async () => {
      const res = await deleteProject(id);
      if (res.success) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
        displayHUD('SYS: SHOWCASE NODE ERASED.');
      } else {
        displayHUD('ERR: EXCLUSION REFUSED.');
      }
    });
  };

  // 4. BLOG SYNC (CREATE OR UPDATE) ACTION
  const handleSaveBlog = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const data = {
        title: bTitle,
        slug: bSlug,
        excerpt: bExcerpt,
        content: bContent,
        tags: bTags,
        category: bCategory,
        published: bPublished,
        readingTime: Number(bReadingTime),
      };

      const res = await upsertBlogPost(editingPost?.id || null, data);
      if (res.success) {
        displayHUD('SYS: ARTICLE BROADCAST UPDATED.');
        fetch('/api/blog')
          .then((r) => r.json())
          .then((b) => setBlogPosts(b));
        resetBlogForm();
      } else {
        displayHUD('ERR: SLUG COLLISION OR WRITE EXCEPTION.');
      }
    });
  };

  const resetBlogForm = () => {
    setEditingPost(null);
    setShowBlogForm(false);
    setBTitle('');
    setBSlug('');
    setBExcerpt('');
    setBContent('');
    setBTags('');
    setBCategory('Engineering');
    setBReadingTime(1);
    setBPublished(false);
  };

  const handleEditBlog = (post: BlogPost) => {
    setEditingPost(post);
    setBTitle(post.title);
    setBSlug(post.slug);
    setBExcerpt(post.excerpt);
    setBContent(post.content);
    setBTags(post.tags);
    setBCategory(post.category);
    setBReadingTime(post.readingTime);
    setBPublished(post.published);
    setShowBlogForm(true);
  };

  const handleDeleteBlog = (id: string) => {
    if (!confirm('Confirm article extraction?')) return;
    startTransition(async () => {
      const res = await deleteBlogPost(id);
      if (res.success) {
        setBlogPosts((prev) => prev.filter((b) => b.id !== id));
        displayHUD('SYS: BLOG NODE EXTRACTED.');
      } else {
        displayHUD('ERR: EXCLUSION INTERCEPTED.');
      }
    });
  };

  // 5. COMMENTS MODERATION ACTION
  const handleApproveComment = (id: string) => {
    startTransition(async () => {
      const res = await approveComment(id);
      if (res.success) {
        setComments((prev) =>
          prev.map((c) => (c.id === id ? { ...c, approved: true } : c))
        );
        displayHUD('SYS: COMMENT DECRYPTED & APPROVED.');
      } else {
        displayHUD('ERR: VALIDATION FAULT.');
      }
    });
  };

  const handleDeleteComment = (id: string) => {
    if (!confirm('Purge this comment telemetry?')) return;
    startTransition(async () => {
      const res = await deleteComment(id);
      if (res.success) {
        setComments((prev) => prev.filter((c) => c.id !== id));
        displayHUD('SYS: COMMENT TELEMETRY PURGED.');
      } else {
        displayHUD('ERR: EXCLUSION FAULT.');
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#080809] text-[#f3f3f3] flex flex-col md:flex-row relative">
      <div className="noise-overlay" />
      <div className="crt-overlay crt-flicker" />

      {/* Sidebar HUD */}
      <aside className="w-full md:w-64 bg-[#0c0c0d] border-b md:border-b-0 md:border-r border-white/5 p-6 space-y-8 flex-shrink-0 z-10 font-mono text-xs select-none">
        <div className="space-y-1">
          <div className="text-white font-black tracking-widest text-sm">VASAV // SYS_CTRL</div>
          <div className="text-[9px] text-[#ff5d22] uppercase tracking-widest">Administrator Node</div>
        </div>

        <nav className="space-y-1.5 pt-4">
          <button
            onClick={() => setActiveTab('metrics')}
            className={`w-full text-left px-3 py-3 rounded flex items-center gap-3 transition duration-150 interactive cursor-pointer ${
              activeTab === 'metrics'
                ? 'bg-white/5 border-l-2 border-[#ff5d22] text-white'
                : 'text-white/50 hover:text-white hover:bg-white/2'
            }`}
          >
            <Activity size={14} />
            <span>General Telemetry</span>
          </button>
          <button
            onClick={() => setActiveTab('blogs')}
            className={`w-full text-left px-3 py-3 rounded flex items-center gap-3 transition duration-150 interactive cursor-pointer ${
              activeTab === 'blogs'
                ? 'bg-white/5 border-l-2 border-[#ff5d22] text-white'
                : 'text-white/50 hover:text-white hover:bg-white/2'
            }`}
          >
            <FileText size={14} />
            <span>Blogs Publisher</span>
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`w-full text-left px-3 py-3 rounded flex items-center gap-3 transition duration-150 interactive cursor-pointer ${
              activeTab === 'projects'
                ? 'bg-white/5 border-l-2 border-[#ff5d22] text-white'
                : 'text-white/50 hover:text-white hover:bg-white/2'
            }`}
          >
            <FolderOpen size={14} />
            <span>Projects Hub</span>
          </button>
          <button
            onClick={() => setActiveTab('comments')}
            className={`w-full text-left px-3 py-3 rounded flex items-center justify-between transition duration-150 interactive cursor-pointer ${
              activeTab === 'comments'
                ? 'bg-white/5 border-l-2 border-[#ff5d22] text-white'
                : 'text-white/50 hover:text-white hover:bg-white/2'
            }`}
          >
            <div className="flex items-center gap-3">
              <MessageSquare size={14} />
              <span>Comments Queue</span>
            </div>
            {comments.filter((c) => !c.approved).length > 0 && (
              <span className="bg-[#ff5d22] text-white font-bold rounded-full w-4 h-4 text-[8px] flex items-center justify-center animate-pulse">
                {comments.filter((c) => !c.approved).length}
              </span>
            )}
          </button>
        </nav>

        <div className="pt-8 border-t border-white/5">
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full px-3 py-3 bg-red-950/20 hover:bg-red-950/50 border border-red-900/30 hover:border-red-500/50 text-red-400 rounded flex items-center gap-2 duration-300 interactive cursor-pointer"
          >
            <LogOut size={14} />
            <span>DISCONNECT CORE</span>
          </button>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="flex-1 p-6 md:p-10 space-y-8 z-10 overflow-y-auto max-h-screen">
        {/* HUD Broadcast Banner */}
        <div className="flex justify-between items-center border-b border-white/10 pb-4 select-none">
          <div>
            <h2 className="text-xl font-mono font-bold uppercase text-white tracking-tight">
              Control Panel // {activeTab.toUpperCase()}
            </h2>
            <div className="text-[9px] font-mono text-white/30 uppercase tracking-widest">
              Live database synchronization active
            </div>
          </div>

          {/* Glowing system feedback HUD */}
          <div className="h-6 flex items-center font-mono">
            {isPending ? (
              <span className="text-[10px] text-yellow-500 animate-pulse uppercase tracking-wider flex items-center gap-1.5">
                <Radio size={12} className="animate-spin" /> SYNCHRONIZING TELEMETRY...
              </span>
            ) : hudMessage ? (
              <span className="text-[10px] text-[#ff5d22] animate-bounce uppercase tracking-wider">
                {hudMessage}
              </span>
            ) : (
              <span className="text-[10px] text-green-500 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" /> CORE READY
              </span>
            )}
          </div>
        </div>

        {/* -------------------- 1. GENERAL TELEMETRY METRICS TAB -------------------- */}
        {activeTab === 'metrics' && (
          <div className="space-y-8">
            {/* Stats Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono select-none">
              <div className="glass-panel border-white/5 rounded-lg p-5 flex items-center justify-between">
                <div>
                  <div className="text-white/30 text-[9px] uppercase tracking-widest">Blogs Archive</div>
                  <div className="text-2xl font-bold text-white mt-1">{blogPosts.length} Node(s)</div>
                </div>
                <FileText size={24} className="text-[#ff5d22] opacity-70" />
              </div>
              <div className="glass-panel border-white/5 rounded-lg p-5 flex items-center justify-between">
                <div>
                  <div className="text-white/30 text-[9px] uppercase tracking-widest">Showcased Inventions</div>
                  <div className="text-2xl font-bold text-white mt-1">{projects.length} Node(s)</div>
                </div>
                <FolderOpen size={24} className="text-[#ff5d22] opacity-70" />
              </div>
              <div className="glass-panel border-white/5 rounded-lg p-5 flex items-center justify-between">
                <div>
                  <div className="text-white/30 text-[9px] uppercase tracking-widest">Pending Comments</div>
                  <div className="text-2xl font-bold text-white mt-1">
                    {comments.filter((c) => !c.approved).length} Telemetry
                  </div>
                </div>
                <MessageSquare size={24} className="text-[#ff5d22] opacity-70 animate-pulse" />
              </div>
            </div>

            {/* General HUD Config Forms */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 font-mono text-xs">
              {/* Homepage Status Console */}
              <div className="glass-panel border-white/5 rounded-lg p-6 space-y-5">
                <div className="border-b border-white/10 pb-3 flex items-center gap-2">
                  <Globe size={14} className="text-[#ff5d22]" />
                  <h3 className="font-bold uppercase tracking-wider text-white">Homepage Status Settings</h3>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-white/40 uppercase text-[9px] tracking-widest">Status Text</label>
                    <textarea
                      value={statusText}
                      onChange={(e) => setStatusText(e.target.value)}
                      rows={3}
                      className="w-full bg-white/5 border border-white/10 rounded px-3 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#ff5d22] resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-white/40 uppercase text-[9px] tracking-widest">Current Coordinates</label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff5d22]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-white/40 uppercase text-[9px] tracking-widest">Availability</label>
                      <input
                        type="text"
                        value={availability}
                        onChange={(e) => setAvailability(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff5d22]"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleUpdateStatus}
                    className="w-full py-2.5 bg-white text-black hover:bg-[#ff5d22] hover:text-white rounded font-bold uppercase transition duration-300 interactive cursor-pointer"
                  >
                    SYNCHRONIZE STATUS TELEMETRY
                  </button>
                </div>
              </div>

              {/* Music Frequency Deck */}
              <div className="glass-panel border-white/5 rounded-lg p-6 space-y-5">
                <div className="border-b border-white/10 pb-3 flex items-center gap-2">
                  <Radio size={14} className="text-[#ff5d22]" />
                  <h3 className="font-bold uppercase tracking-wider text-white">Atmospheric Listening Deck</h3>
                </div>

                <div className="space-y-3.5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-white/40 uppercase text-[9px] tracking-widest">Track Name</label>
                      <input
                        type="text"
                        value={trackName}
                        onChange={(e) => setTrackName(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff5d22]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-white/40 uppercase text-[9px] tracking-widest">Artist Name</label>
                      <input
                        type="text"
                        value={artistName}
                        onChange={(e) => setArtistName(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff5d22]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-white/40 uppercase text-[9px] tracking-widest">Album Name</label>
                      <input
                        type="text"
                        value={albumName}
                        onChange={(e) => setAlbumName(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff5d22]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-white/40 uppercase text-[9px] tracking-widest">Album Art URL</label>
                      <input
                        type="text"
                        value={artworkUrl}
                        onChange={(e) => setArtworkUrl(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff5d22]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-white/40 uppercase text-[9px] tracking-widest">Mood Tag</label>
                      <input
                        type="text"
                        value={mood}
                        onChange={(e) => setMood(e.target.value)}
                        placeholder="e.g. cinematic, dark"
                        className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff5d22]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-white/40 uppercase text-[9px] tracking-widest">Track Insights</label>
                      <input
                        type="text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="e.g. loops on repeat"
                        className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff5d22]"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleUpdateMusic}
                    className="w-full py-2.5 bg-white text-black hover:bg-[#ff5d22] hover:text-white rounded font-bold uppercase transition duration-300 interactive cursor-pointer"
                  >
                    SYNCHRONIZE LISTENING CHANNELS
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* -------------------- 2. BLOGS PUBLISHER CMS TAB -------------------- */}
        {activeTab === 'blogs' && (
          <div className="space-y-6">
            {!showBlogForm ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center select-none">
                  <h3 className="font-mono text-xs font-bold uppercase text-white/50">
                    Compiled Broadcasts ({blogPosts.length})
                  </h3>
                  <button
                    onClick={() => {
                      resetBlogForm();
                      setShowBlogForm(true);
                    }}
                    className="px-4 py-2 bg-white text-black hover:bg-[#ff5d22] hover:text-white rounded text-xs font-mono font-bold flex items-center gap-1.5 transition duration-300 interactive cursor-pointer"
                  >
                    <Plus size={14} /> WRITE DRAFT BROADCAST
                  </button>
                </div>

                {/* List posts */}
                <div className="glass-panel border-white/5 rounded-lg overflow-hidden divide-y divide-white/5 font-mono text-xs select-none">
                  {blogPosts.length > 0 ? (
                    blogPosts.map((post) => (
                      <div key={post.id} className="p-4 flex items-center justify-between gap-6 hover:bg-white/2 duration-150">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">{post.title}</span>
                            <span className={`text-[8px] border px-1.5 py-0.5 rounded ${
                              post.published
                                ? 'border-[#ff5d22]/30 text-[#ff5d22] bg-[#ff5d22]/5'
                                : 'border-white/10 text-white/30'
                            }`}>
                              {post.published ? 'PUBLISHED' : 'DRAFT'}
                            </span>
                          </div>
                          <div className="text-[10px] text-white/45">
                            Category: {post.category} {"//"} Slug: /{post.slug}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditBlog(post)}
                            className="p-2 border border-white/5 hover:border-[#ff5d22]/30 hover:bg-[#ff5d22]/10 rounded text-white/60 hover:text-white duration-300 interactive cursor-pointer"
                          >
                            <Edit3 size={12} />
                          </button>
                          <button
                            onClick={() => handleDeleteBlog(post.id)}
                            className="p-2 border border-white/5 hover:border-red-500/30 hover:bg-red-500/10 rounded text-white/60 hover:text-red-400 duration-300 interactive cursor-pointer"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-white/30 italic">
                      [ No broadcasts found. Start by writing a draft. ]
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Richmarkdown Side-by-Side Live Editor Form */
              <form onSubmit={handleSaveBlog} className="space-y-6 font-mono text-xs">
                {/* Form fields header */}
                <div className="glass-panel border-white/5 rounded-lg p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-white/40 uppercase text-[9px] tracking-widest">Title</label>
                    <input
                      type="text"
                      required
                      value={bTitle}
                      onChange={(e) => {
                        setBTitle(e.target.value);
                        // Auto slug generator
                        if (!editingPost) {
                          setBSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                        }
                      }}
                      className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff5d22]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-white/40 uppercase text-[9px] tracking-widest">Slug</label>
                    <input
                      type="text"
                      required
                      value={bSlug}
                      onChange={(e) => setBSlug(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff5d22]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-white/40 uppercase text-[9px] tracking-widest">Category</label>
                    <input
                      type="text"
                      required
                      value={bCategory}
                      onChange={(e) => setBCategory(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff5d22]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-white/40 uppercase text-[9px] tracking-widest">Excerpt Summary</label>
                    <input
                      type="text"
                      required
                      value={bExcerpt}
                      onChange={(e) => setBExcerpt(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff5d22]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-white/40 uppercase text-[9px] tracking-widest">Tags (Comma Separated)</label>
                    <input
                      type="text"
                      required
                      value={bTags}
                      onChange={(e) => setBTags(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff5d22]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-white/40 uppercase text-[9px] tracking-widest">Reading Time (min)</label>
                      <input
                        type="number"
                        required
                        min={1}
                        value={bReadingTime}
                        onChange={(e) => setBReadingTime(Number(e.target.value))}
                        className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff5d22]"
                      />
                    </div>
                    <div className="flex items-center gap-2 pt-5">
                      <input
                        type="checkbox"
                        id="bPublished"
                        checked={bPublished}
                        onChange={(e) => setBPublished(e.target.checked)}
                        className="rounded border-white/10 bg-white/5 text-[#ff5d22] focus:ring-0 w-4 h-4 cursor-pointer"
                      />
                      <label htmlFor="bPublished" className="text-white/70 uppercase text-[9px] tracking-widest cursor-pointer select-none">
                        Publish Live
                      </label>
                    </div>
                  </div>
                </div>

                {/* Markdown Side-by-Side Live Editor */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[400px]">
                  {/* Textarea Input */}
                  <div className="flex flex-col h-full glass-panel border-white/5 rounded-lg overflow-hidden">
                    <div className="bg-[#101011] border-b border-white/5 px-4 py-2 flex items-center justify-between text-white/40 text-[9px] select-none">
                      <span className="flex items-center gap-1"><FileCode size={10} /> Markdown Raw Code</span>
                      <span>UTF-8 // Active</span>
                    </div>
                    <textarea
                      required
                      value={bContent}
                      onChange={(e) => setBContent(e.target.value)}
                      placeholder="## Write your long-form article here in Markdown..."
                      className="flex-1 bg-transparent border-0 p-4 font-mono text-xs text-white placeholder-white/10 resize-none focus:ring-0 focus:outline-none"
                    />
                  </div>

                  {/* HTML Live Preview */}
                  <div className="flex flex-col h-full glass-panel border-white/5 rounded-lg overflow-hidden">
                    <div className="bg-[#101011] border-b border-white/5 px-4 py-2 flex items-center justify-between text-white/40 text-[9px] select-none">
                      <span className="flex items-center gap-1"><Eye size={10} /> Live HTML Compiler Render</span>
                      <span className="text-[#ff5d22] animate-pulse">Dynamic</span>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto bg-black/20 select-text">
                      <div
                        className="markdown-content"
                        dangerouslySetInnerHTML={{ __html: md.render(bContent || '*Nothing written yet.*') }}
                      />
                    </div>
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-white text-black hover:bg-[#ff5d22] hover:text-white rounded font-bold uppercase transition duration-300 interactive cursor-pointer"
                  >
                    SYNCHRONIZE BROADCAST ARTICLE
                  </button>
                  <button
                    type="button"
                    onClick={resetBlogForm}
                    className="px-6 py-3 border border-white/10 hover:border-white hover:bg-white/5 rounded font-bold uppercase transition duration-300 interactive cursor-pointer"
                  >
                    CANCEL WRITE
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* -------------------- 3. PROJECTS HUB TAB -------------------- */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            {!showProjectForm ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center select-none">
                  <h3 className="font-mono text-xs font-bold uppercase text-white/50">
                    Showcased Inventions ({projects.length})
                  </h3>
                  <button
                    onClick={() => {
                      resetProjectForm();
                      setShowProjectForm(true);
                    }}
                    className="px-4 py-2 bg-white text-black hover:bg-[#ff5d22] hover:text-white rounded text-xs font-mono font-bold flex items-center gap-1.5 transition duration-300 interactive cursor-pointer"
                  >
                    <Plus size={14} /> ADD NEW SHOWCASE
                  </button>
                </div>

                {/* List projects */}
                <div className="glass-panel border-white/5 rounded-lg overflow-hidden divide-y divide-white/5 font-mono text-xs select-none">
                  {projects.length > 0 ? (
                    projects.map((proj) => (
                      <div key={proj.id} className="p-4 flex items-center justify-between gap-6 hover:bg-white/2 duration-150">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">{proj.title}</span>
                            {proj.featured && (
                              <span className="text-[7px] border border-[#ff5d22]/30 text-[#ff5d22] bg-[#ff5d22]/5 px-1 rounded font-bold">
                                FEATURED
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-white/45">
                            Technologies: {proj.stack}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditProject(proj)}
                            className="p-2 border border-white/5 hover:border-[#ff5d22]/30 hover:bg-[#ff5d22]/10 rounded text-white/60 hover:text-white duration-300 interactive cursor-pointer"
                          >
                            <Edit3 size={12} />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(proj.id)}
                            className="p-2 border border-white/5 hover:border-red-500/30 hover:bg-red-500/10 rounded text-white/60 hover:text-red-400 duration-300 interactive cursor-pointer"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-white/30 italic">
                      [ No projects showcases found. Start by adding one. ]
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Add/Edit Project Form */
              <form onSubmit={handleSaveProject} className="glass-panel border-white/5 rounded-lg p-6 space-y-5 font-mono text-xs">
                <div className="border-b border-white/10 pb-3 flex items-center gap-2 select-none">
                  <Settings size={14} className="text-[#ff5d22]" />
                  <h3 className="font-bold uppercase tracking-wider text-white">Project Information Nodes</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-white/40 uppercase text-[9px] tracking-widest">Project Title</label>
                    <input
                      type="text"
                      required
                      value={pTitle}
                      onChange={(e) => setPTitle(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff5d22]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-white/40 uppercase text-[9px] tracking-widest">Mockup Image URL</label>
                    <input
                      type="text"
                      required
                      value={pImg}
                      onChange={(e) => setPImg(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff5d22]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-white/40 uppercase text-[9px] tracking-widest">Technology Stack (Comma Separated)</label>
                  <input
                    type="text"
                    required
                    value={pStack}
                    onChange={(e) => setPStack(e.target.value)}
                    placeholder="Next.js, TailwindCSS, PyTorch..."
                    className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff5d22]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-white/40 uppercase text-[9px] tracking-widest">Project Abstract Summary</label>
                  <textarea
                    required
                    rows={4}
                    value={pDesc}
                    onChange={(e) => setPDesc(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff5d22] resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-white/40 uppercase text-[9px] tracking-widest">Live Engine URL (Optional)</label>
                    <input
                      type="text"
                      value={pLive}
                      onChange={(e) => setPLive(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff5d22]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-white/40 uppercase text-[9px] tracking-widest">GitHub Repository URL (Optional)</label>
                    <input
                      type="text"
                      value={pGithub}
                      onChange={(e) => setPGithub(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff5d22]"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-5 select-none">
                    <input
                      type="checkbox"
                      id="pFeatured"
                      checked={pFeatured}
                      onChange={(e) => setPFeatured(e.target.checked)}
                      className="rounded border-white/10 bg-white/5 text-[#ff5d22] focus:ring-0 w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor="pFeatured" className="text-white/70 uppercase text-[9px] tracking-widest cursor-pointer select-none">
                      Feature on Landing Page
                    </label>
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="flex gap-4 select-none">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-white text-black hover:bg-[#ff5d22] hover:text-white rounded font-bold uppercase transition duration-300 interactive cursor-pointer"
                  >
                    SYNCHRONIZE SHOWCASE PROJECT
                  </button>
                  <button
                    type="button"
                    onClick={resetProjectForm}
                    className="px-6 py-3 border border-white/10 hover:border-white hover:bg-white/5 rounded font-bold uppercase transition duration-300 interactive cursor-pointer"
                  >
                    CANCEL WRITE
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* -------------------- 4. COMMENTS MODERATION QUEUE TAB -------------------- */}
        {activeTab === 'comments' && (
          <div className="space-y-6">
            <h3 className="font-mono text-xs font-bold uppercase text-white/50 select-none">
              Reader Comment Moderation Queue ({comments.length})
            </h3>

            <div className="glass-panel border-white/5 rounded-lg overflow-hidden font-mono text-xs select-none">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#101011] border-b border-white/5 text-white/40 text-[9px] uppercase tracking-widest">
                      <th className="p-4">Post Context</th>
                      <th className="p-4">Author Node</th>
                      <th className="p-4">Comment Telemetry</th>
                      <th className="p-4">Verification Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {comments.length > 0 ? (
                      comments.map((comm) => (
                        <tr key={comm.id} className="hover:bg-white/1 hover:bg-opacity-[0.02] duration-150">
                          <td className="p-4 font-bold text-white max-w-[150px] truncate">
                            {comm.post.title}
                          </td>
                          <td className="p-4 text-white/70">
                            <div>{comm.authorName}</div>
                            <div className="text-[9px] text-white/30">{comm.authorEmail}</div>
                          </td>
                          <td className="p-4 text-white/50 text-[10px] max-w-[280px] leading-relaxed">
                            {comm.content}
                          </td>
                          <td className="p-4">
                            <span className={`text-[8px] px-2 py-0.5 rounded font-bold ${
                              comm.approved
                                ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                                : 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 animate-pulse'
                            }`}>
                              {comm.approved ? 'APPROVED' : 'AWAITING_VERIFY'}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="inline-flex gap-1.5">
                              {!comm.approved && (
                                <button
                                  onClick={() => handleApproveComment(comm.id)}
                                  className="p-1.5 bg-green-500/10 border border-green-500/20 hover:bg-green-500 hover:text-black rounded text-green-400 duration-300 interactive cursor-pointer"
                                >
                                  <Check size={10} />
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteComment(comm.id)}
                                className="p-1.5 bg-red-500/10 border border-red-500/20 hover:bg-red-500 hover:text-white rounded text-red-400 duration-300 interactive cursor-pointer"
                              >
                                <Trash2 size={10} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center py-12 text-white/30 italic">
                          [ No comment telemetries logged in the database queue. ]
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
