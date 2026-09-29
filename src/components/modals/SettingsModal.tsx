import React, { useState } from 'react';
import { usePolarisStore } from '../../store/usePolarisStore';
import { X, Settings, Key, Server, Radio, Check, AlertTriangle, Loader2 } from 'lucide-react';

export default function SettingsModal() {
  const { activePanel, setActivePanel, aisStatus, setAisStatus } = usePolarisStore();
  const [aisKeyInput, setAisKeyInput] = useState('');
  const [savingKey, setSavingKey] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  if (activePanel !== 'settings') return null;

  const handleSaveAisKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aisKeyInput.trim()) return;

    setSavingKey(true);
    setSaveMessage(null);
    try {
      const res = await fetch('/api/config/ais-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: aisKeyInput.trim() })
      });
      const data = await res.json();
      if (res.ok) {
        setSaveMessage('Key updated! Connecting to AISstream.io WebSocket...');
        setAisStatus({
          ...aisStatus,
          configured: true,
          statusText: 'CONNECTING',
          message: 'Connecting to AISstream relay with updated key...'
        });
      } else {
        setSaveMessage(`Error: ${data.error || 'Failed to update key'}`);
      }
    } catch (e: any) {
      setSaveMessage(`Connection error: ${e.message}`);
    } finally {
      setSavingKey(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm select-none">
      <div className="bg-[#0b1220] border border-slate-700/80 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#0e1728]">
          <div className="flex items-center gap-2.5">
            <Settings className="w-5 h-5 text-sky-400" />
            <div>
              <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-heading">
                Console Configuration & Live API Keys
              </h2>
              <p className="text-[11px] text-slate-400">
                Configure live AISstream telemetry credentials
              </p>
            </div>
          </div>
          <button
            onClick={() => setActivePanel('none')}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>


        <div className="p-5 space-y-4">
          {/* AISstream Key Form */}
          <form onSubmit={handleSaveAisKey} className="bg-[#080d17] p-3.5 rounded-lg border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold font-mono text-slate-200">
                <Key className="w-3.5 h-3.5 text-sky-400" />
                <span>AISSTREAM.IO WEBSOCKET KEY</span>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                aisStatus.connected 
                  ? 'bg-emerald-950 border-emerald-500/50 text-emerald-400' 
                  : 'bg-amber-950 border-amber-500/50 text-amber-400'
              }`}>
                {aisStatus.connected ? 'STREAMING' : 'NO KEY / AWAITING'}
              </span>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              AISstream provides free global satellite & terrestrial AIS. Obtain a free key at <a href="https://aisstream.io" target="_blank" rel="noreferrer" className="text-sky-400 underline">aisstream.io</a> and enter it below or save in <code className="text-sky-300 font-mono">.env</code>.
            </p>

            <div className="flex gap-2">
              <input
                type="password"
                placeholder="Paste AISstream.io API key here..."
                value={aisKeyInput}
                onChange={(e) => setAisKeyInput(e.target.value)}
                className="flex-1 bg-[#0d1627] border border-slate-700 rounded px-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-sky-500"
              />
              <button
                type="submit"
                disabled={savingKey || !aisKeyInput.trim()}
                className="px-3 py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-white font-mono text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                {savingKey ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                <span>Connect</span>
              </button>
            </div>

            {saveMessage && (
              <div className="text-[11px] font-mono text-sky-300 bg-sky-950/40 p-2 rounded border border-sky-800/40">
                {saveMessage}
              </div>
            )}
          </form>

          {/* Backend Connection Health */}
          <div className="bg-[#080d17] p-3.5 rounded-lg border border-slate-800 space-y-2 text-xs font-mono">
            <div className="flex items-center gap-2 font-bold text-slate-200">
              <Server className="w-3.5 h-3.5 text-sky-400" />
              <span>SERVER ARCHITECTURE STATUS</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
              <div className="bg-[#0d1627] p-2 rounded border border-slate-800">
                <span className="text-slate-400 text-[10px] block">BACKEND HOST</span>
                <span className="text-slate-200">http://localhost:3001</span>
              </div>
              <div className="bg-[#0d1627] p-2 rounded border border-slate-800">
                <span className="text-slate-400 text-[10px] block">WEBSOCKET RELAY</span>
                <span className="text-emerald-400">/ws/ais (Active)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-[#0e1728] flex justify-end">
          <button
            onClick={() => setActivePanel('none')}
            className="px-4 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
