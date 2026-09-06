import { useState, useRef, useEffect, MouseEvent } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Code2, 
  Network, 
  Presentation, 
  PenTool, 
  MousePointer, 
  Eraser, 
  RotateCcw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Maximize2
} from 'lucide-react';

interface ScreenShareViewProps {
  presenterName: string;
  presetId?: string;
  onStopShare: () => void;
  isPresenterMe?: boolean;
}

export default function ScreenShareView({
  presenterName,
  presetId = 'financial_dashboard',
  onStopShare,
  isPresenterMe = false,
}: ScreenShareViewProps) {
  const [selectedPreset, setSelectedPreset] = useState(presetId);
  const [activeTool, setActiveTool] = useState<'pointer' | 'laser' | 'pen' | 'highlighter'>('pointer');
  const [penColor, setPenColor] = useState('#ef4444');
  const [currentSlide, setCurrentSlide] = useState(1);
  const [laserPos, setLaserPos] = useState<{ x: number; y: number } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  // Clear canvas
  const handleClearDrawings = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Handle canvas drawing & laser pointer
  const handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
    if (activeTool === 'pointer' || activeTool === 'laser') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    isDrawingRef.current = true;
    lastPointRef.current = { x, y };
  };

  const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (activeTool === 'laser') {
      setLaserPos({ x, y });
    } else {
      setLaserPos(null);
    }

    if (!isDrawingRef.current || !lastPointRef.current) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
    ctx.lineTo(x, y);

    if (activeTool === 'pen') {
      ctx.strokeStyle = penColor;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.globalAlpha = 1.0;
    } else if (activeTool === 'highlighter') {
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 14;
      ctx.lineCap = 'square';
      ctx.globalAlpha = 0.35;
    }

    ctx.stroke();
    lastPointRef.current = { x, y };
  };

  const handleMouseUp = () => {
    isDrawingRef.current = false;
    lastPointRef.current = null;
  };

  // Sync canvas dimensions
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (parent) {
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    }
  }, []);

  return (
    <div id="screen-share-view" className="relative w-full h-full bg-zinc-950 flex flex-col rounded-lg overflow-hidden border border-emerald-500/40 shadow-2xl">
      {/* Top Presentation Bar */}
      <div className="bg-zinc-900 px-4 py-2 flex items-center justify-between border-b border-zinc-800 text-xs text-zinc-300 z-30">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-white">
            {isPresenterMe ? 'You are sharing your screen' : `${presenterName} is sharing screen`}
          </span>
          <span className="text-zinc-500">|</span>
          {/* Preset Selector */}
          <select
            value={selectedPreset}
            onChange={(e) => setSelectedPreset(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs rounded px-2 py-0.5 focus:outline-none focus:border-blue-500"
          >
            <option value="financial_dashboard">📊 Q3 Revenue & SaaS Metrics</option>
            <option value="code_ide">💻 VS Code TypeScript Backend</option>
            <option value="architecture_diagram">🌐 Cloud System Architecture</option>
            <option value="allhands_slides">📑 Executive Vision Slide Deck</option>
          </select>
        </div>

        {/* Annotation & Drawing Tools */}
        <div className="flex items-center gap-1.5 bg-zinc-800/90 border border-zinc-700 px-2 py-1 rounded-md">
          <button
            onClick={() => setActiveTool('pointer')}
            className={`p-1 rounded ${activeTool === 'pointer' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white'}`}
            title="Mouse Cursor"
          >
            <MousePointer className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setActiveTool('laser')}
            className={`p-1 rounded flex items-center gap-1 ${activeTool === 'laser' ? 'bg-rose-600 text-white' : 'text-zinc-400 hover:text-white'}`}
            title="Laser Pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span className="text-[10px] hidden sm:inline">Laser</span>
          </button>
          <button
            onClick={() => setActiveTool('pen')}
            className={`p-1 rounded ${activeTool === 'pen' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white'}`}
            title="Draw Pen"
          >
            <PenTool className="w-3.5 h-3.5" />
          </button>
          {activeTool === 'pen' && (
            <div className="flex items-center gap-1 ml-1">
              {['#ef4444', '#3b82f6', '#10b981', '#f59e0b'].map((color) => (
                <button
                  key={color}
                  onClick={() => setPenColor(color)}
                  style={{ backgroundColor: color }}
                  className={`w-3 h-3 rounded-full border ${penColor === color ? 'border-white scale-110' : 'border-transparent'}`}
                />
              ))}
            </div>
          )}
          <button
            onClick={() => setActiveTool('highlighter')}
            className={`p-1 rounded ${activeTool === 'highlighter' ? 'bg-yellow-500/30 text-yellow-300' : 'text-zinc-400 hover:text-white'}`}
            title="Highlighter"
          >
            <span className="text-[11px] font-bold">H</span>
          </button>
          <button
            onClick={handleClearDrawings}
            className="p-1 rounded text-zinc-400 hover:text-rose-400"
            title="Clear Annotations"
          >
            <Eraser className="w-3.5 h-3.5" />
          </button>
          <span className="text-zinc-600">|</span>
          <button
            onClick={onStopShare}
            className="px-2 py-0.5 rounded bg-rose-600 hover:bg-rose-500 text-white font-medium text-[11px]"
          >
            Stop Share
          </button>
        </div>
      </div>

      {/* Screen Presentation Mockup Content */}
      <div className="relative flex-1 bg-zinc-950 overflow-hidden flex items-center justify-center p-2 sm:p-4">
        {/* Transparent Canvas for Live User Annotations */}
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={`absolute inset-0 z-20 w-full h-full ${
            activeTool === 'laser' ? 'cursor-none' : activeTool === 'pen' || activeTool === 'highlighter' ? 'cursor-crosshair' : 'cursor-default'
          }`}
        />

        {/* Floating Laser Pointer Visual Effect */}
        {laserPos && (
          <div
            className="absolute pointer-events-none z-30 transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: laserPos.x, top: laserPos.y }}
          >
            <div className="w-4 h-4 rounded-full bg-rose-500 shadow-[0_0_12px_#ef4444] animate-ping opacity-75" />
            <div className="absolute inset-0 w-4 h-4 rounded-full bg-rose-600 border border-white shadow-[0_0_8px_#ef4444]" />
          </div>
        )}

        {/* 1. FINANCIAL DASHBOARD PRESET */}
        {selectedPreset === 'financial_dashboard' && (
          <div className="w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-2xl text-zinc-100 flex flex-col gap-4 select-none">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <span className="text-xs font-semibold text-emerald-400 tracking-wide uppercase">Apex Analytics Cloud</span>
                <h3 className="text-lg font-bold text-white">Q3 Financial Performance & Retention Report</h3>
              </div>
              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-semibold">
                <TrendingUp className="w-3.5 h-3.5" /> +28.4% YoY Growth
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-zinc-800/80 p-3 rounded-lg border border-zinc-700/50">
                <span className="text-[11px] text-zinc-400 block">Annual Recurring (ARR)</span>
                <span className="text-xl font-extrabold text-white">$42.8M</span>
                <span className="text-[10px] text-emerald-400 block mt-1">▲ $3.2M vs target</span>
              </div>
              <div className="bg-zinc-800/80 p-3 rounded-lg border border-zinc-700/50">
                <span className="text-[11px] text-zinc-400 block">Net Dollar Retention</span>
                <span className="text-xl font-extrabold text-white">124.6%</span>
                <span className="text-[10px] text-emerald-400 block mt-1">Enterprise benchmark</span>
              </div>
              <div className="bg-zinc-800/80 p-3 rounded-lg border border-zinc-700/50">
                <span className="text-[11px] text-zinc-400 block">Gross Margin</span>
                <span className="text-xl font-extrabold text-white">79.2%</span>
                <span className="text-[10px] text-blue-400 block mt-1">AWS efficiency</span>
              </div>
              <div className="bg-zinc-800/80 p-3 rounded-lg border border-zinc-700/50">
                <span className="text-[11px] text-zinc-400 block">Monthly Churn</span>
                <span className="text-xl font-extrabold text-emerald-400">0.82%</span>
                <span className="text-[10px] text-zinc-400 block mt-1">Historic low</span>
              </div>
            </div>

            {/* Visual Bar Graph */}
            <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700/50">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-semibold text-zinc-300">Quarterly Cohort Revenue Breakdown ($ Millions)</span>
                <span className="text-[11px] text-zinc-400">Jan – Dec 2026</span>
              </div>
              <div className="h-32 flex items-end gap-3 pt-4 border-b border-zinc-700">
                {[
                  { month: 'Q1 Jan', val: 55, label: '$8.4M' },
                  { month: 'Q1 Feb', val: 62, label: '$9.2M' },
                  { month: 'Q1 Mar', val: 70, label: '$10.5M' },
                  { month: 'Q2 Apr', val: 76, label: '$11.4M' },
                  { month: 'Q2 May', val: 82, label: '$12.2M' },
                  { month: 'Q2 Jun', val: 89, label: '$13.8M' },
                  { month: 'Q3 Jul', val: 94, label: '$14.6M' },
                  { month: 'Q3 Aug (Est)', val: 100, label: '$15.8M' }
                ].map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                    <span className="text-[9px] text-emerald-400 font-mono">{item.label}</span>
                    <div
                      style={{ height: `${item.val}%` }}
                      className="w-full bg-gradient-to-t from-blue-600 to-emerald-400 rounded-t transition-all hover:brightness-125"
                    />
                    <span className="text-[10px] text-zinc-400 truncate w-full text-center mt-1">{item.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. CODE IDE PRESET */}
        {selectedPreset === 'code_ide' && (
          <div className="w-full max-w-4xl bg-[#1e1e1e] border border-zinc-800 rounded-xl overflow-hidden shadow-2xl font-mono text-xs select-none">
            {/* Editor Top Bar */}
            <div className="bg-[#252526] px-3 py-1.5 flex items-center justify-between border-b border-[#191919] text-zinc-400">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 mr-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                </div>
                <div className="bg-[#1e1e1e] text-blue-400 px-3 py-1 rounded-t border-t-2 border-blue-500 flex items-center gap-1.5 text-[11px]">
                  <Code2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>auth-token-pipeline.ts</span>
                </div>
                <div className="text-zinc-500 px-2 py-1 text-[11px]">user-session.resolver.ts</div>
              </div>
              <span className="text-[10px] text-zinc-500">TypeScript 5.8 • UTF-8</span>
            </div>

            {/* Code Body */}
            <div className="p-4 text-zinc-200 leading-relaxed overflow-x-auto">
              <div className="flex gap-4">
                <div className="text-zinc-600 select-none text-right pr-2 border-r border-zinc-800">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>
                <div className="text-zinc-300">
                  <div><span className="text-purple-400">import</span> &#123; <span className="text-yellow-300">verifySession</span>, <span className="text-yellow-300">rotateJwtPair</span> &#125; <span className="text-purple-400">from</span> <span className="text-emerald-300">'@apex/security-vault'</span>;</div>
                  <div><span className="text-purple-400">import</span> &#123; <span className="text-yellow-300">RedisClusterCache</span> &#125; <span className="text-purple-400">from</span> <span className="text-emerald-300">'@apex/cache'</span>;</div>
                  <div className="h-3" />
                  <div><span className="text-purple-400">export async function</span> <span className="text-blue-400">handleDistributedAuthVerification</span>(</div>
                  <div className="pl-4"><span className="text-sky-300">req</span>: <span className="text-green-400">AuthenticatedRequest</span>,</div>
                  <div className="pl-4"><span className="text-sky-300">res</span>: <span className="text-green-400">Response</span></div>
                  <div>): <span className="text-green-400">Promise</span>&lt;<span className="text-yellow-300">AuthContext</span>&gt; &#123;</div>
                  <div className="pl-4"><span className="text-purple-400">const</span> token = req.headers[<span className="text-emerald-300">'authorization'</span>]?.replace(<span className="text-emerald-300">'Bearer '</span>, <span className="text-emerald-300">''</span>);</div>
                  <div className="pl-4"><span className="text-purple-400">const</span> cachedSession = <span className="text-purple-400">await</span> RedisClusterCache.<span className="text-blue-300">get</span>(token);</div>
                  <div className="pl-4"><span className="text-purple-400">if</span> (cachedSession) <span className="text-purple-400">return</span> &#123; <span className="text-sky-300">valid</span>: <span className="text-blue-400">true</span>, <span className="text-sky-300">userId</span>: cachedSession.userId &#125;;</div>
                  <div className="pl-4"><span className="text-purple-400">return await</span> <span className="text-blue-400">rotateJwtPair</span>(req.user);</div>
                  <div>&#125;</div>
                </div>
              </div>
            </div>

            {/* Terminal at Bottom */}
            <div className="bg-[#181818] p-2.5 border-t border-zinc-800 text-[11px] text-zinc-400 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">$</span>
                <span className="text-zinc-200">npm test -- --coverage</span>
                <span className="text-emerald-400 ml-2">PASS (42 test suites, 318 passed, 0 failed in 1.48s)</span>
              </div>
              <span className="text-zinc-500">Node v22.14.0</span>
            </div>
          </div>
        )}

        {/* 3. ARCHITECTURE DIAGRAM */}
        {selectedPreset === 'architecture_diagram' && (
          <div className="w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-2xl select-none">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
              <div>
                <span className="text-xs font-semibold text-blue-400 tracking-wide uppercase">System Architecture Topology</span>
                <h3 className="text-base font-bold text-white">Global Real-Time Message Bus & Cache Cluster</h3>
              </div>
              <span className="bg-blue-500/10 text-blue-400 text-xs px-2.5 py-1 rounded border border-blue-500/20 font-mono">
                p99 &lt; 14ms
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-3">
                <div className="bg-zinc-800 p-3 rounded-lg border border-zinc-700 text-center">
                  <span className="text-xs font-bold text-white block">Edge Ingress (Cloudflare)</span>
                  <span className="text-[10px] text-emerald-400">WAF & DDoS Mitigation</span>
                </div>
                <div className="bg-zinc-800 p-3 rounded-lg border border-zinc-700 text-center">
                  <span className="text-xs font-bold text-white block">Envoy Load Balancer</span>
                  <span className="text-[10px] text-blue-400">gRPC & HTTP/3</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="bg-zinc-800 p-3 rounded-lg border border-zinc-700 text-center">
                  <span className="text-xs font-bold text-white block">Auth & Identity Gateway</span>
                  <span className="text-[10px] text-purple-400">Zero-Trust mTLS</span>
                </div>
                <div className="bg-blue-900/30 p-3 rounded-lg border border-blue-600/50 text-center">
                  <span className="text-xs font-bold text-blue-300 block">Core Compute Cluster</span>
                  <span className="text-[10px] text-blue-200">Autoscaling (60 Pods)</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="bg-zinc-800 p-3 rounded-lg border border-zinc-700 text-center">
                  <span className="text-xs font-bold text-white block">Redis Sentinel Tier</span>
                  <span className="text-[10px] text-rose-400">99.999% Availability</span>
                </div>
                <div className="bg-zinc-800 p-3 rounded-lg border border-zinc-700 text-center">
                  <span className="text-xs font-bold text-white block">Spanner Multi-Region DB</span>
                  <span className="text-[10px] text-amber-400">Strong Consistency</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. EXECUTIVE SLIDE DECK */}
        {selectedPreset === 'allhands_slides' && (
          <div className="w-full max-w-4xl aspect-[16/9] bg-gradient-to-br from-zinc-900 via-slate-900 to-zinc-950 border border-zinc-800 rounded-xl p-8 shadow-2xl flex flex-col justify-between select-none">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold tracking-widest uppercase text-blue-400">Apex Global Horizons 2026</span>
              <span className="text-xs text-zinc-500 font-mono">Slide {currentSlide} of 4</span>
            </div>

            {currentSlide === 1 && (
              <div className="space-y-4 my-auto">
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  Scaling Next-Gen Real-Time Architecture & AI Capabilities
                </h1>
                <p className="text-sm text-zinc-400 max-w-xl">
                  Delivering ultra-low latency collaboration, enterprise compliance, and automated productivity loops.
                </p>
                <div className="flex gap-4 pt-2">
                  <div className="bg-zinc-800/80 border border-zinc-700 px-4 py-2 rounded-lg">
                    <span className="text-xs text-zinc-400 block">Q3 Focus</span>
                    <span className="text-base font-bold text-white">Zero-Latency Sync</span>
                  </div>
                  <div className="bg-zinc-800/80 border border-zinc-700 px-4 py-2 rounded-lg">
                    <span className="text-xs text-zinc-400 block">Target NPS</span>
                    <span className="text-base font-bold text-emerald-400">+72 Score</span>
                  </div>
                </div>
              </div>
            )}

            {currentSlide === 2 && (
              <div className="space-y-4 my-auto">
                <h2 className="text-2xl font-bold text-white">Strategic Growth Pillars</h2>
                <div className="grid grid-cols-3 gap-4 pt-2">
                  <div className="p-4 bg-zinc-800/60 rounded-lg border border-zinc-700">
                    <span className="text-blue-400 font-bold block mb-1">01. Enterprise Core</span>
                    <p className="text-xs text-zinc-300">SOC2 Type II, HIPAA compliance, custom SSO pipelines.</p>
                  </div>
                  <div className="p-4 bg-zinc-800/60 rounded-lg border border-zinc-700">
                    <span className="text-emerald-400 font-bold block mb-1">02. AI Integrations</span>
                    <p className="text-xs text-zinc-300">Real-time meeting synthesis, proactive action items.</p>
                  </div>
                  <div className="p-4 bg-zinc-800/60 rounded-lg border border-zinc-700">
                    <span className="text-purple-400 font-bold block mb-1">03. Global Edge</span>
                    <p className="text-xs text-zinc-300">Expanding Tokyo, Frankfurt, and Sao Paulo nodes.</p>
                  </div>
                </div>
              </div>
            )}

            {currentSlide >= 3 && (
              <div className="space-y-4 my-auto text-center">
                <h2 className="text-3xl font-extrabold text-white">Thank You Everyone!</h2>
                <p className="text-sm text-zinc-400">Questions & Open Discussion</p>
              </div>
            )}

            {/* Slide Navigation footer */}
            <div className="flex items-center justify-between border-t border-zinc-800 pt-3">
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentSlide((s) => Math.max(1, s - 1))}
                  disabled={currentSlide === 1}
                  className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-zinc-300"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentSlide((s) => Math.min(4, s + 1))}
                  disabled={currentSlide === 4}
                  className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-zinc-300"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <span className="text-xs text-zinc-500">CONFIDENTIAL — Internal Only</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
