import { useState, useRef, ChangeEvent } from 'react';
import { VIRTUAL_BACKGROUNDS } from '../utils/presets';
import { X, Check, Upload, Sparkles, Image as ImageIcon } from 'lucide-react';

interface VirtualBackgroundModalProps {
  currentBgId?: string;
  onSelectBackground: (bgUrl: string) => void;
  onClose: () => void;
}

export default function VirtualBackgroundModal({
  currentBgId = 'none',
  onSelectBackground,
  onClose,
}: VirtualBackgroundModalProps) {
  const [selected, setSelected] = useState(currentBgId);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleApply = (bgUrl: string, id: string) => {
    setSelected(id);
    onSelectBackground(bgUrl);
  };

  const handleCustomUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          handleApply(reader.result, 'custom');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div id="virtual-bg-modal" className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl text-zinc-100">
        {/* Header */}
        <div className="px-6 py-4 bg-zinc-800/80 border-b border-zinc-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-bold text-white">Virtual Backgrounds & Filters</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Background Options Grid */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-zinc-300">Choose Virtual Background</span>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
            >
              <Upload className="w-3.5 h-3.5" /> Upload Image
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleCustomUpload}
              accept="image/*"
              className="hidden"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {VIRTUAL_BACKGROUNDS.map((bg) => {
              const isChosen = selected === bg.id;
              return (
                <button
                  key={bg.id}
                  onClick={() => handleApply(bg.url || (bg.id === 'blur' ? 'blur' : ''), bg.id)}
                  className={`group relative aspect-video rounded-xl overflow-hidden border-2 transition-all flex flex-col items-center justify-center ${
                    isChosen
                      ? 'border-blue-500 ring-2 ring-blue-500/30'
                      : 'border-zinc-700 hover:border-zinc-500'
                  }`}
                >
                  {bg.url ? (
                    <img
                      src={bg.url}
                      alt={bg.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className={`w-full h-full ${bg.preview} flex items-center justify-center text-xs font-semibold text-zinc-300`}>
                      {bg.name}
                    </div>
                  )}

                  {isChosen && (
                    <div className="absolute top-2 right-2 bg-blue-600 text-white p-1 rounded-full shadow-lg">
                      <Check className="w-3 h-3" />
                    </div>
                  )}

                  <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-xs py-1 px-2 text-[10px] text-zinc-200 truncate text-left">
                    {bg.name}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-zinc-950 border-t border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-sm"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
}
