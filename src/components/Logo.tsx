
import React from 'react';

const Logo = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        {/* Abstract textile pattern logo */}
        <div className="w-10 h-10 bg-gradient-to-br from-primary via-teal-600 to-primary rounded-lg flex items-center justify-center shadow-sm">
          <div className="grid grid-cols-2 gap-0.5 w-6 h-6">
            <div className="bg-white/80 rounded-sm"></div>
            <div className="bg-white/60 rounded-sm"></div>
            <div className="bg-white/60 rounded-sm"></div>
            <div className="bg-white/80 rounded-sm"></div>
          </div>
        </div>
      </div>
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Artifact Atlas</h1>
        <p className="text-sm text-muted-foreground">Museo AMANO Digital Research</p>
      </div>
    </div>
  );
};

export default Logo;
