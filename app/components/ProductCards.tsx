'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

type CardId = 'solar' | 'battery' | 'ev' | null;

// ── All CSS keyframes for scene animations ───────────────────────────────────
const SCENE_CSS = `
  @keyframes srSunFloat {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-18px); }
  }
  @keyframes srRayPulse {
    0%, 100% { opacity: 0.3; }
    50%       { opacity: 1; }
  }
  @keyframes srPanel1 {
    0%,  30% { opacity: 0.12; }
    50%, 100% { opacity: 1; }
  }
  @keyframes srPanel2 {
    0%,  50% { opacity: 0.12; }
    65%, 100% { opacity: 1; }
  }
  @keyframes srPanel3 {
    0%,  65% { opacity: 0.12; }
    80%, 100% { opacity: 1; }
  }
  @keyframes srLightFlash {
    0%, 91%, 93%, 100% { opacity: 0; }
    92%                { opacity: 1; }
  }
  @keyframes srWinGlow {
    0%, 100% { opacity: 0.7; }
    50%       { opacity: 1; }
  }
  @keyframes srBattOpacity {
    0%, 100% { opacity: 0.55; }
    50%       { opacity: 1; }
  }
  @keyframes srDashMove {
    to { stroke-dashoffset: -24; }
  }
  @keyframes srBarGrid {
    0%, 10%  { height: 4px; }
    40%, 60% { height: 78px; }
    90%, 100% { height: 4px; }
  }
  @keyframes srBarSolar {
    0%, 10%  { height: 4px; }
    40%, 60% { height: 12px; }
    90%, 100% { height: 4px; }
  }
`;

// ── Product icons ─────────────────────────────────────────────────────────────

function SunIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
      stroke="#F0A500" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" fill="#F0A500" fillOpacity="0.25" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function BatteryIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
      stroke="#F0A500" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="16" height="10" rx="2" />
      <path d="M22 11v2" />
      <line x1="7" y1="12" x2="13" y2="12" stroke="#F0A500" strokeWidth="2.5" />
      <line x1="10" y1="9" x2="10" y2="15" stroke="#F0A500" strokeWidth="2.5" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
      stroke="#F0A500" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m13 2-9 11h8l-1 9 9-11h-8l1-9z" fill="#F0A500" fillOpacity="0.2" />
    </svg>
  );
}

// ── Animation scenes ──────────────────────────────────────────────────────────

function SolarScene() {
  const rayAngles = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <div
      className="relative rounded-xl overflow-hidden mt-4"
      style={{ height: '160px', background: 'linear-gradient(180deg,#080e1f 0%,#0f1d3d 60%,#162540 100%)' }}
    >
      {/* Floating sun */}
      <div style={{
        position: 'absolute', left: '50%', top: '22px',
        marginLeft: '-20px', width: '40px', height: '40px',
        animation: 'srSunFloat 3s ease-in-out infinite',
      }}>
        {/* Glow */}
        <div style={{
          position: 'absolute', inset: '-16px', borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(240,165,0,0.22) 0%,transparent 70%)',
        }} />
        {/* Rays */}
        {rayAngles.map((deg, i) => (
          <div key={deg} style={{
            position: 'absolute', top: '50%', left: '50%',
            transformOrigin: '0 50%',
            transform: `rotate(${deg}deg) translateX(26px) translateY(-1px)`,
          }}>
            <div style={{
              width: '11px', height: '2px', background: '#F0A500', borderRadius: '2px',
              animation: `srRayPulse 2s ease-in-out infinite ${i * 0.12}s`,
            }} />
          </div>
        ))}
        {/* Sun disk */}
        <div style={{
          width: '40px', height: '40px', borderRadius: '50%',
          background: 'radial-gradient(circle,#ffe566 10%,#F0A500 80%)',
          boxShadow: '0 0 16px 6px rgba(240,165,0,0.45)',
        }} />
      </div>

      {/* Roof silhouette + panels */}
      <svg viewBox="0 0 320 90" xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '90px' }}>
        <rect x="58" y="48" width="204" height="42" fill="#0d1524" />
        <polygon points="46,48 160,6 274,48" fill="#090f1e" />
        <rect x="83" y="29" width="38" height="15" rx="2" fill="#F0A500"
          style={{ animation: 'srPanel1 3s ease-in-out infinite' }} />
        <rect x="141" y="17" width="38" height="15" rx="2" fill="#F0A500"
          style={{ animation: 'srPanel2 3s ease-in-out infinite' }} />
        <rect x="199" y="29" width="38" height="15" rx="2" fill="#F0A500"
          style={{ animation: 'srPanel3 3s ease-in-out infinite' }} />
      </svg>
    </div>
  );
}

function BatteryScene() {
  const stars: [number, number][] = [[18,10],[52,22],[98,8],[150,16],[215,9],[262,21],[295,7],[308,32],[38,42],[172,5],[240,35]];
  return (
    <div className="relative rounded-xl overflow-hidden mt-4"
      style={{ height: '160px', background: 'linear-gradient(180deg,#040709 0%,#0a0d14 100%)' }}>
      <svg viewBox="0 0 320 160" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
        {stars.map(([x,y],i) => <circle key={i} cx={x} cy={y} r="1.2" fill="white" opacity="0.45" />)}

        {/* Lightning bolt */}
        <polygon points="157,14 148,47 157,47 147,77 165,41 157,41 165,14"
          fill="#fcd34d" style={{ animation: 'srLightFlash 5s ease-in-out infinite' }} />

        {/* Dark house helper */}
        {([10, 84, 238] as number[]).map((tx) => (
          <g key={tx} transform={`translate(${tx},76)`}>
            <rect x="0" y="34" width="54" height="50" fill="#10141e" />
            <polygon points="-5,34 27,4 59,34" fill="#0a0e18" />
            <rect x="8" y="44" width="15" height="12" rx="1" fill="#07090f" />
            <rect x="31" y="44" width="15" height="12" rx="1" fill="#07090f" />
          </g>
        ))}

        {/* Glowing house */}
        <g transform="translate(158,72)">
          <ellipse cx="27" cy="68" rx="38" ry="20" fill="#F0A500" opacity="0.05" />
          <rect x="0" y="34" width="54" height="54" fill="#111f18" />
          <polygon points="-5,34 27,4 59,34" fill="#0c1812" />
          <rect x="8" y="44" width="15" height="12" rx="1" fill="#fbbf24" opacity="0.9"
            style={{ animation: 'srWinGlow 2s ease-in-out infinite' }} />
          <rect x="31" y="44" width="15" height="12" rx="1" fill="#fbbf24" opacity="0.9"
            style={{ animation: 'srWinGlow 2.2s ease-in-out infinite 0.35s' }} />
          {/* Battery badge */}
          <rect x="14" y="91" width="24" height="11" rx="2" fill="none" stroke="#F0A500" strokeWidth="1.5"
            style={{ animation: 'srBattOpacity 2s ease-in-out infinite' }} />
          <rect x="38" y="94" width="3" height="5" rx="0.5" fill="#F0A500"
            style={{ animation: 'srBattOpacity 2s ease-in-out infinite' }} />
          <rect x="16" y="93" width="16" height="7" rx="1" fill="#F0A500" opacity="0.85"
            style={{ animation: 'srBattOpacity 2s ease-in-out infinite' }} />
        </g>

        <rect x="0" y="150" width="320" height="10" fill="#040709" />
      </svg>
    </div>
  );
}

function EvScene() {
  return (
    <div className="relative rounded-xl overflow-hidden mt-4"
      style={{ height: '160px', background: 'linear-gradient(180deg,#07090e 0%,#0d1118 100%)' }}>

      {/* Car + cable */}
      <svg viewBox="0 0 220 160" xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'absolute', left: 0, top: 0, width: '65%', height: '100%' }}>
        <rect x="8" y="86" width="130" height="36" rx="7" fill="#152a50" />
        <rect x="22" y="64" width="84" height="30" rx="9" fill="#0f2040" />
        <rect x="28" y="68" width="32" height="22" rx="3" fill="#0a1626" opacity="0.9" />
        <rect x="64" y="68" width="32" height="22" rx="3" fill="#0a1626" opacity="0.9" />
        <rect x="8" y="98" width="8" height="6" rx="2" fill="#fef9c3" opacity="0.6" />
        <circle cx="138" cy="102" r="5" fill="#F0A500" opacity="0.9" />
        <circle cx="38" cy="122" r="14" fill="#08090e" />
        <circle cx="38" cy="122" r="8" fill="#111827" />
        <circle cx="108" cy="122" r="14" fill="#08090e" />
        <circle cx="108" cy="122" r="8" fill="#111827" />
        <line x1="0" y1="136" x2="220" y2="136" stroke="#1e2333" strokeWidth="2" />
        <path d="M143 102 Q175 88 197 102" fill="none" stroke="#F0A500" strokeWidth="3"
          strokeDasharray="8 4" style={{ animation: 'srDashMove 0.7s linear infinite' }} />
        <rect x="194" y="86" width="22" height="32" rx="4" fill="#151f30" stroke="#F0A500" strokeWidth="1.5" />
        <rect x="198" y="92" width="14" height="8" rx="2" fill="#F0A500" opacity="0.7" />
        <text x="205" y="116" textAnchor="middle" fontSize="9" fill="#F0A500" fontWeight="bold">⚡</text>
      </svg>

      {/* Bar chart — HTML div so height animates reliably */}
      <div style={{
        position: 'absolute', right: '12px', bottom: '18px',
        display: 'flex', alignItems: 'flex-end', gap: '8px',
      }}>
        {[
          { label: 'Grid', price: '$150/mo', color: '#ef4444', gradFrom: '#991b1b', anim: 'srBarGrid' },
          { label: 'Solar', price: '$18/mo', color: '#F0A500', gradFrom: '#d4920a', anim: 'srBarSolar' },
        ].map(({ label, price, color, gradFrom, anim }) => (
          <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '8px', color, marginBottom: '3px', whiteSpace: 'nowrap' }}>{price}</span>
            <div style={{
              width: '22px', height: '4px',
              background: `linear-gradient(to top,${gradFrom},${color})`,
              borderRadius: '3px 3px 0 0',
              animation: `${anim} 5s ease-in-out infinite`,
            }} />
            <span style={{ fontSize: '7px', color: '#6b7280', marginTop: '3px' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Shared sub-components ─────────────────────────────────────────────────────

function StepFlow({ steps }: { steps: { emoji: string; label: string }[] }) {
  return (
    <div className="flex items-start justify-between mt-3">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center min-w-0">
          <div className="flex flex-col items-center">
            <span className="text-sm leading-none">{step.emoji}</span>
            <span className="text-[10px] text-gray-400 text-center mt-1 leading-tight max-w-[52px]">
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <span className="text-gray-600 text-xs shrink-0 mx-0.5 -mt-3">›</span>
          )}
        </div>
      ))}
    </div>
  );
}

function StatsRow({ stats }: { stats: { stat: string; label: string }[] }) {
  return (
    <div className="grid grid-cols-3 gap-2 mt-4">
      {stats.map(({ stat, label }) => (
        <div key={label} className="bg-[#1e2333] rounded-lg p-3 text-center">
          <p className="text-[#F0A500] font-bold text-sm leading-tight">{stat}</p>
          <p className="text-gray-400 text-xs mt-0.5 leading-tight">{label}</p>
        </div>
      ))}
    </div>
  );
}

// ── Individual card ───────────────────────────────────────────────────────────

interface CardProps {
  expanded: boolean;
  onToggle: () => void;
  icon: React.ReactNode;
  name: string;
  teaser: string;
  scene: React.ReactNode;
  educationTitle: string;
  educationBody: React.ReactNode;
  stats: { stat: string; label: string }[];
  ctaText: string;
  ctaHref: string;
}

function ProductCard({
  expanded, onToggle, icon, name, teaser,
  scene, educationTitle, educationBody, stats, ctaText, ctaHref,
}: CardProps) {
  return (
    <motion.div
      className={`bg-[#111827] rounded-2xl border p-6 cursor-pointer transition-colors duration-200 ${
        expanded
          ? 'border-[#F0A500]'
          : 'border-[#F0A500]/20 hover:border-[#F0A500]/60 hover:shadow-lg hover:shadow-[#F0A500]/10'
      }`}
      whileHover={!expanded ? { scale: 1.02 } : {}}
      transition={{ duration: 0.2 }}
      onClick={onToggle}
    >
      {/* Always-visible header */}
      <div className="text-[48px] leading-none">{icon}</div>
      <h3 className="text-white text-xl font-bold mt-3">{name}</h3>
      <p className="text-gray-400 text-sm mt-1">{teaser}</p>
      <p className="text-[#F0A500] text-sm mt-3 font-medium select-none">
        {expanded ? 'Close ↑' : 'Learn more ↓'}
      </p>

      {/* Expandable content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
          >
            {scene}

            <p className="text-white font-semibold mt-4 mb-1">{educationTitle}</p>
            {educationBody}

            <StatsRow stats={stats} />

            <Link
              href={ctaHref}
              onClick={(e) => e.stopPropagation()}
              className="mt-4 block w-full text-center rounded-lg bg-[#F0A500] text-[#1e2333] font-bold px-4 py-2 text-sm hover:bg-[#fbb82a] transition-colors"
            >
              {ctaText}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function ProductCards() {
  const [expanded, setExpanded] = useState<CardId>(null);

  const toggle = (id: Exclude<CardId, null>) => {
    setExpanded((prev) => (prev === id ? null : id));
  };

  return (
    <section className="bg-[#1e2333] px-4 py-14">
      <style>{SCENE_CSS}</style>
      <div className="mx-auto max-w-5xl">
        <h2 className="text-white text-3xl font-bold text-center mb-2">Our Products</h2>
        <p className="text-gray-400 text-center mb-8">Click any product to learn how it works and why it saves you money.</p>

        <div className="grid gap-4 sm:grid-cols-3">

          {/* ── Solar ── */}
          <ProductCard
            expanded={expanded === 'solar'}
            onToggle={() => toggle('solar')}
            icon={<SunIcon />}
            name="Solar Panels"
            teaser="Reduce your electric bill by up to 85%"
            scene={<SolarScene />}
            educationTitle="How Solar Works"
            educationBody={
              <StepFlow steps={[
                { emoji: '☀️', label: 'Sun hits panels' },
                { emoji: '⚡', label: 'DC converts to AC' },
                { emoji: '🏠', label: 'Powers your home' },
              ]} />
            }
            stats={[
              { stat: 'Up to 85%', label: 'Bill Reduction' },
              { stat: '25 Years', label: 'Panel Lifespan' },
              { stat: '13 Years', label: 'SR Experience' },
            ]}
            ctaText="Get Solar Quote →"
            ctaHref="/contact/"
          />

          {/* ── Battery ── */}
          <ProductCard
            expanded={expanded === 'battery'}
            onToggle={() => toggle('battery')}
            icon={<BatteryIcon />}
            name="Home Battery"
            teaser="Keep the lights on when the grid goes down"
            scene={<BatteryScene />}
            educationTitle="How Battery Backup Works"
            educationBody={
              <StepFlow steps={[
                { emoji: '⛈️', label: 'Storm hits' },
                { emoji: '🔌', label: 'Grid goes down' },
                { emoji: '🔋', label: 'Battery kicks in' },
                { emoji: '💡', label: 'Home stays on' },
              ]} />
            }
            stats={[
              { stat: '13.5 kWh', label: 'Storage Capacity' },
              { stat: 'Whole Home', label: 'Backup Power' },
              { stat: '24/7', label: 'SR Monitoring' },
            ]}
            ctaText="Get Battery Quote →"
            ctaHref="/contact/"
          />

          {/* ── EV ── */}
          <ProductCard
            expanded={expanded === 'ev'}
            onToggle={() => toggle('ev')}
            icon={<BoltIcon />}
            name="EV Charger"
            teaser="Charge your car on sunlight, not the grid"
            scene={<EvScene />}
            educationTitle="The Hidden Cost of EV Charging"
            educationBody={
              <p className="text-gray-400 text-sm leading-relaxed mt-1">
                A Level 2 charger adds $80–$150/month to your bill and can push you into a higher
                utility rate tier — making <em>all</em> your electricity more expensive. With solar,
                your car runs on sunlight.
              </p>
            }
            stats={[
              { stat: '$0', label: 'Fuel Cost With Solar' },
              { stat: 'Level 2', label: 'Charger Included' },
              { stat: '1 Day', label: 'Installation' },
            ]}
            ctaText="Get EV Quote →"
            ctaHref="/contact/"
          />

        </div>
      </div>
    </section>
  );
}
