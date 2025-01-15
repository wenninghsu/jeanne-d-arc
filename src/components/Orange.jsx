// Copyright (C) 2025 Potix Corporation. All Rights Reserved
// History: 01/15/2025
// Author: Wenning Hsu <wenninghsu@potix.com>

import React from 'react';

const Orange = () => (
  <svg viewBox="0 0 200 200" className="w-64 h-64">
    {/* Main orange circle */}
    <circle cx="100" cy="100" r="80" fill="#FF9F40"/>
    
    {/* Orange texture/segments */}
    <path d="M100 20 A80 80 0 0 1 180 100" stroke="#FF8C1A" strokeWidth="2" fill="none"/>
    <path d="M100 20 A80 80 0 0 0 20 100" stroke="#FF8C1A" strokeWidth="2" fill="none"/>
    <path d="M100 180 A80 80 0 0 0 180 100" stroke="#FF8C1A" strokeWidth="2" fill="none"/>
    <path d="M100 180 A80 80 0 0 1 20 100" stroke="#FF8C1A" strokeWidth="2" fill="none"/>
    
    {/* Vertical and horizontal segments */}
    <line x1="100" y1="20" x2="100" y2="180" stroke="#FF8C1A" strokeWidth="2"/>
    <line x1="20" y1="100" x2="180" y2="100" stroke="#FF8C1A" strokeWidth="2"/>
    
    {/* Leaf */}
    <path d="M95 25 Q100 15 105 25" stroke="#4CAF50" strokeWidth="3" fill="#4CAF50"/>
    <rect x="98" y="20" width="4" height="8" fill="#8B4513"/>
    
    {/* Highlight */}
    <circle cx="70" cy="70" r="15" fill="rgba(255,255,255,0.2)"/>
  </svg>
);

export default Orange;