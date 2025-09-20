'use client'

import React, { FC } from "react";

const GridBackground: FC = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-slate-950">
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 255, 255, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 255, 255, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '2.5rem 2.5rem',
          maskImage: 'radial-gradient(ellipse at center, white 0%, transparent 70%)',
        }}
      />
      <div 
        className="absolute inset-0 bg-center bg-no-repeat"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(0, 255, 255, 0.1) 0%, transparent 50%)',
        }}
      />
    </div>
  );
};

export default GridBackground;