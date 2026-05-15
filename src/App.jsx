import React, { useState, useEffect } from 'react';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, Area, ComposedChart, Line } from 'recharts';

const DATA_URL = '/data/pi_data.json';

// ============================================
// Color Theme (Light + Classic)
// ============================================
const theme = {
  bg: '#f8f7f4',
  card: '#ffffff',
  cardBorder: '#e5e1d8',
  text: '#2c2c2c',
  textMuted: '#6b6b6b',
  textLight: '#999999',
  chartBg: '#fafaf8',
  
  stable: '#1a8f6e',
  elevated: '#2563eb', 
  caution: '#c27803',
  critical: '#c53030',
};

// ============================================
// Navigation Component with Dropdown
// ============================================
const Navigation = ({ currentPage, setCurrentPage, currentFilter, setCurrentFilter }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  
  const categories = [
    { id: 'all', label: 'All' },
    { id: 'equities', label: 'Equities' },
    { id: 'crypto', label: 'Crypto' },
    { id: 'commodities', label: 'Commodities' },
    { id: 'bonds', label: 'Bonds' },
  ];

  const getFilterLabel = () => {
    if (currentFilter === 'all') return '';
    const cat = categories.find(c => c.id === currentFilter);
    return cat ? ` · ${cat.label}` : '';
  };

  return (
    <nav className="flex gap-1 p-1 rounded-lg border" style={{ backgroundColor: theme.card, borderColor: theme.cardBorder }}>
      {/* Dashboard with dropdown */}
      <div 
        className="relative"
        onMouseEnter={() => setShowDropdown(true)}
        onMouseLeave={() => setShowDropdown(false)}
      >
        <button
          onClick={() => { setCurrentPage('dashboard'); setCurrentFilter('all'); }}
          className="px-4 py-2 rounded-md text-sm transition-all"
          style={{
            backgroundColor: currentPage === 'dashboard' ? theme.bg : 'transparent',
            color: currentPage === 'dashboard' ? theme.text : theme.textMuted,
            fontWeight: currentPage === 'dashboard' ? '600' : '400',
          }}
        >
          Dashboard{getFilterLabel()}
        </button>
        
        {/* Dropdown */}
        {showDropdown && (
          <div 
            className="absolute top-full left-0 mt-1 py-1 rounded-lg shadow-lg z-50 min-w-36"
            style={{ backgroundColor: theme.card, border: `1px solid ${theme.cardBorder}` }}
          >
            {categories.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => { setCurrentPage('dashboard'); setCurrentFilter(id); setShowDropdown(false); }}
                className="w-full px-4 py-2 text-left text-sm transition-all"
                style={{ 
                  backgroundColor: currentFilter === id ? theme.bg : 'transparent',
                  color: currentFilter === id ? theme.text : theme.textMuted,
                  fontWeight: currentFilter === id ? '600' : '400',
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = theme.bg}
                onMouseLeave={(e) => e.target.style.backgroundColor = currentFilter === id ? theme.bg : 'transparent'}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* About */}
      <button
        onClick={() => setCurrentPage('about')}
        className="px-4 py-2 rounded-md text-sm transition-all"
        style={{
          backgroundColor: currentPage === 'about' ? theme.bg : 'transparent',
          color: currentPage === 'about' ? theme.text : theme.textMuted,
          fontWeight: currentPage === 'about' ? '600' : '400',
        }}
      >
        About
      </button>
      
      {/* Paper */}
      <button
        onClick={() => setCurrentPage('paper')}
        className="px-4 py-2 rounded-md text-sm transition-all"
        style={{
          backgroundColor: currentPage === 'paper' ? theme.bg : 'transparent',
          color: currentPage === 'paper' ? theme.text : theme.textMuted,
          fontWeight: currentPage === 'paper' ? '600' : '400',
        }}
      >
        Paper
      </button>
    </nav>
  );
};

// ============================================
// About Page Component
// ============================================
const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="rounded-xl p-8 mb-6 shadow-sm" style={{ backgroundColor: theme.card, border: `1px solid ${theme.cardBorder}` }}>
        <h2 className="text-2xl font-bold mb-4" style={{ color: theme.text, fontFamily: 'Georgia, serif' }}>
          Structural Stability Index (Π)
        </h2>
        <p className="mb-6 leading-relaxed" style={{ color: theme.textMuted }}>
          The Π Index is a domain-agnostic framework that measures structural overload in complex systems. 
          It quantifies how close a system is to potential collapse by detecting the co-occurrence of 
          independent stress channels.
        </p>
        
        {/* Core Formula */}
        <div className="rounded-xl p-6 mb-6 text-center" style={{ backgroundColor: theme.bg, border: `1px solid ${theme.cardBorder}` }}>
          <div className="text-sm mb-2" style={{ color: theme.textMuted }}>Instantaneous Stress</div>
          <div className="text-3xl font-bold mb-4" style={{ fontFamily: 'Georgia, serif', color: theme.text }}>
            <span style={{ fontStyle: 'italic' }}>S</span>(t) = <span style={{ color: theme.critical }}>ρ</span>(t) × <span style={{ color: theme.caution }}>Ψ</span>(t) × <span style={{ color: theme.elevated }}>Ω</span>(t)
          </div>
          <div className="text-sm" style={{ color: theme.textMuted }}>
            Cumulative Index: Π(t) = ∫ S(τ) dτ
          </div>
        </div>

        {/* Three Channels */}
        <h3 className="text-lg font-semibold mb-4" style={{ color: theme.text, fontFamily: 'Georgia, serif' }}>
          Three Stress Channels
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="rounded-xl p-4" style={{ backgroundColor: theme.bg, borderLeft: `4px solid ${theme.critical}` }}>
            <div className="text-lg font-bold mb-1" style={{ color: theme.critical, fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>ρ (Rho)</div>
            <div className="font-medium mb-2" style={{ color: theme.text }}>External Pressure</div>
            <div className="text-sm" style={{ color: theme.textMuted }}>
              Exogenous shocks from outside the system. Examples: VIX, interest rate spreads, fear indices.
            </div>
          </div>
          <div className="rounded-xl p-4" style={{ backgroundColor: theme.bg, borderLeft: `4px solid ${theme.caution}` }}>
            <div className="text-lg font-bold mb-1" style={{ color: theme.caution, fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>Ψ (Psi)</div>
            <div className="font-medium mb-2" style={{ color: theme.text }}>Internal Amplification</div>
            <div className="text-sm" style={{ color: theme.textMuted }}>
              Endogenous response dynamics. Examples: price volatility, volume acceleration, momentum shifts.
            </div>
          </div>
          <div className="rounded-xl p-4" style={{ backgroundColor: theme.bg, borderLeft: `4px solid ${theme.elevated}` }}>
            <div className="text-lg font-bold mb-1" style={{ color: theme.elevated, fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>Ω (Omega)</div>
            <div className="font-medium mb-2" style={{ color: theme.text }}>Structural Coupling</div>
            <div className="text-sm" style={{ color: theme.textMuted }}>
              Cross-asset correlation and contagion risk. Higher values indicate tighter coupling during stress.
            </div>
          </div>
        </div>

        {/* Why Multiplication */}
        <h3 className="text-lg font-semibold mb-4" style={{ color: theme.text, fontFamily: 'Georgia, serif' }}>
          Why Multiplication?
        </h3>
        <div className="rounded-xl p-5 mb-6" style={{ backgroundColor: theme.bg, border: `1px solid ${theme.cardBorder}` }}>
          <p className="leading-relaxed" style={{ color: theme.textMuted }}>
            The multiplicative structure creates a <span className="font-medium" style={{ color: theme.text }}>coincidence filter</span>. 
            If any single channel is near zero, the total stress S(t) approaches zero—regardless of how elevated 
            the other channels may be. This captures a fundamental insight: <span className="font-medium" style={{ color: theme.text }}>
            systemic collapse rarely results from a single perturbation</span>. It requires the simultaneous 
            co-occurrence of external shocks, internal amplification, and structural vulnerability. 
            The framework has been validated across five major crises: 2008 Financial Crisis, Terra-Luna collapse, 
            Fukushima disaster, COVID-19 pandemic, and global supply chain disruption.
          </p>
        </div>

        {/* Thresholds */}
        <h3 className="text-lg font-semibold mb-4" style={{ color: theme.text, fontFamily: 'Georgia, serif' }}>
          Critical Thresholds
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'STABLE', range: 'Π < 0.40', color: theme.stable, desc: 'Normal operations' },
            { label: 'ELEVATED', range: '0.40 ≤ Π < 0.60', color: theme.elevated, desc: 'Increased vigilance' },
            { label: 'CAUTION', range: '0.60 ≤ Π < 0.80', color: theme.caution, desc: 'Significant stress' },
            { label: 'CRITICAL', range: 'Π ≥ 0.80', color: theme.critical, desc: 'High instability risk' },
          ].map(({ label, range, color, desc }) => (
            <div key={label} className="rounded-xl p-4 text-center" style={{ backgroundColor: theme.bg, border: `1px solid ${theme.cardBorder}` }}>
              <div className="font-semibold text-sm mb-1" style={{ color }}>{label}</div>
              <div className="font-mono text-sm mb-2" style={{ color: theme.text }}>{range}</div>
              <div className="text-xs" style={{ color: theme.textMuted }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Korean Summary */}
      <div className="rounded-xl p-8 shadow-sm" style={{ backgroundColor: theme.card, border: `1px solid ${theme.cardBorder}` }}>
        <h3 className="text-lg font-semibold mb-4" style={{ color: theme.text, fontFamily: 'Georgia, serif' }}>
          🇰🇷 한국어 요약
        </h3>
        <div className="leading-relaxed space-y-3" style={{ color: theme.textMuted }}>
          <p>
            <span className="font-medium" style={{ color: theme.text }}>Π 지수</span>는 복잡계 시스템의 구조적 과부하를 측정하는 
            도메인 비의존적(domain-agnostic) 프레임워크입니다.
          </p>
          <p>
            세 가지 독립적인 스트레스 채널(외부 압력 ρ, 내부 증폭 Ψ, 구조적 결합 Ω)의 <span className="font-medium" style={{ color: theme.text }}>동시 발생</span>을 
            감지하여 시스템 붕괴 가능성을 정량화합니다.
          </p>
          <p>
            곱셈 구조는 <span className="font-medium" style={{ color: theme.text }}>일치 필터(coincidence filter)</span>로 작동합니다: 
            어느 한 채널이라도 낮으면 전체 스트레스가 낮아집니다.
          </p>
        </div>
      </div>
    </div>
  );
};

// ============================================
// Paper Page Component
// ============================================
const PaperPage = () => {
  const links = [
    {
      title: 'Preprint (Research Square)',
      subtitle: 'Under Review at Nature Portfolio journal',
      url: 'https://www.researchsquare.com/article/rs-8968998/v2',
      icon: '📄',
      status: 'Under Review'
    },
    {
      title: 'GitHub Repository',
      subtitle: 'Analysis code and reproduction pipeline',
      url: 'https://github.com/Junwon03/pi-framework-nature',
      icon: '💻',
      status: 'Public'
    },
    {
      title: 'Zenodo Archive',
      subtitle: 'Archived code with DOI',
      url: 'https://doi.org/10.5281/zenodo.18768101',
      icon: '🗄️',
      status: 'Archived'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="rounded-xl p-8 mb-6 shadow-sm" style={{ backgroundColor: theme.card, border: `1px solid ${theme.cardBorder}` }}>
        <h2 className="text-2xl font-bold mb-2" style={{ color: theme.text, fontFamily: 'Georgia, serif' }}>
          Paper & Resources
        </h2>
        <p className="mb-6" style={{ color: theme.textMuted, fontStyle: 'italic' }}>
          Domain-agnostic multiplicative stress framework for systemic collapse
        </p>

        <div className="space-y-4">
          {links.map(({ title, subtitle, url, icon, status }) => (
            <a
              key={title}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 rounded-xl transition-all hover:shadow-md"
              style={{ backgroundColor: theme.bg, border: `1px solid ${theme.cardBorder}` }}
            >
              <div className="text-3xl">{icon}</div>
              <div className="flex-1">
                <div className="font-medium" style={{ color: theme.text }}>{title}</div>
                <div className="text-sm" style={{ color: theme.textMuted }}>{subtitle}</div>
              </div>
              <div className="px-3 py-1 rounded-full text-xs font-medium" 
                   style={{ backgroundColor: theme.cardBorder, color: theme.textMuted }}>
                {status}
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Citation */}
      <div className="rounded-xl p-8 shadow-sm" style={{ backgroundColor: theme.card, border: `1px solid ${theme.cardBorder}` }}>
        <h3 className="text-lg font-semibold mb-4" style={{ color: theme.text, fontFamily: 'Georgia, serif' }}>Citation</h3>
        <div className="rounded-xl p-4 font-mono text-sm leading-relaxed" 
             style={{ backgroundColor: theme.bg, color: theme.textMuted, border: `1px solid ${theme.cardBorder}` }}>
          Lee, J. (2026). Domain-agnostic multiplicative stress framework for systemic collapse. 
          <span style={{ color: theme.textLight }}> Preprint at Research Square.</span>
          <br />
          https://doi.org/10.21203/rs.3.rs-8968998/v2
        </div>
      </div>

      {/* Author */}
      <div className="rounded-xl p-8 mt-6 shadow-sm" style={{ backgroundColor: theme.card, border: `1px solid ${theme.cardBorder}` }}>
        <h3 className="text-lg font-semibold mb-4" style={{ color: theme.text, fontFamily: 'Georgia, serif' }}>Author</h3>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
               style={{ backgroundColor: theme.bg, border: `1px solid ${theme.cardBorder}` }}>
            👨‍🔬
          </div>
          <div>
            <div className="font-medium" style={{ color: theme.text }}>Junwon Lee (이준원)</div>
            <div className="text-sm" style={{ color: theme.textMuted }}>Dankook University</div>
            <a href="https://x.com/Junwon777" target="_blank" rel="noopener noreferrer" 
               className="text-sm hover:underline" style={{ color: theme.elevated }}>
              @Junwon777
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// Dashboard Components
// ============================================
const StatusBadge = ({ status }) => {
  const config = {
    STABLE: { color: theme.stable, bg: `${theme.stable}15` },
    ELEVATED: { color: theme.elevated, bg: `${theme.elevated}15` },
    CAUTION: { color: theme.caution, bg: `${theme.caution}15` },
    CRITICAL: { color: theme.critical, bg: `${theme.critical}15` }
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
        <div className="rounded-lg p-3 text-xs shadow-lg" style={{ backgroundColor: theme.card, border: `1px solid ${theme.cardBorder}` }}>
          <div className="mb-2 font-mono text-xs" style={{ color: theme.textMuted }}>{dateValue}</div>
          <div className="flex items-center justify-between gap-4 mb-1">
            <span style={{ color: theme.textMuted }}>Π Index</span>
            <span className="font-mono font-bold" style={{ color: theme.caution }}>{piValue?.toFixed(3)}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span style={{ color: theme.textMuted }}>Price</span>
            <span className="font-mono font-bold" style={{ color: theme.text }}>
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
        <div className="rounded-lg py-2 px-3" style={{ backgroundColor: theme.bg }}>
          <div className="text-xs mb-0.5" style={{ color: theme.textMuted }}>Date</div>
          <div className="font-mono text-sm" style={{ color: theme.text }}>{latest.date}</div>
        </div>
        <div className="rounded-lg py-2 px-3" style={{ backgroundColor: theme.bg }}>
          <div className="text-xs mb-0.5" style={{ color: theme.textMuted }}>Price</div>
          <div className="font-mono text-sm" style={{ color: theme.text }}>
            ${latest.price >= 1000 ? Math.round(latest.price).toLocaleString() : latest.price?.toFixed(2)}
          </div>
        </div>
        <div className="rounded-lg py-2 px-3" style={{ backgroundColor: theme.bg }}>
          <div className="text-xs mb-0.5" style={{ color: theme.textMuted }}>Π Index</div>
          <div className="font-mono text-sm font-bold" style={{ color: theme.caution }}>{latest.pi?.toFixed(3)}</div>
        </div>
      </div>

      <div className="h-48 w-full rounded-xl overflow-hidden" style={{ backgroundColor: theme.chartBg, border: `1px solid ${theme.cardBorder}` }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={filteredData} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
            <defs>
              <linearGradient id="criticalZone" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={theme.critical} stopOpacity={0.3}/>
                <stop offset="100%" stopColor={theme.critical} stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="cautionZone" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={theme.caution} stopOpacity={0.25}/>
                <stop offset="100%" stopColor={theme.caution} stopOpacity={0.08}/>
              </linearGradient>
              <linearGradient id="elevatedZone" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={theme.elevated} stopOpacity={0.2}/>
                <stop offset="100%" stopColor={theme.elevated} stopOpacity={0.05}/>
              </linearGradient>
              <linearGradient id="stableZone" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={theme.stable} stopOpacity={0.15}/>
                <stop offset="100%" stopColor={theme.stable} stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            
            <XAxis 
              dataKey="dateLabel" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: theme.textMuted, fontSize: 9 }}
              interval={timeRange === '1W' ? 0 : timeRange === '1M' ? 6 : Math.floor(filteredData.length / 5)}
            />
            
            <YAxis 
              yAxisId="pi"
              domain={[0, 1]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: theme.textMuted, fontSize: 9 }}
              tickFormatter={(v) => v.toFixed(1)}
              ticks={[0, 0.40, 0.60, 0.80, 1.0]}
            />
            
            <YAxis 
              yAxisId="price"
              orientation="right"
              domain={[minPrice * 0.9, maxPrice * 1.1]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: theme.textMuted, fontSize: 9 }}
              tickFormatter={(v) => v >= 1000 ? `${Math.round(v/1000)}K` : Math.round(v)}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            <Area yAxisId="pi" type="monotone" dataKey={() => 1.0} stroke="none" fill="url(#criticalZone)" baseValue={0.80} />
            <Area yAxisId="pi" type="monotone" dataKey={() => 0.80} stroke="none" fill="url(#cautionZone)" baseValue={0.60} />
            <Area yAxisId="pi" type="monotone" dataKey={() => 0.60} stroke="none" fill="url(#elevatedZone)" baseValue={0.40} />
            <Area yAxisId="pi" type="monotone" dataKey={() => 0.40} stroke="none" fill="url(#stableZone)" baseValue={0} />
            
            <Line yAxisId="pi" type="monotone" dataKey={() => 0.40} stroke={theme.stable} strokeWidth={1} strokeDasharray="3 3" dot={false} />
            <Line yAxisId="pi" type="monotone" dataKey={() => 0.60} stroke={theme.elevated} strokeWidth={1} strokeDasharray="3 3" dot={false} />
            <Line yAxisId="pi" type="monotone" dataKey={() => 0.80} stroke={theme.caution} strokeWidth={1} strokeDasharray="3 3" dot={false} />
            
            <Line yAxisId="price" type="monotone" dataKey="price" stroke={theme.textLight} strokeWidth={1.5} dot={false} />
            <Line yAxisId="pi" type="monotone" dataKey="pi" stroke="#b8860b" strokeWidth={2.5} dot={false} activeDot={{ r: 4, fill: '#b8860b' }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex gap-4 mt-2 px-1 text-xs" style={{ color: theme.textMuted }}>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-0.5 rounded" style={{ backgroundColor: '#b8860b' }}></span>
          Π Index
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-0.5 rounded" style={{ backgroundColor: theme.textLight }}></span>
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
    ETH: { name: "Ethereum", ticker: "ETH-USD" },
    GLD: { name: "Gold", ticker: "GLD" },
    SLV: { name: "Silver", ticker: "SLV" },
    USO: { name: "Oil", ticker: "USO" },
    TLT: { name: "Treasury Bond", ticker: "TLT" }
  };
  
  const { name, ticker } = names[assetKey] || { name: assetKey, ticker: assetKey };
  const latest = data.latest || {};
  
  const statusColors = {
    STABLE: theme.stable,
    ELEVATED: theme.elevated,
    CAUTION: theme.caution,
    CRITICAL: theme.critical
  };
  
  const color = statusColors[latest.status] || theme.stable;
  
  const len = data.pi.length;
  const pi30dAgo = len > 30 ? data.pi[len - 31] : data.pi[0];
  const change = ((latest.pi - pi30dAgo) / pi30dAgo) * 100;
  const changeColor = change >= 0 ? theme.critical : theme.stable;
  const changeIcon = change >= 0 ? '▲' : '▼';
  
  const formatPrice = (price) => price >= 10000 ? `$${Math.round(price).toLocaleString()}` : `$${price.toFixed(2)}`;

  return (
    <div className="rounded-xl p-5 shadow-sm" style={{ backgroundColor: theme.card, border: `1px solid ${theme.cardBorder}` }}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="text-lg font-bold" style={{ color: theme.text, fontFamily: 'Georgia, serif' }}>{name}</div>
          <div className="text-xs font-mono" style={{ color: theme.textMuted }}>{ticker}</div>
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
        <span className="text-sm" style={{ color: theme.textMuted }}>{formatPrice(latest.price)}</span>
      </div>
      
      <div className="flex gap-1.5 mb-4">
        {['1D', '1W', '1M', '1Y', 'MAX'].map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{
              backgroundColor: timeRange === range ? theme.text : theme.bg,
              color: timeRange === range ? theme.card : theme.textMuted,
              border: `1px solid ${theme.cardBorder}`
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

const DashboardPage = ({ data, avgPi, systemStatus, currentFilter }) => {
  const categoryMap = {
    equities: ['SPY', 'QQQ'],
    crypto: ['BTC', 'ETH'],
    commodities: ['GLD', 'SLV', 'USO'],
    bonds: ['TLT'],
  };
  
  let assets = Object.entries(data);
  
  if (currentFilter !== 'all') {
    const allowedAssets = categoryMap[currentFilter] || [];
    assets = assets.filter(([key]) => allowedAssets.includes(key));
  }

  return (
    <>
      <div className="grid grid-cols-4 gap-2 mb-5">
        {[
          { label: 'STABLE', range: '< 0.40', color: theme.stable },
          { label: 'ELEVATED', range: '0.40-0.60', color: theme.elevated },
          { label: 'CAUTION', range: '0.60-0.80', color: theme.caution },
          { label: 'CRITICAL', range: '≥ 0.80', color: theme.critical },
        ].map(({ label, range, color }) => (
          <div key={label} className="rounded-lg py-2.5 px-3 text-center" style={{ backgroundColor: `${color}10`, borderLeft: `3px solid ${color}` }}>
            <div className="font-semibold text-xs mb-0.5" style={{ color }}>{label}</div>
            <div className="text-xs" style={{ color: theme.textMuted }}>{range}</div>
          </div>
        ))}
      </div>

      <div className="mb-5 p-3 rounded-lg text-sm" style={{ backgroundColor: `${systemStatus.color}10`, border: `1px solid ${systemStatus.color}30` }}>
        <span style={{ color: systemStatus.color, fontWeight: 600 }}>✦ </span>
        <span style={{ color: theme.text }}>{systemStatus.message}</span>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {assets.map(([key, assetData]) => (
          <AssetCard key={key} assetKey={key} data={assetData} />
        ))}
      </div>
    </>
  );
};

// ============================================
// Main App Component
// ============================================
export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [currentFilter, setCurrentFilter] = useState('all');

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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.bg }}>
        <div style={{ color: theme.text }} className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.bg }}>
        <div style={{ color: theme.critical }} className="text-lg">Error: {error}</div>
      </div>
    );
  }

  const assets = Object.entries(data);
  const avgPi = assets.reduce((sum, [_, a]) => sum + a.latest.pi, 0) / assets.length;
  
  const getSystemStatus = (avg) => {
    if (avg < 0.40) return { status: 'STABLE', color: theme.stable, message: 'All markets stable. Low structural stress.' };
    if (avg < 0.60) return { status: 'ELEVATED', color: theme.elevated, message: 'Elevated vigilance recommended.' };
    if (avg < 0.80) return { status: 'CAUTION', color: theme.caution, message: 'Caution advised. Significant stress detected.' };
    return { status: 'CRITICAL', color: theme.critical, message: 'Critical alert. High instability risk.' };
  };
  
  const systemStatus = getSystemStatus(avgPi);

  return (
    <div 
      className="min-h-screen p-4 md:p-6"
      style={{ backgroundColor: theme.bg }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-5">
          <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: theme.text }}>
                <span className="text-4xl" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', color: '#8b7355' }}>Π</span>
                <span style={{ fontFamily: 'Georgia, serif' }}>Stability Index</span>
              </h1>
              <p className="text-sm mt-1" style={{ color: theme.textMuted }}>Cross-domain systemic risk monitoring</p>
              <p className="text-xs mt-0.5" style={{ color: theme.textLight }}>복합위기 조기경보 — 무차원 임계점 지수(Π) 기반 이종 도메인 통합 모니터링</p>
            </div>
            
            {currentPage === 'dashboard' && (
              <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl shadow-sm" style={{ backgroundColor: theme.card, border: `1px solid ${theme.cardBorder}` }}>
                <span className="text-xs uppercase" style={{ color: theme.textMuted }}>Avg</span>
                <span className="text-2xl font-bold font-mono" style={{ color: systemStatus.color }}>{avgPi.toFixed(2)}</span>
                <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: systemStatus.color }} />
              </div>
            )}
          </div>
          
          {/* Navigation */}
          <Navigation 
            currentPage={currentPage} 
            setCurrentPage={setCurrentPage} 
            currentFilter={currentFilter} 
            setCurrentFilter={setCurrentFilter} 
          />
        </header>

        {/* Page Content */}
        {currentPage === 'dashboard' && (
          <DashboardPage data={data} avgPi={avgPi} systemStatus={systemStatus} currentFilter={currentFilter} />
        )}
        {currentPage === 'about' && <AboutPage />}
        {currentPage === 'paper' && <PaperPage />}
        
        {/* Footer */}
        <footer className="text-center py-6 mt-8 text-xs" style={{ borderTop: `1px solid ${theme.cardBorder}`, color: theme.textMuted }}>
          <p className="mb-3">
            <span style={{ color: theme.textLight }}>⚠️ Disclaimer:</span> Personal research by{' '}
            <a href="https://x.com/Junwon777" target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: theme.elevated }}>
              @Junwon777
            </a>. Core logic is proprietary. Not financial advice.
          </p>
          <a href="https://x.com/Junwon777" target="_blank" rel="noopener noreferrer" 
             className="inline-flex items-center gap-1.5 transition-colors hover:opacity-70" style={{ color: theme.textMuted }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            Follow
          </a>
          {lastUpdate && (
            <p className="mt-3" style={{ color: theme.textLight }}>Last updated: {lastUpdate}</p>
          )}
        </footer>
      </div>
    </div>
  );
}
