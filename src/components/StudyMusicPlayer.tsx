import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Music, ExternalLink, Sparkles } from 'lucide-react';

// The user's chosen study sound — plays via YouTube's official embed player (loops for the full 3 hours)
const YT_VIDEO_ID = 'q76bMs-NwRk';
const TRACK_TITLE = 'Night Rain — Relax & Study';
const TRACK_SUBTITLE = 'Gentle rain sounds • 3 hours • loops automatically';
const YT_VOLUME = 30;
const HOST_ID = 'patente-yt-study-host';

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let ytApiPromise: Promise<any> | null = null;

const loadYouTubeApi = (): Promise<any> => {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (ytApiPromise) return ytApiPromise;

  ytApiPromise = new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => reject(new Error('YouTube API timeout')), 8000);

    const previousCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      window.clearTimeout(timeout);
      try {
        previousCallback?.();
      } catch {}
      resolve(window.YT);
    };

    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.async = true;
    script.onerror = () => {
      window.clearTimeout(timeout);
      ytApiPromise = null;
      reject(new Error('YouTube API failed to load'));
    };
    document.head.appendChild(script);
  });

  return ytApiPromise;
};

export const StudyMusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [elapsed, setElapsed] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [showControls, setShowControls] = useState<boolean>(false);

  const playerRef = useRef<any>(null);
  const isStartingRef = useRef(false);

  // Create the hidden YouTube player (off-screen, audio only) on first use
  const createPlayer = async (autoplay: boolean): Promise<any> => {
    const YT = await loadYouTubeApi();

    if (playerRef.current) return playerRef.current;

    // Keep the host outside React's tree: the IFrame API replaces this node with the <iframe>
    const host = document.getElementById(HOST_ID) || (() => {
      const wrapper = document.createElement('div');
      wrapper.id = HOST_ID;
      wrapper.setAttribute('aria-hidden', 'true');
      wrapper.style.cssText = 'position:fixed;width:1px;height:1px;left:-9999px;bottom:0;overflow:hidden;opacity:0;pointer-events:none;';
      document.body.appendChild(wrapper);
      const inner = document.createElement('div');
      wrapper.appendChild(inner);
      return wrapper;
    })();

    return new Promise<any>((resolve) => {
      const player = new YT.Player(host.firstElementChild as HTMLElement, {
        videoId: YT_VIDEO_ID,
        width: '1',
        height: '1',
        playerVars: {
          autoplay: autoplay ? 1 : 0,
          controls: 0,
          disablekb: 1,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          loop: 1,
          playlist: YT_VIDEO_ID,
          iv_load_policy: 3,
          origin: window.location.origin,
        },
        events: {
          onReady: (e: any) => {
            try {
              e.target.setVolume(YT_VOLUME);
            } catch {}
            if (autoplay) {
              try {
                e.target.playVideo();
              } catch {}
            }
            setIsPlaying(autoplay);
            resolve(player);
          },
          onStateChange: (e: any) => {
            const playing = e.data === window.YT?.PlayerState?.PLAYING;
            setIsPlaying(playing);
            // Safety net: loop again if the player ever reaches the end
            if (e.data === window.YT?.PlayerState?.ENDED) {
              try {
                e.target.playVideo();
              } catch {}
            }
          },
          onError: () => {
            setIsPlaying(false);
          },
        },
      });
      playerRef.current = player;
    });
  };

  const togglePlay = async () => {
    if (isStartingRef.current) return;

    try {
      if (isPlaying && playerRef.current) {
        try {
          playerRef.current.pauseVideo();
        } catch {}
        setIsPlaying(false);
        try {
          localStorage.setItem('patente_study_music', 'false');
        } catch {}
        return;
      }

      isStartingRef.current = true;

      if (playerRef.current) {
        try {
          playerRef.current.playVideo();
        } catch {}
        setIsPlaying(true);
      } else {
        await createPlayer(true);
      }

      try {
        localStorage.setItem('patente_study_music', 'true');
      } catch {}
    } catch (err) {
      console.warn('Study music (YouTube) failed to start:', err);
      setIsPlaying(false);
    } finally {
      isStartingRef.current = false;
    }
  };

  // Restore playback after a reload when the user had music on (browsers may still block autoplay)
  useEffect(() => {
    let cancelled = false;
    let resumeTimer = 0;

    try {
      if (localStorage.getItem('patente_study_music') !== 'true') return;
    } catch {
      return;
    }

    (async () => {
      try {
        await createPlayer(true);
        if (cancelled) return;
        // If the browser blocked the autoplay, be honest in the UI
        resumeTimer = window.setTimeout(() => {
          const state = playerRef.current?.getPlayerState?.();
          if (state !== window.YT?.PlayerState?.PLAYING) {
            setIsPlaying(false);
            try {
              localStorage.setItem('patente_study_music', 'false');
            } catch {}
          }
        }, 1500);
      } catch {
        /* offline / blocked — the button stays available for a manual tap */
      }
    })();

    return () => {
      cancelled = true;
      window.clearTimeout(resumeTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Progress of the playing track
  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => {
      const player = playerRef.current;
      if (!player?.getCurrentTime || !player?.getDuration) return;
      try {
        setElapsed(player.getCurrentTime() || 0);
        setDuration(player.getDuration() || 0);
      } catch {}
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isPlaying]);

  // Auto-duck the rain while the Italian voice (quiz pronunciation) is speaking
  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => {
      const player = playerRef.current;
      if (!player?.setVolume) return;
      const ducking = 'speechSynthesis' in window && window.speechSynthesis.speaking;
      try {
        player.setVolume(ducking ? 4 : YT_VOLUME);
      } catch {}
    }, 300);
    return () => window.clearInterval(timer);
  }, [isPlaying]);

  // Tear the player down when the header unmounts
  useEffect(() => {
    return () => {
      try {
        playerRef.current?.destroy?.();
      } catch {}
      playerRef.current = null;
      document.getElementById(HOST_ID)?.remove();
    };
  }, []);

  const formatTime = (secs: number) => {
    const total = Math.max(0, Math.floor(secs || 0));
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    const mm = h > 0 ? `${h}:${m < 10 ? '0' : ''}${m}` : `${m}`;
    return `${mm}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={togglePlay}
          className={`py-2 sm:py-2.5 px-3 sm:px-3.5 rounded-xl border text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs ${
            isPlaying
              ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-700'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
          title={isPlaying ? 'Click to Stop Background Rain Music' : 'Click to Play Relaxing Rain Study Music'}
        >
          {isPlaying ? (
            <>
              <span className="flex items-center gap-0.5 h-3.5">
                <span className="w-1 h-2 bg-amber-500 rounded-full animate-bounce" />
                <span className="w-1 h-3.5 bg-amber-600 rounded-full animate-pulse" />
                <span className="w-1 h-2.5 bg-amber-500 rounded-full animate-bounce" />
              </span>
              <Volume2 className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span className="hidden sm:inline">Music ON ({formatTime(elapsed)})</span>
            </>
          ) : (
            <>
              <Music className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="hidden sm:inline">Study Music</span>
            </>
          )}
        </button>

        {/* Track info drawer button */}
        {isPlaying && (
          <button
            type="button"
            onClick={() => setShowControls(!showControls)}
            className="p-1.5 rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-100/70 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 text-xs font-bold hover:bg-amber-200 cursor-pointer transition"
            title="Track details"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Floating track information drawer */}
      {isPlaying && showControls && (
        <div className="absolute top-full right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-slate-900 p-4 shadow-xl border border-slate-200 dark:border-slate-800 z-50 animate-fadeIn space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <span>Now Playing</span>
            </span>
            <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
              {formatTime(elapsed)} / {duration ? formatTime(duration) : '3:00:00'}
            </span>
          </div>

          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{TRACK_TITLE}</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">{TRACK_SUBTITLE}</p>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-1000"
              style={{
                width: `${duration ? Math.min(100, (elapsed / duration) * 100) : 0}%`,
              }}
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-slate-400">Loops automatically</span>
            <a
              href={`https://www.youtube.com/watch?v=${YT_VIDEO_ID}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer flex items-center gap-1 transition"
            >
              <ExternalLink className="w-3 h-3" />
              <span>YouTube</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
