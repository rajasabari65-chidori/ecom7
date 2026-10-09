import React, { useState } from 'react';
import { PricePoint } from '../../types';

interface PriceChartProps {
  data: PricePoint[];
  currentPrice: number;
  height?: number;
}

export const PriceChart: React.FC<PriceChartProps> = ({
  data,
  currentPrice,
  height = 200,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="h-44 flex items-center justify-center text-xs text-slate-500 border border-slate-800 rounded-xl bg-slate-900/40">
        Insufficient historical price records
      </div>
    );
  }

  const prices = data.map((d) => d.price);
  const minPrice = Math.min(...prices, currentPrice);
  const maxPrice = Math.max(...prices, currentPrice);
  const range = maxPrice - minPrice || 1;
  const paddingY = 24;
  const paddingX = 40;
  const width = 600;
  const effectiveHeight = height - paddingY * 2;

  // Calculate coordinates
  const points = data.map((item, index) => {
    const x = paddingX + (index / (data.length - 1 || 1)) * (width - paddingX * 2);
    const normalizedY = (item.price - minPrice) / range;
    const y = height - paddingY - normalizedY * effectiveHeight;
    return { x, y, ...item };
  });

  const pathD = points.reduce((acc, point, index) => {
    return index === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  return (
    <div className="relative w-full overflow-hidden select-none">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="priceLineGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>

        {/* Horizontal grid guide lines */}
        <line
          x1={paddingX}
          y1={paddingY}
          x2={width - paddingX}
          y2={paddingY}
          stroke="#334155"
          strokeDasharray="3 3"
          strokeOpacity="0.5"
        />
        <text
          x={paddingX - 8}
          y={paddingY + 4}
          fill="#94a3b8"
          fontSize="10"
          textAnchor="end"
          className="font-mono"
        >
          ₹{maxPrice.toLocaleString('en-IN')}
        </text>

        <line
          x1={paddingX}
          y1={height - paddingY}
          x2={width - paddingX}
          y2={height - paddingY}
          stroke="#334155"
          strokeDasharray="3 3"
          strokeOpacity="0.5"
        />
        <text
          x={paddingX - 8}
          y={height - paddingY + 4}
          fill="#94a3b8"
          fontSize="10"
          textAnchor="end"
          className="font-mono"
        >
          ₹{minPrice.toLocaleString('en-IN')}
        </text>

        {/* Shaded Area */}
        <path d={areaD} fill="url(#priceLineGradient)" />

        {/* Trend Line */}
        <path
          d={pathD}
          fill="none"
          stroke="url(#strokeGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {points.map((pt, idx) => {
          const isHovered = hoveredIndex === idx;
          const isLowest = pt.price === minPrice;
          return (
            <g
              key={idx}
              className="cursor-pointer group"
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <circle
                cx={pt.x}
                cy={pt.y}
                r={isHovered ? 6 : isLowest ? 5 : 4}
                className={`transition-all ${
                  isLowest
                    ? 'fill-emerald-400 stroke-slate-950 stroke-2'
                    : 'fill-cyan-400 stroke-slate-900 stroke-2'
                }`}
              />
              {pt.event && (
                <text
                  x={pt.x}
                  y={pt.y - 10}
                  fill="#38bdf8"
                  fontSize="9"
                  textAnchor="middle"
                  className="font-sans font-medium"
                >
                  {pt.event}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Interactive Tooltip Card */}
      {hoveredIndex !== null && (
        <div
          className="absolute z-20 pointer-events-none bg-slate-900/95 border border-cyan-500/40 rounded-lg p-2.5 shadow-xl text-xs backdrop-blur-md transition-all -translate-x-1/2 -translate-y-12"
          style={{
            left: `${(points[hoveredIndex].x / width) * 100}%`,
            top: `${(points[hoveredIndex].y / height) * 100}%`,
          }}
        >
          <div className="text-slate-400 text-[10px]">{points[hoveredIndex].date}</div>
          <div className="font-bold text-cyan-300 font-mono text-sm">
            ₹{points[hoveredIndex].price.toLocaleString('en-IN')}
          </div>
          {points[hoveredIndex].event && (
            <div className="text-[10px] text-amber-300 font-medium mt-0.5">
              {points[hoveredIndex].event}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
