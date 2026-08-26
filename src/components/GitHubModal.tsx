import React, { useState } from 'react';
import { useSneakers } from '../context/SneakerContext';
import { X, Github, Copy, Check, Terminal, ExternalLink, GitBranch, FolderGit2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const GitHubModal: React.FC = () => {
  const { isGithubModalOpen, setIsGithubModalOpen, showToast } = useSneakers();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isGithubModalOpen) return null;

  const gitSteps = [
    {
      title: '1. Initialize Git in project directory',
      command: 'git init',
      desc: 'Initialize a new git repository in your local workspace.',
    },
    {
      title: '2. Stage all project files',
      command: 'git add .',
      desc: 'Stages all components, pages, styling, and configuration files.',
    },
    {
      title: '3. Commit changes',
      command: 'git commit -m "feat: complete sneaker selling store web application"',
      desc: 'Create an initial commit with your complete codebase.',
    },
    {
      title: '4. Create a main branch & link remote repo',
      command: 'git branch -M main\ngit remote add origin https://github.com/YOUR_USERNAME/sneaker-store.git',
      desc: 'Point to your repository created on GitHub.com/new.',
    },
    {
      title: '5. Push code to GitHub repository',
      command: 'git push -u origin main',
      desc: 'Upload your entire project to your GitHub repository.',
    },
  ];

  const fullScript = `# Step-by-step GitHub upload commands:
git init
git add .
git commit -m "feat: complete sneaker selling store web application with landing, catalog, cart, and payment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/sneaker-store.git
git push -u origin main`;

  const copyToClipboard = (text: string, index?: number) => {
    navigator.clipboard.writeText(text);
    if (index !== undefined) {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
    showToast('Copied to Clipboard', 'Git command copied successfully.', 'success');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden text-neutral-100 max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-800 bg-neutral-950/60">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
                <Github className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                  Upload Code to GitHub Repository
                </h3>
                <p className="text-xs text-neutral-400">
                  Step-by-step instructions to push this sneaker store project to GitHub
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsGithubModalOpen(false)}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-6 text-sm">
            {/* Quick Export Banner */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-orange-950/40 via-neutral-900 to-neutral-900 border border-orange-500/30 flex items-start gap-3.5">
              <FolderGit2 className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-orange-200">AI Studio Direct Export Option</h4>
                <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                  You can also click the <strong>Settings (⚙️) menu</strong> at the top right of Google AI Studio and select <strong>"Export to GitHub"</strong> or <strong>"Download ZIP"</strong> for immediate repository synchronization.
                </p>
              </div>
            </div>

            {/* Quick Commands copy all */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-orange-400" /> All-In-One Terminal Script
                </span>
                <button
                  onClick={() => copyToClipboard(fullScript, 999)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium transition-colors"
                >
                  {copiedIndex === 999 ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied Script
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-neutral-400" /> Copy All Commands
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-black/70 border border-neutral-800 text-xs font-mono text-emerald-400 overflow-x-auto selection:bg-emerald-800">
                {fullScript}
              </pre>
            </div>

            {/* Individual Steps */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <GitBranch className="w-4 h-4 text-orange-400" /> Step-by-Step Breakdown
              </h4>

              {gitSteps.map((step, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-neutral-200">{step.title}</span>
                    <button
                      onClick={() => copyToClipboard(step.command, idx)}
                      className="text-neutral-400 hover:text-white p-1 rounded transition-colors"
                      title="Copy command"
                    >
                      {copiedIndex === idx ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <code className="block p-2.5 rounded-lg bg-neutral-900 border border-neutral-800/80 text-xs font-mono text-orange-300 break-all whitespace-pre-line">
                    {step.command}
                  </code>
                  <p className="text-xs text-neutral-400">{step.desc}</p>
                </div>
              ))}
            </div>

            {/* Project Architecture Checklist */}
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2.5">
              <h4 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                Included Project Files Ready for GitHub:
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs text-neutral-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Landing Page View</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Product Catalog & Detail</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Shopping Cart View</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Payment & Validation Flow</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-800 bg-neutral-950/80">
            <a
              href="https://github.com/new"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs text-orange-400 hover:text-orange-300 font-medium"
            >
              Open GitHub.com/new <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={() => setIsGithubModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold transition-all shadow-lg shadow-orange-600/20"
            >
              Done / Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
