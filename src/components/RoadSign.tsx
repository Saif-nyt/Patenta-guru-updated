import React from 'react';

export type RoadSignCode =
  | 'stop'
  | 'dare_precedenza'
  | 'diritto_precedenza'
  | 'intersezione_destra'
  | 'strada_deformata'
  | 'curva_destra'
  | 'curva_sinistra'
  | 'doppia_curva'
  | 'pedonale'
  | 'limite_50'
  | 'limite_110'
  | 'limite_130'
  | 'divieto_sosta'
  | 'divieto_fermata'
  | 'divieto_sorpasso'
  | 'passaggio_livello'
  | 'tram'
  | 'parcheggio';

interface RoadSignProps {
  code: RoadSignCode | string;
  size?: number; // width & height in px, default 110
  className?: string;
}

export const RoadSign: React.FC<RoadSignProps> = ({ code, size = 110, className = '' }) => {
  // If code is numeric (e.g. 240, '097', '153') or contains image path, render official ministerial sign GIF
  const isNumeric = /^\d+$/.test(String(code).trim());
  if (isNumeric) {
    const imgId = String(code).trim();
    return (
      <div className={`inline-flex items-center justify-center p-2 rounded-2xl bg-white shadow-lg border border-slate-200 ${className}`}>
        <img
          src={`/signs/${imgId}.gif`}
          alt={`Segnale ${imgId}`}
          style={{ maxHeight: size, maxWidth: size * 1.5 }}
          className="object-contain"
          onError={(e) => {
            // If direct id fails, try with 3-digit padding
            const target = e.currentTarget;
            const padded = imgId.padStart(3, '0');
            if (!target.src.includes(padded)) {
              target.src = `/signs/${padded}.gif`;
            }
          }}
        />
      </div>
    );
  }

  switch (code) {
    // 🛑 STOP: Red octagon, white border, bold white STOP text
    case 'stop':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          <polygon points="30,5 70,5 95,30 95,70 70,95 30,95 5,70 5,30" fill="#DC2626" />
          <polygon points="31,8 69,8 92,31 92,69 69,92 31,92 8,69 8,31" fill="none" stroke="#FFFFFF" strokeWidth="3" />
          <text x="50" y="58" fill="#FFFFFF" fontSize="22" fontWeight="900" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" letterSpacing="1">
            STOP
          </text>
        </svg>
      );

    // ▽ DARE PRECEDENZA: Inverted triangle, white background, thick red border
    case 'dare_precedenza':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          <polygon points="50,92 8,12 92,12" fill="#FFFFFF" stroke="#DC2626" strokeWidth="12" strokeLinejoin="round" />
        </svg>
      );

    // ⚠️ STRADA DEFORMATA: Danger triangle (point up), red border, 2 bumps
    case 'strada_deformata':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          <polygon points="50,8 92,88 8,88" fill="#FFFFFF" stroke="#DC2626" strokeWidth="12" strokeLinejoin="round" />
          {/* Two road bumps */}
          <path
            d="M 28 66 Q 36 48 44 66 Q 52 48 60 66 Q 66 66 72 66"
            fill="none"
            stroke="#111827"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </svg>
      );

    // ⚠️ CURVA PERICOLOSA A DESTRA
    case 'curva_destra':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          <polygon points="50,8 92,88 8,88" fill="#FFFFFF" stroke="#DC2626" strokeWidth="12" strokeLinejoin="round" />
          {/* Right curved arrow */}
          <path
            d="M 40 72 L 40 54 Q 40 42 54 42 L 64 42"
            fill="none"
            stroke="#111827"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <polygon points="62,34 74,42 62,50" fill="#111827" />
        </svg>
      );

    // ⚠️ ATTRAVERSAMENTO PEDONALE
    case 'pedonale':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          <polygon points="50,8 92,88 8,88" fill="#FFFFFF" stroke="#DC2626" strokeWidth="12" strokeLinejoin="round" />
          {/* Pedestrian silhouette */}
          <circle cx="50" cy="40" r="4.5" fill="#111827" />
          {/* Body & Walking legs */}
          <path d="M 50 46 L 50 60 L 43 74 M 50 56 L 58 73 M 43 54 L 56 49" fill="none" stroke="#111827" strokeWidth="3.5" strokeLinecap="round" />
          {/* Zebra stripes */}
          <line x1="32" y1="76" x2="68" y2="76" stroke="#111827" strokeWidth="2.5" strokeDasharray="5,4" />
        </svg>
      );

    // ⭕ SPEED LIMIT 50: White circle with thick red border, black 50
    case 'limite_50':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="44" fill="#FFFFFF" stroke="#DC2626" strokeWidth="11" />
          <text x="50" y="60" fill="#111827" fontSize="34" fontWeight="900" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif">
            50
          </text>
        </svg>
      );

    // ⭕ SPEED LIMIT 110: White circle with thick red border, black 110
    case 'limite_110':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="44" fill="#FFFFFF" stroke="#DC2626" strokeWidth="11" />
          <text x="50" y="58" fill="#111827" fontSize="27" fontWeight="900" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif">
            110
          </text>
        </svg>
      );

    // 🚫 DIVIETO DI SOSTA: Blue circle, red border, single diagonal red slash
    case 'divieto_sosta':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="44" fill="#1D4ED8" stroke="#DC2626" strokeWidth="10" />
          <line x1="20" y1="20" x2="80" y2="80" stroke="#DC2626" strokeWidth="9" />
        </svg>
      );

    // 🚫 DIVIETO DI FERMATA: Blue circle, red border, double diagonal red cross
    case 'divieto_fermata':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="44" fill="#1D4ED8" stroke="#DC2626" strokeWidth="10" />
          <line x1="20" y1="20" x2="80" y2="80" stroke="#DC2626" strokeWidth="8" />
          <line x1="80" y1="20" x2="20" y2="80" stroke="#DC2626" strokeWidth="8" />
        </svg>
      );

    // ⛔ DIVIETO DI SORPASSO: Red border, left car RED (forbidden), right car BLACK
    case 'divieto_sorpasso':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="44" fill="#FFFFFF" stroke="#DC2626" strokeWidth="10" />
          {/* Red Car (left) */}
          <rect x="25" y="44" width="22" height="14" rx="3" fill="#DC2626" />
          <polygon points="28,44 32,38 40,38 44,44" fill="#DC2626" />
          <circle cx="30" cy="58" r="2.5" fill="#111827" />
          <circle cx="42" cy="58" r="2.5" fill="#111827" />

          {/* Black Car (right) */}
          <rect x="53" y="44" width="22" height="14" rx="3" fill="#111827" />
          <polygon points="56,44 60,38 68,38 72,44" fill="#111827" />
          <circle cx="58" cy="58" r="2.5" fill="#111827" />
          <circle cx="70" cy="58" r="2.5" fill="#111827" />
        </svg>
      );

    // ⚠️ TRAMWAY TRANSIT
    case 'tram':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          <polygon points="50,8 92,88 8,88" fill="#FFFFFF" stroke="#DC2626" strokeWidth="12" strokeLinejoin="round" />
          {/* Tram silhouette */}
          <rect x="36" y="46" width="28" height="22" rx="3" fill="#111827" />
          {/* Windows */}
          <rect x="40" y="50" width="8" height="6" fill="#FFFFFF" />
          <rect x="52" y="50" width="8" height="6" fill="#FFFFFF" />
          {/* Tram roof pantograph */}
          <line x1="50" y1="46" x2="50" y2="38" stroke="#111827" strokeWidth="2.5" />
          <line x1="44" y1="38" x2="56" y2="38" stroke="#111827" strokeWidth="2.5" />
          {/* Rails */}
          <line x1="30" y1="74" x2="70" y2="74" stroke="#111827" strokeWidth="3" />
        </svg>
      );

    // 🅿️ PARCHEGGIO: Blue square with white P
    case 'parcheggio':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          <rect x="8" y="8" width="84" height="84" rx="14" fill="#1D4ED8" stroke="#FFFFFF" strokeWidth="3" />
          <text x="50" y="70" fill="#FFFFFF" fontSize="62" fontWeight="900" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif">
            P
          </text>
        </svg>
      );

    // ⚠️ INCROCIO CON DIRITTO DI PRECEDENZA A DESTRA (General intersection)
    case 'intersezione_destra':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          <polygon points="50,8 92,88 8,88" fill="#FFFFFF" stroke="#DC2626" strokeWidth="12" strokeLinejoin="round" />
          {/* Black Cross X */}
          <line x1="35" y1="42" x2="65" y2="72" stroke="#111827" strokeWidth="7" strokeLinecap="round" />
          <line x1="65" y1="42" x2="35" y2="72" stroke="#111827" strokeWidth="7" strokeLinecap="round" />
        </svg>
      );

    // ⚠️ PASSAGGIO A LIVELLO (St. Andrew's cross)
    case 'passaggio_livello':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          {/* White cross with red border (Croce di Sant'Andrea) */}
          <line x1="15" y1="15" x2="85" y2="85" stroke="#DC2626" strokeWidth="16" strokeLinecap="square" />
          <line x1="15" y1="15" x2="85" y2="85" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="square" />
          <line x1="85" y1="15" x2="15" y2="85" stroke="#DC2626" strokeWidth="16" strokeLinecap="square" />
          <line x1="85" y1="15" x2="15" y2="85" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="square" />
        </svg>
      );

    default:
      return (
        <div className="w-16 h-16 rounded-xl bg-slate-900 border border-white/20 flex items-center justify-center font-bold text-xs text-amber-400">
          🚦
        </div>
      );
  }
};

