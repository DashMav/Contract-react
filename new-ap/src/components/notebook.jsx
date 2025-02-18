import { Upload, Settings, Share, Plus, Book, FileText, HelpCircle, Timeline, Send } from 'lucide-react';

const NotebookApp = () => {
  // We'll remove the unused state for now
  // When implementing source functionality, we can add it back

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-800 rounded-full" />
          <h1 className="text-lg">Untitled notebook</h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-3 py-1 rounded hover:bg-gray-800">
            <Share size={18} /> Share
          </button>
          <button className="flex items-center gap-2 px-3 py-1 rounded hover:bg-gray-800">
            <Settings size={18} /> Settings
          </button>
          <div className="w-8 h-8 bg-gray-700 rounded-full" />
        </div>
      </header>

      <main className="flex h-[calc(100vh-64px)]">
        {/* Sources Panel */}
        <div className="w-80 p-4 border-r border-gray-800">
          <div className="mb-4">
            <h2 className="text-sm font-medium mb-2">Sources</h2>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-700 hover:bg-gray-800">
              <Plus size={18} /> Add source
            </button>
          </div>
          
          <div className="text-center text-gray-500 mt-8">
            <div className="w-12 h-12 mx-auto mb-4 bg-gray-800 rounded-lg flex items-center justify-center">
              <FileText size={24} />
            </div>
            <p className="text-sm">Saved sources will appear here</p>
            <p className="text-xs mt-2">Click Add source above to add PDFs, websites, text, videos, or audio files. Or import a file directly from google drive.</p>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 p-4">
          <div className="h-full flex flex-col items-center justify-center text-center">
            <Upload className="mb-4 text-blue-500" size={24} />
            <h3 className="text-xl mb-4">Add a source to get started</h3>
            <button className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700">
              Upload a source
            </button>
            <div className="absolute bottom-4 w-[calc(100%-32px)] max-w-3xl">
              <div className="flex gap-2 items-center bg-gray-800 rounded-lg p-2">
                <input
                  type="text"
                  placeholder="Upload a source to get started"
                  className="flex-1 bg-transparent border-none outline-none px-2"
                  disabled
                />
                <span className="text-xs text-gray-500">0 sources</span>
                <button className="p-2 rounded-full bg-blue-600 text-white" disabled>
                  <Send size={18} />
                </button>
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">
                NotebookLM can be inaccurate, please double check its responses.
              </p>
            </div>
          </div>
        </div>

        {/* Studio Panel */}
        <div className="w-80 p-4 border-l border-gray-800">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium">Studio</h2>
              <button className="text-gray-500">
                <Upload size={18} />
              </button>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                  <HelpCircle size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-medium">Deep Dive conversation</h3>
                  <p className="text-xs text-gray-500">Two hosts (English only)</p>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-sm">
                  Customize
                </button>
                <button className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-sm">
                  Generate
                </button>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium">Notes</h2>
              <button className="text-gray-500">⋮</button>
            </div>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-700 hover:bg-gray-800 mb-4">
              <Plus size={18} /> Add note
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button className="flex items-center gap-2 p-2 rounded-lg bg-gray-800 text-sm">
                <Book size={18} /> Study guide
              </button>
              <button className="flex items-center gap-2 p-2 rounded-lg bg-gray-800 text-sm">
                <FileText size={18} /> Briefing doc
              </button>
              <button className="flex items-center gap-2 p-2 rounded-lg bg-gray-800 text-sm">
                <HelpCircle size={18} /> FAQ
              </button>
              <button className="flex items-center gap-2 p-2 rounded-lg bg-gray-800 text-sm">
                <Timeline size={18} /> Timeline
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotebookApp;