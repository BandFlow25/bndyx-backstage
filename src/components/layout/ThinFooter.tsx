"use client";

import React from 'react';
import { ThinFooter as BndyThinFooter } from 'bndy-ui';

const ThinFooter: React.FC = () => {
  return (
    <div className="sticky bottom-0 w-full z-40 bg-white dark:bg-slate-900">
      {/* Override the ThinFooter's background to be transparent */}
      <style jsx global>{`
        .bndy-thin-footer {
          background-color: transparent !important;
        }
      `}</style>
      
      <div className="bndy-thin-footer">
        <BndyThinFooter 
          badgePath="/assets/images/BndyBeatBadge.png"
          aboutUrl="/about"
        />
      </div>
    </div>
  );
};

export default ThinFooter;
