import React from 'react';

interface PageHeadProps {
  title: string;
  sub?: string;
  actions?: React.ReactNode;
}

export function PageHead({ title, sub, actions }: PageHeadProps) {
  return (
    <div className="row between" style={{ marginBottom: 22, flexWrap: 'wrap', gap: 14 }}>
      <div>
        <h1 className="h1" style={{ fontSize: 26 }}>{title}</h1>
        {sub && <div className="sub" style={{ marginTop: 5, fontSize: 14.5 }}>{sub}</div>}
      </div>
      <div className="row gap12">{actions}</div>
    </div>
  );
}
