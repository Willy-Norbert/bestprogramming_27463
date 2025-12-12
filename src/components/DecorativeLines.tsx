import React from 'react';

export const DecorativeLines: React.FC = () => {
  return (
    <>
      <style>{`
        @keyframes lineMove1 {
          0% { transform: translateX(0) translateY(0); }
          50% { transform: translateX(20px) translateY(-10px); }
          100% { transform: translateX(0) translateY(0); }
        }
        @keyframes lineMove2 {
          0% { transform: translateX(0) translateY(0); }
          50% { transform: translateX(-15px) translateY(15px); }
          100% { transform: translateX(0) translateY(0); }
        }
        @keyframes lineMove3 {
          0% { transform: translateX(0) translateY(0); }
          50% { transform: translateX(10px) translateY(-5px); }
          100% { transform: translateX(0) translateY(0); }
        }
        @keyframes lineMove4 {
          0% { transform: translateX(0) translateY(0); }
          50% { transform: translateX(-20px) translateY(10px); }
          100% { transform: translateX(0) translateY(0); }
        }
        @keyframes gradientShift {
          0% { stop-opacity: 0.2; }
          50% { stop-opacity: 0.4; }
          100% { stop-opacity: 0.2; }
        }
        .animated-line-1 {
          animation: lineMove1 8s ease-in-out infinite;
        }
        .animated-line-2 {
          animation: lineMove2 10s ease-in-out infinite;
        }
        .animated-line-3 {
          animation: lineMove3 12s ease-in-out infinite;
        }
        .animated-line-4 {
          animation: lineMove4 9s ease-in-out infinite;
        }
      `}</style>
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <svg
          className="w-full h-full"
          viewBox="0 0 1920 1080"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(210, 55%, 22%)" stopOpacity="0.3">
                <animate attributeName="stop-opacity" values="0.3;0.5;0.3" dur="4s" repeatCount="indefinite" />
              </stop>
              <stop offset="50%" stopColor="hsl(33, 100%, 50%)" stopOpacity="0.25">
                <animate attributeName="stop-opacity" values="0.25;0.4;0.25" dur="4s" repeatCount="indefinite" />
              </stop>
              <stop offset="100%" stopColor="hsl(210, 55%, 22%)" stopOpacity="0.3">
                <animate attributeName="stop-opacity" values="0.3;0.5;0.3" dur="4s" repeatCount="indefinite" />
              </stop>
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(33, 100%, 50%)" stopOpacity="0.3">
                <animate attributeName="stop-opacity" values="0.3;0.45;0.3" dur="5s" repeatCount="indefinite" />
              </stop>
              <stop offset="50%" stopColor="hsl(210, 55%, 22%)" stopOpacity="0.25">
                <animate attributeName="stop-opacity" values="0.25;0.4;0.25" dur="5s" repeatCount="indefinite" />
              </stop>
              <stop offset="100%" stopColor="hsl(33, 100%, 50%)" stopOpacity="0.3">
                <animate attributeName="stop-opacity" values="0.3;0.45;0.3" dur="5s" repeatCount="indefinite" />
              </stop>
            </linearGradient>
          </defs>

          {/* Flowing curved line from top-left to bottom-right */}
          <path
            d="M-100,200 Q400,400 800,600 T1600,800 L2000,900"
            stroke="url(#gradient1)"
            strokeWidth="6"
            fill="none"
            className="animated-line-1"
          />

          {/* Swooping line from top-right to bottom-left */}
          <path
            d="M2020,150 Q1500,350 1000,500 T-100,700"
            stroke="url(#gradient2)"
            strokeWidth="5"
            fill="none"
            className="animated-line-2"
          />

          {/* Diagonal accent line */}
          <path
            d="M0,400 L1920,600"
            stroke="hsl(33, 100%, 50%)"
            strokeWidth="4"
            strokeOpacity="0.2"
            fill="none"
            className="animated-line-3"
          />

          {/* Curved line in the middle */}
          <path
            d="M-50,500 Q500,400 1000,450 T1950,500"
            stroke="hsl(210, 55%, 22%)"
            strokeWidth="5"
            strokeOpacity="0.25"
            fill="none"
            className="animated-line-4"
          />

          {/* Flowing wave line */}
          <path
            d="M-100,300 Q300,250 700,300 T1500,350 T2300,400"
            stroke="url(#gradient1)"
            strokeWidth="4"
            fill="none"
            className="animated-line-1"
            style={{ animationDelay: '1s' }}
          />

          {/* Bottom flowing line */}
          <path
            d="M-100,900 Q400,850 900,900 T1900,950 L2100,1000"
            stroke="url(#gradient2)"
            strokeWidth="5"
            fill="none"
            className="animated-line-2"
            style={{ animationDelay: '0.5s' }}
          />

          {/* Vertical accent lines */}
          <line
            x1="300"
            y1="0"
            x2="350"
            y2="1080"
            stroke="hsl(33, 100%, 50%)"
            strokeWidth="3"
            strokeOpacity="0.15"
            className="animated-line-3"
          />
          <line
            x1="1200"
            y1="0"
            x2="1250"
            y2="1080"
            stroke="hsl(210, 55%, 22%)"
            strokeWidth="3"
            strokeOpacity="0.15"
            className="animated-line-4"
          />

          {/* Decorative circles/dots along the lines */}
          <circle cx="400" cy="400" r="6" fill="hsl(33, 100%, 50%)" opacity="0.4">
            <animate attributeName="opacity" values="0.4;0.6;0.4" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="800" cy="600" r="5" fill="hsl(210, 55%, 22%)" opacity="0.4">
            <animate attributeName="opacity" values="0.4;0.6;0.4" dur="3.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="1200" cy="500" r="6" fill="hsl(33, 100%, 50%)" opacity="0.4">
            <animate attributeName="opacity" values="0.4;0.6;0.4" dur="4s" repeatCount="indefinite" />
          </circle>
          <circle cx="1500" cy="700" r="5" fill="hsl(210, 55%, 22%)" opacity="0.4">
            <animate attributeName="opacity" values="0.4;0.6;0.4" dur="3.2s" repeatCount="indefinite" />
          </circle>
          <circle cx="600" cy="800" r="6" fill="hsl(33, 100%, 50%)" opacity="0.4">
            <animate attributeName="opacity" values="0.4;0.6;0.4" dur="3.8s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>
    </>
  );
};

