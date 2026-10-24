import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Film,
  Disc,
} from 'lucide-react';

interface HeroVideoProps {
  onExploreClick?: () => void;
}

export const HeroVideo: React.FC<HeroVideoProps> = ({ onExploreClick }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Gold particle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 400);

    const particles: Array<{
      x: number;
      y: number;
      radius: number;
      speedX: number;
      speedY: number;
      opacity: number;
      hue: number;
    }> = [];

    for (let i = 0; i < 45; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 0.8,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: -Math.random() * 0.6 - 0.1,
        opacity: Math.random() * 0.7 + 0.2,
        hue: Math.random() > 0.3 ? 45 : 38,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 85%, 65%, ${
          p.opacity * (isPlaying ? 0.9 : 0.4)
        })`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#d4af37';
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      if (!canvas.parentElement) return;

      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isPlaying]);

  // Play and pause video
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  // Mute and unmute video
  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  // Fullscreen video
  const handleFullscreen = () => {
    const container = document.getElementById('cinematic-video-frame');
    if (!container) return;

    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      container.requestFullscreen().catch(() => {});
    }
  };

  return (
    <div
      id="cinematic-video-frame"
      className="relative w-full max-w-[620px] mx-auto group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gold border and glow */}
      <div className="absolute -inset-[3px] rounded-2xl bg-gradient-to-r from-[#d4af37]/40 via-[#f3e5ab]/30 to-[#b8860b]/40 blur-md opacity-75 group-hover:opacity-100 group-hover:blur-lg transition-all duration-500" />

      {/* Video container */}
      <div className="relative rounded-2xl overflow-hidden bg-[#0c0c10] border border-[#d4af37]/40 shadow-[0_20px_50px_rgba(0,0,0,0.8)] aspect-[16/10]">

        {/* Your studio video — no generated logo or text */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted={isMuted}
          loop
          playsInline
          poster="/images of studio/123232.jpg"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        >
          <source src="/images of studio/logo.mp4" type="video/mp4" />
          <source src="/images%20of%20studio/logo.mp4" type="video/mp4" />
          Your browser does not support video playback.
        </video>

        {/* Subtle cinematic overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />

        {/* Gold particle effects */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none w-full h-full z-10"
        />

        {/* Video controls — kept intact */}
        <div
          className={`absolute bottom-3 left-3 right-3 z-30 flex items-center justify-between px-4 py-2 rounded-xl bg-[#0d0d14]/85 backdrop-blur-md border border-[#d4af37]/30 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-85 sm:opacity-0'
          }`}
        >
          <div className="flex items-center gap-3">
            <button
              id="hero-video-play-btn"
              onClick={togglePlay}
              className="p-1.5 rounded-lg bg-[#d4af37]/20 hover:bg-[#d4af37] text-[#f3e5ab] hover:text-[#0b0b0e] transition-colors"
              title={isPlaying ? 'Pause Video' : 'Play Video'}
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4 fill-current" />
              )}
            </button>

            <button
              id="hero-video-mute-btn"
              onClick={toggleMute}
              className="p-1.5 rounded-lg text-neutral-300 hover:text-[#d4af37] transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
              aria-label={isMuted ? 'Unmute video' : 'Mute video'}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>

            <span className="text-[10px] text-neutral-400 font-mono tracking-wider">
              {isPlaying ? 'PLAYING SHOWREEL' : 'PAUSED'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="hero-video-fullscreen-btn"
              onClick={handleFullscreen}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-[#d4af37] transition-colors"
              title="Fullscreen"
              aria-label="View fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Decorative bottom labels */}
      <div className="mt-3 flex items-center justify-between px-2 text-[11px] text-[#a39775] font-mono">
        <span className="flex items-center gap-1.5">
          <Film className="w-3.5 h-3.5 text-[#d4af37]" />
          NG Digital Studio
        </span>

        <span className="flex items-center gap-1.5">
          <Disc className="w-3.5 h-3.5 text-[#d4af37]" />
          Studio Moments
        </span>
      </div>
    </div>
  );
};