import React, { useState, useEffect } from 'react';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, Area, ComposedChart, Line } from 'recharts';

// pi_data.json URL (GitHub raw)
const DATA_URL = 'https://raw.githubusercontent.com/Junwon03/pi-calculator-junwon2/main/output/pi_data.json';

const StatusBadge = ({ status }) => {
  const config = {
    STABLE: { color: '#00d4aa', bg: 'rgba(0, 212, 170, 0.15)' },
    ELEVATED: { color: '#4a9eff', bg: 'rgba(74, 158, 255, 0.15)' },
    CAUTION: { color: '#ffaa00', bg: 'rgba(255, 170, 0, 0.15)' },
    CRITICAL: { color: '#ff4757', bg: 'rgba(255, 71, 87, 0.15)' }
  };
  const { color, bg } = config[status] || config.STABLE;
  
  return (
    <span className="px-2.5 py-1 rounded-md text-xs font-semibold" style={{ backgroundColor: bg, color }}>
      {status}
    </span>
  );
};

const ZoneChart = ({ data, timeRange }) => {
  const getFilteredData = () => {
    const len = data.dates.length;
    let sliceStart = 0;
    
    switch(timeRange) {
      case '1D': sliceStart = len - 2; break;
      case '1W': sliceStart = len - 7; break;
      case '1M': sliceStart = len - 30; break;
      case '1Y': sliceStart = len - 365; break;
      case 'MAX': sliceStart = 0; break;
      default: sliceStart = len - 30;
    }
    
    sliceStart = Math.max(0, sliceStart);
    
    return data.dates.slice(sliceStart).map((date, i) => ({
      date: date,
      dateLabel: date.slice(5),
      pi: data.pi[sliceStart + i],
      price: data.price[sliceStart + i]
    }));
  };
  
  const filteredData = getFilteredData();
  const minPrice = Math.min(...filteredData.map(d => d.price));
  const maxPrice = Math.max(...filteredData.map(d => d.price));
  const latest = filteredData[filteredData.length - 1] || {};

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const piValue = payload.find(p => p.dataKey === 'pi')?.value;
      const priceValue = payload.find(p => p.dataKey === 'price')?.value;
      const dateValue = payload[0]?.payload?.date;
      
      return (
        <div className="rounded-lg p-3 text-xs shadow-xl" style={{ backgroundColor: '#0a0a0f', border: '1px solid #333' }}>
          <div className="text-gray-400 mb-2 font-mono text-xs">{dateValue}</div>
          <div className="flex items-center justify-between gap-4 mb-1">
            <span className="text-gray-400">Π Index</span>
            <span className="font-mono font-bold text-yellow-400">{piValue?.toFixed(3)}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-gray-400">Price</span>
            <span className="font-mono font-bold text-white">
              ${priceValue >= 1000 ? Math.round(priceValue).toLocaleString() : priceValue?.toFixed(2)}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-2 mb-3 text-center">
        <div className="bg-black/30 rounded-lg py-2 px-3">
          <div className="text-gray-500 text-xs mb-0.5">Date</div>
          <div className="text-white font-mono text-sm">{latest.date}</div>
        </div>
        <div className="bg-black/30 rounded-lg py-2 px-3">
          <div className="text-gray-500 text-xs mb-0.5">Price</div>
          <div className="text-white font-mono text-sm">
            ${latest.price >= 1000 ? Math.round(latest.price).toLocaleString() : latest.price?.toFixed(2)}
          </div>
        </div>
        <div className="bg-black/30 rounded-lg py-2 px-3">
          <div className="text-gray-500 text-xs mb-0.5">Π Index</div>
          <div className="text-yellow-400 font-mono text-sm font-bold">{latest.pi?.toFixed(3)}</div>
        </div>
      </div>

      <div className="h-48 w-full rounded-xl overflow-hidden" style={{ backgroundColor: '#0d1117' }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={filteredData} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
            <defs>
              <linearGradient id="criticalZone" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff4757" stopOpacity={0.5}/>
                <stop offset="100%" stopColor="#ff4757" stopOpacity={0.3}/>
              </linearGradient>
              <linearGradient id="cautionZone" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffaa00" stopOpacity={0.4}/>
                <stop offset="100%" stopColor="#ffaa00" stopOpacity={0.2}/>
              </linearGradient>
              <linearGradient id="elevatedZone" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4a9eff" stopOpacity={0.3}/>
                <stop offset="100%" stopColor="#4a9eff" stopOpacity={0.15}/>
              </linearGradient>
              <linearGradient id="stableZone" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00d4aa" stopOpacity={0.25}/>
                <stop offset="100%" stopColor="#00d4aa" stopOpacity={0.35}/>
              </linearGradient>
            </defs>
            
            <XAxis 
              dataKey="dateLabel" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#444', fontSize: 9 }}
              interval={timeRange === '1W' ? 0 : timeRange === '1M' ? 6 : Math.floor(filteredData.length / 5)}
            />
            
            <YAxis 
              yAxisId="pi"
              domain={[0, 1]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#444', fontSize: 9 }}
              tickFormatter={(v) => v.toFixed(1)}
              ticks={[0, 0.45, 0.60, 0.80, 1.0]}
            />
            
            <YAxis 
              yAxisId="price"
              orientation="right"
              domain={[minPrice * 0.9, maxPrice * 1.1]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#444', fontSize: 9 }}
              tickFormatter={(v) => v >= 1000 ? `${Math.round(v/1000)}K` : Math.round(v)}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            <Area yAxisId="pi" type="monotone" dataKey={() => 1.0} stroke="none" fill="url(#criticalZone)" baseValue={0.80} />
            <Area yAxisId="pi" type="monotone" dataKey={() => 0.80} stroke="none" fill="url(#cautionZone)" baseValue={0.60} />
            <Area yAxisId="pi" type="monotone" dataKey={() => 0.60} stroke="none" fill="url(#elevatedZone)" baseValue={0.45} />
            <Area yAxisId="pi" type="monotone" dataKey={() => 0.45} stroke="none" fill="url(#stableZone)" baseValue={0} />
            
            <Line yAxisId="pi" type="monotone" dataKey={() => 0.45} stroke="#00d4aa" strokeWidth={1} strokeDasharray="3 3" dot={false} />
            <Line yAxisId="pi" type="monotone" dataKey={() => 0.60} stroke="#4a9eff" strokeWidth={1} strokeDasharray="3 3" dot={false} />
            <Line yAxisId="pi" type="monotone" dataKey={() => 0.80} stroke="#ffaa00" strokeWidth={1} strokeDasharray="3 3" dot={false} />
            
            <Line yAxisId="price" type="monotone" dataKey="price" stroke="#555" strokeWidth={1.5} dot={false} />
            <Line yAxisId="pi" type="monotone" dataKey="pi" stroke="#f5a623" strokeWidth={2.5} dot={false} activeDot={{ r: 4, fill: '#f5a623' }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex gap-4 mt-2 px-1 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-0.5 rounded bg-yellow-500"></span>
          Π Index
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-0.5 rounded bg-gray-500"></span>
          Price
        </span>
      </div>
    </div>
  );
};

const AssetCard = ({ assetKey, data }) => {
  const [timeRange, setTimeRange] = useState('1M');
  
  const names = {
    SPY: { name: "S&P 500", ticker: "SPY" },
    QQQ: { name: "NASDAQ 100", ticker: "QQQ" },
    BTC: { name: "Bitcoin", ticker: "BTC-USD" },
    ETH: { name: "Ethereum", ticker: "ETH-USD" }
  };
  
  const { name, ticker } = names[assetKey] || { name: assetKey, ticker: assetKey };
  const latest = data.latest;
  
  const statusColors = {
    STABLE: '#00d4aa',
    ELEVATED: '#4a9eff',
    CAUTION: '#ffaa00',
    CRITICAL: '#ff4757'
  };
  
  const color = statusColors[latest.status] || '#00d4aa';
  
  const len = data.pi.length;
  const pi30dAgo = len > 30 ? data.pi[len - 31] : data.pi[0];
  const change = ((latest.pi - pi30dAgo) / pi30dAgo) * 100;
  const changeColor = change >= 0 ? '#ff4757' : '#00d4aa';
  const changeIcon = change >= 0 ? '▲' : '▼';
  
  const formatPrice = (price) => price >= 10000 ? `$${Math.round(price).toLocaleString()}` : `$${price.toFixed(2)}`;

  return (
    <div className="rounded-2xl p-5" style={{ backgroundColor: '#1a1a24', border: '1px solid #2a2a3a' }}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="text-lg font-bold text-white">{name}</div>
          <div className="text-xs text-gray-500 font-mono">{ticker}</div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold font-mono" style={{ color }}>{latest.pi.toFixed(2)}</div>
          <div className="text-xs font-mono mt-1" style={{ color: changeColor }}>
            {changeIcon} {Math.abs(change).toFixed(1)}%
          </div>
        </div>
      </div>
      
      <div className="mb-4 flex items-center gap-3">
        <StatusBadge status={latest.status} />
        <span className="text-sm text-gray-400">{formatPrice(latest.price)}</span>
      </div>
      
      <div className="flex gap-1.5 mb-4">
        {['1D', '1W', '1M', '1Y', 'MAX'].map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{
              backgroundColor: timeRange === range ? '#f5a623' : '#252530',
              color: timeRange === range ? '#000' : '#666'
            }}
          >
            {range}
          </button>
        ))}
      </div>
      
      <ZoneChart data={data} timeRange={timeRange} />
    </div>
  );
};

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    fetch(DATA_URL)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch data');
        return res.json();
      })
      .then(json => {
        setData(json);
        const firstAsset = Object.values(json)[0];
        if (firstAsset?.latest?.date) {
          setLastUpdate(firstAsset.latest.date);
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0a0a0f' }}>
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0a0a0f' }}>
        <div className="text-red-400 text-lg">Error: {error}</div>
      </div>
    );
  }

  const assets = Object.entries(data);
  const avgPi = assets.reduce((sum, [_, a]) => sum + a.latest.pi, 0) / assets.length;
  
  const getSystemStatus = (avg) => {
    if (avg < 0.45) return { status: 'STABLE', color: '#00d4aa', message: 'All markets stable. Low structural stress.' };
    if (avg < 0.60) return { status: 'ELEVATED', color: '#4a9eff', message: 'Elevated vigilance recommended.' };
    if (avg < 0.80) return { status: 'CAUTION', color: '#ffaa00', message: 'Caution advised. Significant stress detected.' };
    return { status: 'CRITICAL', color: '#ff4757', message: 'Critical alert. High instability risk.' };
  };
  
  const systemStatus = getSystemStatus(avgPi);

  return (
    <div 
      className="min-h-screen p-4 md:p-6"
      style={{ 
        backgroundColor: '#0a0a0f',
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
        backgroundSize: '32px 32px'
      }}
    >
      <div className="max-w-6xl mx-auto">
        <header className="mb-5">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="font-mono text-3xl" style={{ background: 'linear-gradient(135deg, #4a9eff, #00d4aa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Π</span>
                Stability Index
              </h1>
              <p className="text-gray-500 text-sm mt-1">Cross-domain systemic risk monitoring</p>
            </div>
            
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl" style={{ backgroundColor: '#1a1a24', border: '1px solid #2a2a3a' }}>
              <span className="text-xs text-gray-500 uppercase">Avg</span>
              <span className="text-2xl font-bold font-mono" style={{ color: systemStatus.color }}>{avgPi.toFixed(2)}</span>
              <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: systemStatus.color, boxShadow: `0 0 10px ${systemStatus.color}` }} />
            </div>
          </div>
        </header>

        <div className="grid grid-cols-4 gap-2 mb-5">
          {[
            { label: 'STABLE', range: '< 0.45', color: '#00d4aa', bg: 'rgba(0,212,170,0.1)' },
            { label: 'ELEVATED', range: '0.45-0.60', color: '#4a9eff', bg: 'rgba(74,158,255,0.1)' },
            { label: 'CAUTION', range: '0.60-0.80', color: '#ffaa00', bg: 'rgba(255,170,0,0.1)' },
            { label: 'CRITICAL', range: '≥ 0.80', color: '#ff4757', bg: 'rgba(255,71,87,0.1)' },
          ].map(({ label, range, color, bg }) => (
            <div key={label} className="rounded-lg py-2.5 px-3 text-center" style={{ backgroundColor: bg, borderLeft: `3px solid ${color}` }}>
              <div className="font-semibold text-xs mb-0.5" style={{ color }}>{label}</div>
              <div className="text-gray-500 text-xs">{range}</div>
            </div>
          ))}
        </div>

        <div className="mb-5 p-3 rounded-lg text-sm" style={{ backgroundColor: `${systemStatus.color}15`, border: `1px solid ${systemStatus.color}40` }}>
          <span style={{ color: systemStatus.color, fontWeight: 600 }}>✦ </span>
          <span className="text-gray-300">{systemStatus.message}</span>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          {assets.map(([key, assetData]) => (
            <AssetCard key={key} assetKey={key} data={assetData} />
          ))}
        </div>
        
        <footer className="text-center py-6 border-t border-gray-800/50 text-xs text-gray-500">
          <p className="mb-3">
            <span className="text-gray-400">⚠️ Disclaimer:</span> Personal research by{' '}
            <a href="https://x.com/Junwon777" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
              @Junwon777
            </a>. Core logic is proprietary. Not financial advice.
          </p>
          <a href="https://x.com/Junwon777" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-gray-500 hover:text-white transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            Follow
          </a>
          {lastUpdate && (
            <p className="mt-3 text-gray-600">Last updated: {lastUpdate}</p>
          )}
        </footer>
      </div>
    </div>
  );
}
