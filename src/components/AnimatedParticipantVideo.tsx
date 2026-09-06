import { useEffect, useRef } from 'react';
import { Participant } from '../types';

interface AnimatedParticipantVideoProps {
  participant: Participant;
  isCurrentUser?: boolean;
  virtualBgUrl?: string;
  isFrozen?: boolean;
}

export default function AnimatedParticipantVideo({
  participant,
  isCurrentUser = false,
  virtualBgUrl,
  isFrozen = false,
}: AnimatedParticipantVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Handle real webcam
  useEffect(() => {
    let active = true;

    if (isCurrentUser && participant.videoType === 'webcam' && participant.isVideoOn) {
      navigator.mediaDevices
        ?.getUserMedia({ video: { width: 640, height: 360 }, audio: false })
        .then((stream) => {
          if (active && videoRef.current) {
            videoRef.current.srcObject = stream;
            streamRef.current = stream;
          } else {
            stream.getTracks().forEach((t) => t.stop());
          }
        })
        .catch((err) => {
          console.warn('Webcam permission denied or not available:', err);
        });
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    }

    return () => {
      active = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, [isCurrentUser, participant.videoType, participant.isVideoOn]);

  // Handle procedural realistic micro-animation canvas for fake video participants
  useEffect(() => {
    if (participant.videoType === 'webcam') return;
    if (!participant.isVideoOn) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = Math.random() * 100;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = participant.avatarUrl;

    const bgImg = new Image();
    if (virtualBgUrl && virtualBgUrl.startsWith('http')) {
      bgImg.crossOrigin = 'anonymous';
      bgImg.src = virtualBgUrl;
    }

    let isLoaded = false;
    img.onload = () => {
      isLoaded = true;
    };

    const render = () => {
      if (!canvas || !ctx) return;
      const w = canvas.width;
      const h = canvas.height;

      time += isFrozen ? 0 : 0.03;

      // Draw background
      if (virtualBgUrl && virtualBgUrl.startsWith('http') && bgImg.complete) {
        ctx.drawImage(bgImg, 0, 0, w, h);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.fillRect(0, 0, w, h);
      } else if (virtualBgUrl === 'blur') {
        // blurred background effect
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 0, w, h);
      } else {
        // realistic indoor backdrop gradient
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, '#18181b');
        grad.addColorStop(1, '#09090b');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }

      if (isLoaded) {
        // Micro natural breathing / head movement / eye contact
        let headOffsetY = 0;
        let headOffsetX = 0;
        let headTilt = 0;

        if (!isFrozen) {
          // Subtle natural shoulder breathing & posture shift
          const breathCycle = Math.sin(time * 1.4);
          headOffsetY = breathCycle * 2.2;
          headTilt = Math.sin(time * 0.7) * 0.008;

          if (participant.behavior === 'nodder') {
            headOffsetY += Math.sin(time * 3.5) * 5;
            headTilt += Math.sin(time * 1.8) * 0.015;
          } else if (participant.behavior === 'distracted') {
            headOffsetX += Math.sin(time * 0.6) * 10;
            headOffsetY += Math.cos(time * 0.4) * 3;
            headTilt += Math.sin(time * 0.6) * 0.03;
          } else if (participant.behavior === 'sleeping') {
            headOffsetY = 12 + Math.sin(time * 0.8) * 2;
            headTilt = 0.07;
          } else if (participant.behavior === 'talkative') {
            headOffsetY += Math.sin(time * 4) * 3.5;
            headOffsetX += Math.cos(time * 2) * 2;
          }

          if (participant.isSpeaking) {
            // Realistic active speaker head pacing & energy
            headOffsetY += Math.sin(time * 7) * 3.5;
            headOffsetX += Math.cos(time * 4) * 2;
            headTilt += Math.sin(time * 3.5) * 0.015;
          }
        }

        ctx.save();

        // Calculate aspect fill for realistic webcam framing
        const scale = Math.max(w / img.width, h / img.height) * 1.08;
        const drawW = img.width * scale;
        const drawH = img.height * scale;
        const drawX = (w - drawW) / 2 + headOffsetX;
        const drawY = (h - drawH) / 2 + headOffsetY;

        ctx.translate(w / 2, h / 2);
        ctx.rotate(headTilt);
        ctx.translate(-w / 2, -h / 2);

        // Draw webcam person image filling frame with realistic depth
        ctx.drawImage(img, drawX, drawY, drawW, drawH);

        // Natural room lighting vignette / soft webcam sensor feel
        const vignette = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.4, w / 2, h / 2, Math.max(w, h) * 0.8);
        vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
        vignette.addColorStop(1, 'rgba(0, 0, 0, 0.28)');
        ctx.fillStyle = vignette;
        ctx.fillRect(0, 0, w, h);

        // Natural eyelid blinking simulation
        if (!isFrozen && participant.behavior !== 'sleeping') {
          const blinkInterval = Math.sin(time * 1.5 + (participant.id.charCodeAt(0) || 0));
          if (blinkInterval > 0.965) {
            ctx.fillStyle = 'rgba(28, 25, 23, 0.92)';
            const eyeLevelY = h * 0.42 + headOffsetY;
            ctx.beginPath();
            ctx.ellipse(w * 0.42 + headOffsetX, eyeLevelY, 10, 2.5, headTilt, 0, Math.PI * 2);
            ctx.ellipse(w * 0.58 + headOffsetX, eyeLevelY, 10, 2.5, headTilt, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Realistic speaking mouth movement when unmuted and talking
        if (participant.isSpeaking && !isFrozen) {
          const mouthOpen = (Math.sin(time * 14) + 1) * 0.5 * 5.5 + 1.5;
          const mouthY = h * 0.64 + headOffsetY;
          ctx.fillStyle = '#1c1917';
          ctx.beginPath();
          ctx.ellipse(w / 2 + headOffsetX, mouthY, 7.5, Math.max(2, mouthOpen), headTilt, 0, Math.PI * 2);
          ctx.fill();

          // Lower lip highlight
          ctx.strokeStyle = 'rgba(244, 114, 182, 0.35)';
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }

        ctx.restore();

        // Behavior specific overlays
        if (participant.behavior === 'cat_filter') {
          // Draw cute cat ears & whiskers
          ctx.save();
          ctx.translate(w / 2 + headOffsetX, h / 2 + headOffsetY - 50);
          ctx.fillStyle = '#f97316';
          // Left ear
          ctx.beginPath();
          ctx.moveTo(-45, -30);
          ctx.lineTo(-70, -75);
          ctx.lineTo(-20, -60);
          ctx.fill();
          // Right ear
          ctx.beginPath();
          ctx.moveTo(45, -30);
          ctx.lineTo(70, -75);
          ctx.lineTo(20, -60);
          ctx.fill();
          // Nose
          ctx.fillStyle = '#f43f5e';
          ctx.beginPath();
          ctx.arc(0, 10, 8, 0, Math.PI * 2);
          ctx.fill();
          // Whiskers
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(-15, 10);
          ctx.lineTo(-50, 5);
          ctx.moveTo(-15, 15);
          ctx.lineTo(-48, 20);
          ctx.moveTo(15, 10);
          ctx.lineTo(50, 5);
          ctx.moveTo(15, 15);
          ctx.lineTo(48, 20);
          ctx.stroke();
          ctx.restore();
        }

        if (participant.behavior === 'sleeping') {
          ctx.save();
          ctx.font = 'bold 20px sans-serif';
          ctx.fillStyle = '#60a5fa';
          const zOffset = (time * 15) % 40;
          ctx.fillText('Z', w / 2 + 50 + zOffset * 0.3, h / 2 - 30 - zOffset);
          ctx.font = 'bold 14px sans-serif';
          ctx.fillText('z', w / 2 + 35 + zOffset * 0.2, h / 2 - 15 - zOffset * 0.8);
          ctx.restore();
        }

        if (participant.behavior === 'eater') {
          // Snack chip bag overlay in corner
          ctx.save();
          ctx.font = '28px sans-serif';
          ctx.fillText('🍿', w / 2 + 55, h - 35);
          ctx.restore();
        }

        // Speaking lip animation or audio pulse waves
        if (participant.isSpeaking && !isFrozen) {
          ctx.save();
          // Mouth speaking overlay
          const mouthOpen = (Math.sin(time * 12) + 1) * 0.5 * 7;
          ctx.fillStyle = '#1c1917';
          ctx.beginPath();
          ctx.ellipse(w / 2 + headOffsetX, h / 2 + headOffsetY + 15, 8, Math.max(2, mouthOpen), 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // Frozen / Bad Connection overlay
        if (isFrozen || participant.connectionQuality === 'frozen') {
          ctx.save();
          ctx.fillStyle = 'rgba(0,0,0,0.45)';
          ctx.fillRect(0, 0, w, h);
          // Bad connection icon
          ctx.fillStyle = '#f97316';
          ctx.font = 'bold 12px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('⚠️ UNSTABLE CONNECTION (FROZEN)', w / 2, h / 2 + 40);
          ctx.restore();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [participant, virtualBgUrl, isFrozen]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-zinc-950 flex items-center justify-center">
      {/* Video off placeholder */}
      {!participant.isVideoOn ? (
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-zinc-700 bg-zinc-800 shadow-xl flex items-center justify-center">
            {participant.avatarUrl ? (
              <img
                src={participant.avatarUrl}
                alt={participant.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl font-bold text-zinc-300">
                {participant.name.slice(0, 2).toUpperCase()}
              </span>
            )}
          </div>
          <span className="text-xs text-zinc-400 font-medium">Video Paused</span>
        </div>
      ) : isCurrentUser && participant.videoType === 'webcam' ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover transform -scale-x-100 ${
            isFrozen ? 'filter blur-[1px] brightness-75' : ''
          }`}
        />
      ) : (
        <canvas
          ref={canvasRef}
          width={480}
          height={270}
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
}
