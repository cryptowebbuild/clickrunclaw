'use client';

import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Cpu, Microchip } from 'lucide-react';

export default function AgentMonitoring({ containerId }: { containerId: string }) {
  const [data, setData] = useState(() => 
    Array.from({ length: 20 }, (_, i) => ({
      time: i,
      cpu: Math.random() * 5 + 1, // CPU usage %
      memory: Math.random() * 50 + 150, // Memory usage MB
    }))
  );

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setData((prevData) => {
        const newData = [...prevData.slice(1)];
        const last = newData[newData.length - 1];
        
        let nextCpu = last.cpu + (Math.random() * 4 - 2);
        if (nextCpu < 0) nextCpu = 0.5;
        if (nextCpu > 100) nextCpu = 95;

        let nextMemory = last.memory + (Math.random() * 10 - 5);
        if (nextMemory < 100) nextMemory = 110;
        if (nextMemory > 1024) nextMemory = 1000;

        newData.push({
          time: last.time + 1,
          cpu: nextCpu,
          memory: nextMemory,
        });
        return newData;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const latestData = data[data.length - 1];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      {/* CPU Usage Card */}
      <div className="bg-[#050505] p-4 rounded-xl border border-zinc-800 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 text-zinc-400">
            <Cpu className="w-4 h-4" />
            <span className="text-sm font-medium">CPU Usage</span>
          </div>
          <span className="text-white font-mono text-sm">{latestData.cpu.toFixed(1)}%</span>
        </div>
        <div className="h-24 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Tooltip 
                contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px' }}
                itemStyle={{ color: '#e4e4e7', fontSize: '12px' }}
                labelStyle={{ display: 'none' }}
                formatter={(value: any) => [`${Number(value).toFixed(1)}%`, 'CPU']}
              />
              <Area 
                type="monotone" 
                dataKey="cpu" 
                stroke="#3b82f6" 
                fillOpacity={1} 
                fill="url(#colorCpu)" 
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Memory Usage Card */}
      <div className="bg-[#050505] p-4 rounded-xl border border-zinc-800 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 text-zinc-400">
            <Microchip className="w-4 h-4" />
            <span className="text-sm font-medium">Memory (RAM)</span>
          </div>
          <span className="text-white font-mono text-sm">{latestData.memory.toFixed(0)} MB</span>
        </div>
        <div className="h-24 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorMem" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Tooltip 
                contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px' }}
                itemStyle={{ color: '#e4e4e7', fontSize: '12px' }}
                labelStyle={{ display: 'none' }}
                formatter={(value: any) => [`${Number(value).toFixed(0)} MB`, 'Memory']}
              />
              <Area 
                type="monotone" 
                dataKey="memory" 
                stroke="#8b5cf6" 
                fillOpacity={1} 
                fill="url(#colorMem)" 
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
