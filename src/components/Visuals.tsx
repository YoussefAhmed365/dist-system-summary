import React from 'react';

export function VisualBlock({ id }: { id: string }) {
  switch (id) {
    case 'grid-architecture':
      return (
        <div className="flex flex-col items-center gap-4 my-6 py-8 bg-[#F9F7F2] rounded-3xl border border-[#E9E4D9]">
          <div className="px-6 py-2 bg-white border-2 border-[#81B29A] rounded text-[#3D405B] font-bold text-sm text-center w-48 shadow-sm">Applications</div>
          <div className="h-4 w-0.5 bg-[#3D405B] relative">
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#3D405B] rotate-45"></div>
          </div>
          <div className="px-6 py-2 bg-white border-2 border-[#81B29A] rounded text-[#3D405B] font-bold text-sm text-center w-48 shadow-sm">Collective layer</div>
          <div className="flex gap-16">
             <div className="flex flex-col items-center">
               <div className="h-4 w-0.5 bg-[#3D405B] relative">
                 <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#3D405B] rotate-45"></div>
               </div>
               <div className="px-4 py-2 bg-white border-2 border-[#81B29A] rounded text-[#3D405B] font-bold text-sm text-center w-36 shadow-sm">Connectivity layer</div>
             </div>
             <div className="flex flex-col items-center">
               <div className="h-4 w-0.5 bg-[#3D405B] relative">
                 <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#3D405B] rotate-45"></div>
               </div>
               <div className="px-4 py-2 bg-white border-2 border-[#81B29A] rounded text-[#3D405B] font-bold text-sm text-center w-36 shadow-sm">Resource layer</div>
             </div>
          </div>
          <div className="h-4 w-1/2 border-b-2 border-l-2 border-r-2 border-t-0 rounded-b-lg border-[#3D405B] relative mt-2">
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-[#3D405B]"></div>
          </div>
          <div className="px-6 py-2 mt-4 bg-white border-2 border-[#81B29A] rounded text-[#3D405B] font-bold text-sm text-center w-48 shadow-sm relative">
             Fabric layer
            <div className="absolute -right-6 -bottom-3 text-[#3D405B]">⚙️</div>
          </div>
        </div>
      );
    case 'pub-sub':
      return (
        <div className="my-6 w-full overflow-hidden bg-[#FDF6E3] p-4 sm:p-8 rounded-3xl border border-[#E9E4D9]">
          <svg viewBox="0 0 800 300" className="w-full h-auto max-h-[300px] font-sans" fill="none" stroke="#2D2D2D" strokeWidth="2">
            {/* Left Diagram */}
            {/* Components */}
            <rect x="50" y="20" width="120" height="40" fill="transparent" />
            <text x="110" y="45" textAnchor="middle" stroke="none" fill="#2D2D2D" fontSize="16">Component</text>
            
            <rect x="230" y="20" width="120" height="40" fill="transparent" />
            <text x="290" y="45" textAnchor="middle" stroke="none" fill="#2D2D2D" fontSize="16">Component</text>
            
            <rect x="150" y="220" width="120" height="40" fill="transparent" />
            <text x="210" y="245" textAnchor="middle" stroke="none" fill="#2D2D2D" fontSize="16">Component</text>

            {/* Event bus */}
            <polygon points="10,140 40,120 40,130 380,130 380,120 410,140 380,160 380,150 40,150 40,160" fill="transparent" />
            <text x="210" y="145" textAnchor="middle" stroke="none" fill="#2D2D2D" fontSize="16">Event bus</text>

            {/* Arrows */}
            <line x1="80" y1="60" x2="80" y2="130" strokeDasharray="5,5" />
            <polygon points="80,130 75,120 85,120" fill="#2D2D2D" stroke="none" />
            <text x="75" y="90" textAnchor="end" stroke="none" fill="#2D2D2D" fontSize="16">Subscribe</text>

            <line x1="120" y1="130" x2="120" y2="60" />
            <polygon points="120,60 115,70 125,70" fill="#2D2D2D" stroke="none" />

            <line x1="260" y1="60" x2="260" y2="130" strokeDasharray="5,5" />
            <polygon points="260,130 255,120 265,120" fill="#2D2D2D" stroke="none" />

            <line x1="300" y1="130" x2="300" y2="60" />
            <polygon points="300,60 295,70 305,70" fill="#2D2D2D" stroke="none" />
            <text x="310" y="75" textAnchor="start" stroke="none" fill="#2D2D2D" fontSize="16">Notification</text>
            <text x="310" y="95" textAnchor="start" stroke="none" fill="#2D2D2D" fontSize="16">delivery</text>

            <line x1="210" y1="220" x2="210" y2="150" />
            <polygon points="210,150 205,160 215,160" fill="#2D2D2D" stroke="none" />
            <text x="220" y="195" textAnchor="start" stroke="none" fill="#2D2D2D" fontSize="16">Publish</text>

            {/* Right Diagram */}
            {/* Components */}
            <rect x="450" y="20" width="120" height="40" fill="transparent" />
            <text x="510" y="45" textAnchor="middle" stroke="none" fill="#2D2D2D" fontSize="16">Component</text>
            
            <rect x="650" y="20" width="120" height="40" fill="transparent" />
            <text x="710" y="45" textAnchor="middle" stroke="none" fill="#2D2D2D" fontSize="16">Component</text>

            {/* Event bus */}
            <polygon points="410,140 440,120 440,130 760,130 760,120 790,140 760,160 760,150 440,150 440,160" fill="transparent" />

            {/* Data space */}
            <ellipse cx="610" cy="210" rx="90" ry="15" fill="white" />
            <path d="M520,210 L520,250 A90,15 0 0,0 700,250 L700,210" fill="#BFC0C4" stroke="#2D2D2D" />
            <text x="610" y="290" textAnchor="middle" stroke="none" fill="#2D2D2D" fontSize="18">Shared (persistent) data space</text>

            {/* Arrows */}
            {/* Publish arrow: from top-left component to bus, then to cylinder */}
            <polyline points="480,60 480,145 560,145 560,210" />
            <polygon points="560,210 555,200 565,200" fill="#2D2D2D" stroke="none" />
            <text x="470" y="100" textAnchor="end" stroke="none" fill="#2D2D2D" fontSize="16">Publish</text>

            {/* Subscribe arrow: from cylinder to top-right component */}
            <polyline points="720,60 720,135" strokeDasharray="5,5" />
            <polyline points="720,135 630,135 630,210" strokeDasharray="5,5" />
            <polygon points="630,210 625,200 635,200" fill="#2D2D2D" stroke="none" />
            <text x="640" y="100" textAnchor="end" stroke="none" fill="#2D2D2D" fontSize="16">Subscribe</text>

            {/* Data delivery arrow: from cylinder to top-right component */}
            <polyline points="670,210 670,145 740,145 740,60" />
            <polygon points="740,60 735,70 745,70" fill="#2D2D2D" stroke="none" />
            <text x="750" y="90" textAnchor="start" stroke="none" fill="#2D2D2D" fontSize="16">Data</text>
            <text x="750" y="110" textAnchor="start" stroke="none" fill="#2D2D2D" fontSize="16">delivery</text>
          </svg>
        </div>
      );
    case 'wrapper':
      return (
        <div className="my-6 grid grid-cols-2 gap-4 bg-[#F9F7F2] p-6 rounded-3xl border border-[#E9E4D9]">
           <div className="flex flex-col items-center gap-4">
              <span className="font-bold text-[#3D405B]">Wrapper</span>
              <div className="relative w-32 h-32">
                <div className="absolute top-0 left-0 w-8 h-8 rounded-full border-4 border-[#3D405B] bg-white"></div>
                <div className="absolute top-0 right-0 w-8 h-8 rounded-full border-4 border-[#3D405B] bg-white"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 rounded-full border-4 border-[#3D405B] bg-white"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full border-4 border-[#3D405B] bg-white"></div>
                <svg className="absolute inset-0 w-full h-full text-[#3D405B]" style={{zIndex: 0}}>
                  <line x1="16" y1="16" x2="112" y2="16" stroke="currentColor" strokeWidth="2" />
                  <line x1="16" y1="16" x2="16" y2="112" stroke="currentColor" strokeWidth="2" />
                  <line x1="16" y1="16" x2="112" y2="112" stroke="currentColor" strokeWidth="2" />
                  <line x1="112" y1="16" x2="16" y2="112" stroke="currentColor" strokeWidth="2" />
                  <line x1="112" y1="112" x2="16" y2="112" stroke="currentColor" strokeWidth="2" />
                  <line x1="112" y1="112" x2="112" y2="16" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
           </div>
           <div className="flex flex-col items-center gap-4">
              <span className="font-bold text-[#3D405B]">Broker</span>
              <div className="relative w-32 h-32 mt-4">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gray-300 border-4 border-[#3D405B] z-10 flex items-center justify-center text-xs font-bold">B</div>
                <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full border-4 border-[#3D405B] bg-white"></div>
                <div className="absolute w-8 h-8 rounded-full border-4 border-[#3D405B] bg-white top-0 right-0"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 rounded-full border-4 border-[#3D405B] bg-white"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full border-4 border-[#3D405B] bg-white"></div>
                <svg className="absolute -inset-4 w-[calc(100%+2rem)] h-[calc(100%+2rem)] text-[#3D405B]" style={{zIndex: 0}}>
                   <line x1="16" y1="16" x2="80" y2="80" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" />
                   <line x1="144" y1="32" x2="80" y2="80" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" />
                   <line x1="32" y1="144" x2="80" y2="80" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" />
                   <line x1="144" y1="144" x2="80" y2="80" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" />
                </svg>
              </div>
           </div>
        </div>
      );
    case 'cuts':
      return (
        <div className="my-6 p-6 bg-white rounded-3xl border border-[#E9E4D9] flex flex-col gap-8 shadow-sm overflow-hidden text-[#3D405B] font-mono text-sm">
          <div className="relative h-24">
            <h4 className="absolute top-0 text-xs text-green-600 font-bold mb-2">Consistent cut C1</h4>
            <div className="absolute left-10 mt-6 right-0 h-0.5 bg-gray-300"></div>
            <span className="absolute left-2 mt-4 font-bold">P1</span>
            
            <div className="absolute left-10 mt-16 right-0 h-0.5 bg-gray-300"></div>
            <span className="absolute left-2 mt-14 font-bold">P2</span>

            <div className="absolute left-1/3 top-6 w-3 h-3 rounded-full bg-blue-500"></div>
            <div className="absolute left-1/2 top-16 w-3 h-3 rounded-full bg-blue-500"></div>
            
            <svg className="absolute inset-0 w-full h-full">
               <line x1="33%" y1="24" x2="50%" y2="64" stroke="currentColor" strokeWidth="1" markerEnd="url(#arrow)" />
               <path d="M 40% 10 Q 45% 50, 40% 90" fill="none" stroke="#81B29A" strokeWidth="2" />
            </svg>
          </div>
          <div className="relative h-24">
            <h4 className="absolute top-0 text-xs text-red-500 font-bold mb-2">Inconsistent cut C2</h4>
            <div className="absolute left-10 mt-6 right-0 h-0.5 bg-gray-300"></div>
            <span className="absolute left-2 mt-4 font-bold">P1</span>
            
            <div className="absolute left-10 mt-16 right-0 h-0.5 bg-gray-300"></div>
            <span className="absolute left-2 mt-14 font-bold">P2</span>

            <div className="absolute left-1/2 top-6 w-3 h-3 rounded-full bg-blue-500"></div>
            <div className="absolute left-1/3 top-16 w-3 h-3 rounded-full bg-blue-500"></div>
            
            <svg className="absolute inset-0 w-full h-full">
               <line x1="50%" y1="24" x2="33%" y2="64" stroke="currentColor" strokeWidth="1" markerEnd="url(#arrow)" />
               <path d="M 40% 10 Q 45% 50, 40% 90" fill="none" stroke="#F2CC8F" strokeWidth="2" />
            </svg>
          </div>
        </div>
      );
    case 'endian':
      return (
        <div className="my-6 grid md:grid-cols-2 gap-4 text-[#3D405B]">
          <div className="border border-[#E0D8C3] bg-white rounded-2xl overflow-hidden shadow-sm">
            <h4 className="bg-[#81B29A] text-white font-bold p-3 text-center text-sm">Big Endian</h4>
            <div className="p-4 bg-[#F9F7F2] font-mono text-xs flex gap-1 justify-center">
              <div className="flex flex-col items-center"><span className="text-[10px] text-gray-500 mb-1">0x100</span><div className="px-3 py-1 bg-[#3D405B] text-white rounded shadow-sm">0x12</div></div>
              <div className="flex flex-col items-center"><span className="text-[10px] text-gray-500 mb-1">0x101</span><div className="px-3 py-1 bg-blue-600 text-white rounded shadow-sm">0x34</div></div>
              <div className="flex flex-col items-center"><span className="text-[10px] text-gray-500 mb-1">0x102</span><div className="px-3 py-1 bg-blue-500 text-white rounded shadow-sm">0x56</div></div>
              <div className="flex flex-col items-center"><span className="text-[10px] text-gray-500 mb-1">0x103</span><div className="px-3 py-1 bg-blue-400 text-white rounded shadow-sm">0x78</div></div>
            </div>
          </div>
          <div className="border border-[#E0D8C3] bg-white rounded-2xl overflow-hidden shadow-sm">
            <h4 className="bg-[#F2CC8F] text-[#3D405B] font-bold p-3 text-center text-sm">Little Endian</h4>
            <div className="p-4 bg-[#F9F7F2] font-mono text-xs flex gap-1 justify-center">
              <div className="flex flex-col items-center"><span className="text-[10px] text-gray-500 mb-1">0x100</span><div className="px-3 py-1 bg-amber-700 text-white rounded shadow-sm">0x78</div></div>
              <div className="flex flex-col items-center"><span className="text-[10px] text-gray-500 mb-1">0x101</span><div className="px-3 py-1 bg-orange-600 text-white rounded shadow-sm">0x56</div></div>
              <div className="flex flex-col items-center"><span className="text-[10px] text-gray-500 mb-1">0x102</span><div className="px-3 py-1 bg-orange-500 text-white rounded shadow-sm">0x34</div></div>
              <div className="flex flex-col items-center"><span className="text-[10px] text-gray-500 mb-1">0x103</span><div className="px-3 py-1 bg-orange-400 text-white rounded shadow-sm">0x12</div></div>
            </div>
          </div>
        </div>
      );
    default:
      return null;
  }
}
