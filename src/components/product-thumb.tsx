const GLYPHS: Record<string, string> = {
  board:   'M3 6h18v12H3zM7 6v12M3 10h4M3 14h4M11 9h6v6h-6z',
  sensor:  'M12 3v4M12 17v4M3 12h4M17 12h4M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8',
  module:  'M5 4h14v16H5zM9 4v16M9 8h6M9 12h6M9 16h6',
  power:   'M7 3h10l-1 7h3l-9 11 2-8H6z',
  battery: 'M4 8h14v8H4zM18 11h2v2h-2M7 11v2M10 11v2M13 11v2',
  chip:    'M7 7h10v10H7zM3 9v6M3 9h4M3 15h4M21 9v6M17 9h4M17 15h4M9 3h6M9 3v4M15 3v4M9 21h6M9 17v4M15 17v4',
  tool:    'M14.7 6.3a4 4 0 0 0-5 5L3 18l3 3 6.7-6.7a4 4 0 0 0 5-5l-2.5 2.5-2.8-.7-.7-2.8z',
};

interface ProductThumbProps {
  glyph?: string;
  size?: number;
  tag?: string;
  radius?: number;
  fill?: boolean;
}

export function ProductThumb({ glyph = 'chip', size = 56, tag, radius = 10, fill = false }: ProductThumbProps) {
  const d = GLYPHS[glyph] || GLYPHS.chip;
  const gs = fill ? 46 : size * 0.42;
  const dim = fill ? '100%' : size;
  return (
    <div className="pthumb" style={{ width: dim, height: dim, borderRadius: radius }}>
      <svg
        className="glyph"
        width={gs} height={gs}
        viewBox="0 0 24 24" fill="none"
        stroke="#475569" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round"
      >
        {d.split('M').filter(Boolean).map((s, i) => (
          <path key={i} d={'M' + s} />
        ))}
      </svg>
      {tag && <div className="ptag">{tag}</div>}
    </div>
  );
}
