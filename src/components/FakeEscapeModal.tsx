import { useState } from 'react';
import { 
  WifiOff, 
  BellRing, 
  BatteryWarning, 
  PhoneCall, 
  Volume2, 
  ShieldAlert, 
  X, 
  FileSpreadsheet,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { zoomSounds } from '../utils/soundEffects';

interface FakeEscapeModalProps {
  onClose: () => void;
  onToggleFreeze: () => void;
  isFrozen: boolean;
  onTriggerSpreadsheetOverlay: () => void;
}

export default function FakeEscapeModal({
  onClose,
  onToggleFreeze,
  isFrozen,
  onTriggerSpreadsheetOverlay,
}: FakeEscapeModalProps) {
  const [activeAlert, setActiveAlert] = useState<string | null>(null);

  const handleTriggerDoorbell = () => {
    zoomSounds.playDoorbell();
    setActiveAlert('Doorbell ringing! You can say: "One moment guys, FedEx is at my door!"');
  };

  const handleTriggerPhone = () => {
    zoomSounds.playPhoneRingtone();
    setActiveAlert('Incoming call ringing! You can say: "Urgent call from our client lead, taking this off-mic."');
  };

  const handleTriggerBattery = () => {
    zoomSounds.playBatteryAlert();
    setActiveAlert('Low battery alert triggered! You can say: "My charger just fried, logging off before battery dies."');
  };

  const handleToggleFreezeInternet = () => {
    if (!isFrozen) {
      zoomSounds.playAudioGlitch();
    }
    onToggleFreeze();
  };

  return (
    <div id="fake-escape-modal" className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl text-zinc-100">
        {/* Header */}
        <div className="px-6 py-4 bg-zinc-800/80 border-b border-zinc-700 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Fake Call Escape & Excuse Toolkit</h2>
              <p className="text-xs text-zinc-400">Tactical sound effects & excuses for getting out of awkward calls</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Active Alert Banner */}
        {activeAlert && (
          <div className="mx-6 mt-4 p-3 bg-blue-950/80 border border-blue-600 rounded-lg text-xs text-blue-200 flex items-start gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white block">Excuse in Action</span>
              <span>{activeAlert}</span>
            </div>
          </div>
        )}

        {/* Excuse Cards Grid */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* 1. Fake Bad Internet */}
          <div className="bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700/80 rounded-xl p-4 flex flex-col justify-between transition-all">
            <div>
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs mb-1">
                <WifiOff className="w-4 h-4" />
                <span>Unstable Internet / Freeze</span>
              </div>
              <p className="text-[11px] text-zinc-400 mb-3">
                Freezes your camera feed, lowers video quality, and shows orange unstable connection warning.
              </p>
            </div>
            <button
              id="trigger-freeze-btn"
              onClick={handleToggleFreezeInternet}
              className={`w-full py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                isFrozen
                  ? 'bg-amber-600 hover:bg-amber-500 text-white'
                  : 'bg-zinc-700 hover:bg-zinc-600 text-zinc-200'
              }`}
            >
              {isFrozen ? 'Unfreeze Video Feed' : 'Freeze & Glitch Feed'}
            </button>
          </div>

          {/* 2. Doorbell Delivery Ring */}
          <div className="bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700/80 rounded-xl p-4 flex flex-col justify-between transition-all">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs mb-1">
                <BellRing className="w-4 h-4" />
                <span>Doorbell Chime</span>
              </div>
              <p className="text-[11px] text-zinc-400 mb-3">
                Plays loud authentic two-tone front doorbell chime. Perfect for "Sign for package" excuse!
              </p>
            </div>
            <button
              id="trigger-doorbell-btn"
              onClick={handleTriggerDoorbell}
              className="w-full py-1.5 bg-zinc-700 hover:bg-zinc-600 text-zinc-200 rounded-lg text-xs font-semibold transition-colors"
            >
              Ring Doorbell (Ding-Dong)
            </button>
          </div>

          {/* 3. Phone Ringing */}
          <div className="bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700/80 rounded-xl p-4 flex flex-col justify-between transition-all">
            <div>
              <div className="flex items-center gap-2 text-sky-400 font-bold text-xs mb-1">
                <PhoneCall className="w-4 h-4" />
                <span>Incoming Phone Call</span>
              </div>
              <p className="text-[11px] text-zinc-400 mb-3">
                Plays realistic US phone ringtone so you can claim an urgent call came in.
              </p>
            </div>
            <button
              id="trigger-phone-btn"
              onClick={handleTriggerPhone}
              className="w-full py-1.5 bg-zinc-700 hover:bg-zinc-600 text-zinc-200 rounded-lg text-xs font-semibold transition-colors"
            >
              Play Phone Ringtone
            </button>
          </div>

          {/* 4. Low Battery Alert */}
          <div className="bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700/80 rounded-xl p-4 flex flex-col justify-between transition-all">
            <div>
              <div className="flex items-center gap-2 text-rose-400 font-bold text-xs mb-1">
                <BatteryWarning className="w-4 h-4" />
                <span>Low Battery 2% Chime</span>
              </div>
              <p className="text-[11px] text-zinc-400 mb-3">
                System warning chimes. Gives a legitimate excuse for an abrupt disconnect.
              </p>
            </div>
            <button
              id="trigger-battery-btn"
              onClick={handleTriggerBattery}
              className="w-full py-1.5 bg-zinc-700 hover:bg-zinc-600 text-zinc-200 rounded-lg text-xs font-semibold transition-colors"
            >
              Play Battery Chime
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-zinc-950 border-t border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-medium"
          >
            Close Toolkit
          </button>
        </div>
      </div>
    </div>
  );
}
