import { Icon } from './icon';
import React from 'react';

interface CardHeadProps {
  title: string;
  action?: string;
  onAction?: () => void;
  right?: React.ReactNode;
}

export function CardHead({ title, action, onAction, right }: CardHeadProps) {
  return (
    <div className="row between" style={{ marginBottom: 18 }}>
      <h3 className="h3">{title}</h3>
      {right}
      {action && (
        <a className="link row gap8" style={{ fontSize: 13, cursor: 'pointer' }} onClick={onAction}>
          {action}<Icon name="arrowR" size={15} />
        </a>
      )}
    </div>
  );
}
