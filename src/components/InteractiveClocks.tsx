import React, { useState } from 'react';

type Process = {
  id: number;
  scalar: number;
  vector: number[];
};

export function InteractiveClocks() {
  const numProcesses = 3;
  const [processes, setProcesses] = useState<Process[]>(
    Array.from({ length: numProcesses }).map((_, i) => ({
      id: i,
      scalar: 0,
      vector: Array(numProcesses).fill(0),
    }))
  );
  
  const [activeMessage, setActiveMessage] = useState<{from: number, to: number, scalar: number, vector: number[]} | null>(null);

  const handleInternalEvent = (pid: number) => {
    setProcesses(prev => prev.map(p => {
      if (p.id === pid) {
        const newVector = [...p.vector];
        newVector[pid] += 1;
        return { ...p, scalar: p.scalar + 1, vector: newVector };
      }
      return p;
    }));
  };

  const handleSendEvent = (pid: number, targetId: number) => {
    handleInternalEvent(pid);
    const sender = processes.find(p => p.id === pid);
    if (sender) {
      const newSenderVector = [...sender.vector];
      newSenderVector[pid] += 1;
      setActiveMessage({
        from: pid,
        to: targetId,
        scalar: sender.scalar + 1,
        vector: newSenderVector
      });
    }
  };

  const handleReceiveEvent = () => {
    if (!activeMessage) return;
    const { to, scalar: msgScalar, vector: msgVector } = activeMessage;
    
    setProcesses(prev => prev.map(p => {
      if (p.id === to) {
        const newVector = p.vector.map((v, i) => Math.max(v, msgVector[i]));
        newVector[to] += 1;
        return {
          ...p,
          scalar: Math.max(p.scalar, msgScalar) + 1,
          vector: newVector
        };
      }
      return p;
    }));
    setActiveMessage(null);
  };

  return (
    <div className="my-8 bg-white border-2 border-[#E0D8C3] rounded-3xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
         <h4 className="font-bold text-[#3D405B]">Interactive Logical Clocks Simulator</h4>
         <button onClick={() => setProcesses(Array.from({ length: numProcesses }).map((_, i) => ({id: i, scalar: 0, vector: Array(numProcesses).fill(0)})))} className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full font-bold">Reset</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        {processes.map((p) => (
          <div key={p.id} className="bg-[#F9F7F2] p-4 rounded-2xl border border-[#E9E4D9]">
            <h5 className="font-bold text-[#81B29A] mb-4 uppercase tracking-widest text-xs">Process {p.id}</h5>
            <div className="mb-4">
              <span className="text-xs text-gray-500 block mb-1">Scalar Clock (Lamport)</span>
              <div className="text-2xl font-mono text-[#3D405B] font-bold bg-white px-3 py-1 rounded inline-block shadow-sm">
                {p.scalar}
              </div>
            </div>
            <div className="mb-6">
              <span className="text-xs text-gray-500 block mb-1">Vector Clock</span>
              <div className="text-sm font-mono text-[#3D405B] bg-white px-3 py-1 rounded flex gap-2 shadow-sm whitespace-nowrap">
                <span>[</span>
                {p.vector.map((v, i) => (
                  <span key={i} className={i === p.id ? 'font-bold text-[#E07A5F]' : ''}>{v}{i < p.vector.length -1 ? ',' : ''}</span>
                ))}
                <span>]</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => handleInternalEvent(p.id)}
                disabled={activeMessage !== null}
                className="w-full text-xs font-bold bg-[#E0D8C3] hover:bg-gray-300 text-[#3D405B] py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                Internal Event
              </button>
              <div className="flex gap-2">
                 <button 
                  onClick={() => handleSendEvent(p.id, (p.id + 1) % numProcesses)}
                  disabled={activeMessage !== null}
                  className="flex-1 text-[10px] font-bold border border-[#81B29A] text-[#81B29A] hover:bg-[#81B29A] hover:text-white py-1.5 rounded-lg transition-colors disabled:opacity-50"
                 >
                   Send to P{(p.id + 1) % numProcesses}
                 </button>
                 <button 
                  onClick={() => handleSendEvent(p.id, (p.id + 2) % numProcesses)}
                  disabled={activeMessage !== null}
                  className="flex-1 text-[10px] font-bold border border-[#81B29A] text-[#81B29A] hover:bg-[#81B29A] hover:text-white py-1.5 rounded-lg transition-colors disabled:opacity-50"
                 >
                   Send to P{(p.id + 2) % numProcesses}
                 </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {activeMessage && (
        <div className="mt-6 p-4 bg-[#F2CC8F] bg-opacity-30 border border-[#F2CC8F] rounded-xl flex justify-between items-center animate-pulse">
           <div>
             <span className="font-bold text-[#3D405B] text-sm">Message in transit</span>
             <p className="text-xs text-gray-600">From P{activeMessage.from} to P{activeMessage.to}</p>
             <div className="font-mono text-xs mt-1 text-[#3D405B]">Scalar: {activeMessage.scalar} | Vector: [{activeMessage.vector.join(', ')}]</div>
           </div>
           <button 
             onClick={handleReceiveEvent}
             className="px-4 py-2 bg-[#3D405B] text-white rounded-xl text-sm font-bold hover:opacity-90 shadow-sm"
           >
             Receive on P{activeMessage.to}
           </button>
        </div>
      )}
    </div>
  );
}
