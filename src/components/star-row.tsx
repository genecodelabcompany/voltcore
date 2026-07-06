import { Icon } from './icon';

interface StarRowProps {
  rating: number;
  size?: number;
}

export function StarRow({ rating, size = 14 }: StarRowProps) {
  return (
    <span className="row" style={{ gap: 1, color: '#F59E0B' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Icon
          key={i} name="star" size={size}
          fill={i <= Math.round(rating) ? '#F59E0B' : 'none'}
          color={i <= Math.round(rating) ? '#F59E0B' : '#CBD5E1'}
          sw={1.5}
        />
      ))}
    </span>
  );
}
