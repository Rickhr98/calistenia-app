interface StickFigureProps {
  className?: string;
}

export function StickFigure({ className = '' }: StickFigureProps) {
  return (
    <svg
      viewBox="0 0 120 200"
      className={`h-40 w-auto ${className}`}
      data-testid="stick-figure"
    >
      {/* Head */}
      <circle cx="60" cy="20" r="8" fill="#1a1a1a" />

      {/* Torso */}
      <g className="torso" style={{ transformOrigin: '60px 35px' }}>
        <line x1="60" y1="28" x2="60" y2="60" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* Left Shoulder & Arm */}
      <g className="shoulder-l" style={{ transformOrigin: '60px 35px' }}>
        <line x1="60" y1="35" x2="35" y2="45" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" />
      </g>
      <g className="elbow-l" style={{ transformOrigin: '35px 45px' }}>
        <line x1="35" y1="45" x2="20" y2="70" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* Right Shoulder & Arm */}
      <g className="shoulder-r" style={{ transformOrigin: '60px 35px' }}>
        <line x1="60" y1="35" x2="85" y2="45" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" />
      </g>
      <g className="elbow-r" style={{ transformOrigin: '85px 45px' }}>
        <line x1="85" y1="45" x2="100" y2="70" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* Left Hip & Leg */}
      <g className="hip-l" style={{ transformOrigin: '55px 60px' }}>
        <line x1="55" y1="60" x2="45" y2="90" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" />
      </g>
      <g className="knee-l" style={{ transformOrigin: '45px 90px' }}>
        <line x1="45" y1="90" x2="42" y2="130" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* Right Hip & Leg */}
      <g className="hip-r" style={{ transformOrigin: '65px 60px' }}>
        <line x1="65" y1="60" x2="75" y2="90" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" />
      </g>
      <g className="knee-r" style={{ transformOrigin: '75px 90px' }}>
        <line x1="75" y1="90" x2="78" y2="130" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" />
      </g>
    </svg>
  );
}
