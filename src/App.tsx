/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  Crosshair, 
  Archive, 
  Network, 
  Upload, 
  Server, 
  Activity, 
  ArrowRight, 
  ShieldCheck, 
  Database, 
  TerminalSquare,
  Search,
  Eye,
  AlertTriangle,
  Cloud,
  Globe,
  X,
  Copy,
  Check,
  MapPin,
  ChevronRight,
  Info,
  Calendar,
  Filter,
  CheckCircle,
  XCircle,
  FileText,
  Flame,
  Wind,
  ThermometerSun,
  Layers,
  SlidersHorizontal,
  CloudLightning,
  Sparkles,
  Brain
} from 'lucide-react';

import { motion } from 'motion/react';

function JSONModal({ isOpen, onClose, data }: { isOpen: boolean, onClose: () => void, data: any }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0a0a0a] border border-zinc-800 rounded-lg w-full max-w-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-zinc-800 bg-zinc-900/50">
          <h3 className="font-mono text-sm text-zinc-300 flex items-center gap-2">
            <Database className="h-4 w-4 text-emerald-400" />
            SCAN_RECORD // {data?.scan_id || data?.id || 'UNKNOWN'}
          </h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <pre className="font-mono text-sm text-zinc-400 whitespace-pre-wrap leading-relaxed">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
import SatelliteMap from './components/SatelliteMap';
import { supabase } from './lib/supabase';

type Tab = 'overview' | 'scan' | 'archive' | 'architecture';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-zinc-200 font-sans overflow-x-hidden selection:bg-emerald-500/30">
      
      {/* Background ambient glow centered near top - MUST BE BEHIND EVERYTHING */}
      <div className="fixed top-[-10%] left-1/4 w-1/2 h-96 bg-emerald-500/5 rounded-[100%] blur-[120px] pointer-events-none -z-10"></div>
      
      <NavHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 w-full max-w-[1500px] mx-auto px-4 sm:px-8 pt-32 sm:pt-40 pb-24 relative z-0">
         <div className="relative transition-all duration-300 h-full">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'scan' && <ActiveScanTab />}
          {activeTab === 'archive' && <DataArchiveTab />}
          {activeTab === 'architecture' && <ArchitectureTab />}
         </div>
      </main>
    </div>
  );
}

function NavHeader({ activeTab, setActiveTab }: { activeTab: Tab, setActiveTab: (t: Tab) => void }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'scan', label: 'Active Scan', icon: Crosshair },
    { id: 'archive', label: 'Data Archive', icon: Archive },
    { id: 'architecture', label: 'Architecture', icon: Network },
  ] as const;

  return (
    <motion.div 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4"
    >
      <div className={`flex items-center justify-between gap-4 md:gap-8 px-4 py-2 md:px-6 md:py-3 rounded-full border transition-all duration-500 shadow-2xl ${
        isScrolled ? 'bg-zinc-950/90 backdrop-blur-xl border-zinc-800/80 shadow-emerald-900/10' : 'bg-[#0a0a0a]/80 backdrop-blur-md border-zinc-800/50 shadow-black/50'
      }`}>
        
        {/* Logo */}
        <div className="flex items-center gap-3 md:pr-6 border-r border-zinc-800/60">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <Activity className="h-4 w-4 text-emerald-400" />
            <span className="absolute inset-0 rounded-full border border-emerald-400/50 animate-[ping_3s_ease-in-out_infinite]"></span>
          </div>
          <div className="hidden lg:block">
            <h1 className="text-sm font-bold tracking-tighter text-zinc-100">L'Apogée.GEO</h1>
            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest leading-none mt-1">v2.4.0 <span className="text-emerald-500/70">AUTONOMOUS</span></p>
          </div>
        </div>

        {/* Tabs */}
        <nav className="flex items-center gap-1 md:gap-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as Tab)}
                className={`relative flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium transition-colors outline-none ${
                  isActive ? 'text-emerald-400' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav-pill"
                    className="absolute inset-0 bg-emerald-400/10 border border-emerald-400/20 rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <item.icon className="h-4 w-4 relative z-10" />
                <span className="hidden sm:block relative z-10">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Status indicator */}
        <div className="hidden md:flex items-center gap-3 pl-4 md:pl-6 border-l border-zinc-800/60">
          <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400 bg-emerald-400/5 px-3 py-1.5 rounded-full border border-emerald-400/10 cursor-default">
            <ShieldCheck className="h-3 w-3" />
            <span className="uppercase tracking-widest">Sys Secure</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function OverviewTab() {
  const [spectralMode, setSpectralMode] = useState<'NDVI' | 'AOD' | 'CH4'>('NDVI');
  
  const spectralConfig = {
    'NDVI': {
      title: 'Vegetation Index',
      color: 'emerald',
      bgRing: 'border-t-emerald-500/50',
      textColor: 'text-emerald-400',
      shadow: 'shadow-[0_0_15px_rgba(52,211,153,0.1)]',
      value: '0.84',
      status: 'Healthy',
      formula: 'P_BAND: (NIR - R)'
    },
    'AOD': {
      title: 'Aerosol Optical Depth',
      color: 'amber',
      bgRing: 'border-t-amber-500/50',
      textColor: 'text-amber-400',
      shadow: 'shadow-[0_0_15px_rgba(251,191,36,0.1)]',
      value: '0.12',
      status: 'Clear',
      formula: 'MODIS_AOD_550nm'
    },
    'CH4': {
      title: 'Methane Spike Plume',
      color: 'purple',
      bgRing: 'border-t-purple-500/50',
      textColor: 'text-purple-400',
      shadow: 'shadow-[0_0_15px_rgba(168,85,247,0.1)]',
      value: '1940',
      status: 'ppb High',
      formula: 'TROPOMI_L2_CH4'
    }
  };

  const currMode = spectralConfig[spectralMode];

  const handleSpectralToggle = () => {
    if (spectralMode === 'NDVI') setSpectralMode('AOD');
    else if (spectralMode === 'AOD') setSpectralMode('CH4');
    else setSpectralMode('NDVI');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8 h-full"
    >
      <motion.header variants={itemVariants}>
        <h2 className="text-2xl font-bold tracking-tight">System Overview</h2>
        <p className="text-zinc-400 text-sm mt-1">Autonomous Geospatial AI Engine Status</p>
      </motion.header>

      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard title="Active Scans" value="12" icon={Activity} trend="+2 from last hr" sparkline={[30, 45, 25, 60, 40, 80, 50, 90]} />
        <MetricCard title="Anomalies Detected" value="3,492" icon={AlertTriangle} trend="7-day cumulative" color="amber" sparkline={[10, 20, 15, 40, 30, 60, 55, 75]} />
        <MetricCard title="System Load" value="48.2%" icon={Server} trend="Edge Fn Computing" color="blue" sparkline={[40, 42, 41, 48, 47, 46, 49, 48]} />
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-4 relative">
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-lg p-6 flex flex-col relative overflow-hidden group">
          
          {/* Subtle scanning background line */}
          <motion.div 
            animate={{ top: ['-10%', '110%'] }} 
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            className="absolute left-0 right-0 h-[1px] bg-emerald-500/20 shadow-[0_0_10px_rgba(52,211,153,0.3)] z-0 pointer-events-none" 
          />

          <div className="relative z-10 flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-zinc-500" />
              Recent Operations Feed
            </h3>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-[9px] font-mono text-emerald-400 uppercase tracking-widest">
                <CloudLightning className="h-3 w-3" /> Supabase Edge
              </span>
              <span className="text-xs text-zinc-600 font-mono hidden sm:inline">LIVE_LINK_ACTIVE</span>
            </div>
          </div>
          
          <div className="flex-1 space-y-1 font-mono text-sm relative z-10 bg-[#0a0a0a] border border-zinc-800/80 rounded p-2">
            <FeedItem time="14:22:04" lat="48.8566" lng="2.3522" status="SCAN_COMPLETE" delay={0.1} />
            <FeedItem time="14:19:12" lat="-3.4653" lng="-62.2159" status="ANOMALY_DETECTED" highlight delay={0.2} />
            <FeedItem time="14:15:58" lat="35.6762" lng="139.6503" status="SCAN_INITIALIZED" delay={0.3} />
            <FeedItem time="14:10:33" lat="51.5074" lng="-0.1278" status="SCAN_COMPLETE" delay={0.4} />
            <FeedItem time="14:05:11" lat="40.7128" lng="-74.0060" status="DATA_ARCHIVED" delay={0.5} />
          </div>
        </div>

        <div 
          onClick={handleSpectralToggle}
          className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 flex flex-col justify-between items-center text-center overflow-hidden relative group cursor-pointer hover:border-zinc-700 transition-colors"
        >
          <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-6 w-full text-left flex justify-between">
            <span>Spectral Node: {currMode.title}</span>
            <Crosshair className="h-4 w-4 text-zinc-600 group-hover:text-amber-500/50 transition-colors" />
          </h3>
          
          <div className="relative flex justify-center items-center h-40 w-full mb-4">
            {/* Outer rotating dashed ring */}
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ repeat: Infinity, duration: 30, ease: "linear" }} 
              className="absolute inset-0 max-w-[160px] max-h-[160px] m-auto border-2 border-dashed border-zinc-800 rounded-full" 
            />
            {/* Inner reversing gradient ring */}
            <motion.div 
              animate={{ rotate: -360 }} 
              transition={{ repeat: Infinity, duration: 40, ease: "linear" }} 
              className={`absolute inset-2 max-w-[140px] max-h-[140px] m-auto border border-zinc-800/80 rounded-full ${currMode.bgRing} ${currMode.shadow}`} 
            />
            
            {/* Core reading */}
            <div className="relative z-10 text-center bg-zinc-950 rounded-full w-28 h-28 flex flex-col items-center justify-center border border-zinc-800 shadow-inner overflow-hidden">
              <motion.div 
                key={spectralMode}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className={`${currMode.textColor} font-mono text-3xl font-bold tracking-tighter`}>{spectralMode}</div>
                <div className="text-[9px] text-zinc-500 font-mono mt-1 tracking-[0.2em] uppercase">{currMode.status}</div>
              </motion.div>
            </div>
          </div>

          <div className="font-mono text-xs text-zinc-400 w-full border-t border-zinc-800 pt-4 mt-auto">
             <div className="flex justify-between mb-1">
               <span>{currMode.formula}</span>
               <span className={currMode.textColor}>{currMode.value}</span>
             </div>
             <div className="flex justify-between">
               <span className="group-hover:text-zinc-300 transition-colors">CLICK TO CYCLE SPECTRUM</span>
               <span className="text-emerald-500/50"><ArrowRight className="h-3 w-3 inline" /></span>
             </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function MetricCard({ title, value, icon: Icon, trend, color = "emerald", sparkline }: { title: string, value: string, icon: any, trend: string, color?: string, sparkline?: number[] }) {
  const colorMap: Record<string, string> = {
    emerald: "text-emerald-400 border-emerald-500/30",
    amber: "text-amber-400 border-amber-500/30",
    blue: "text-blue-400 border-blue-500/30",
  };
  
  const bgMap: Record<string, string> = {
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    blue: "bg-blue-500",
  };

  return (
    <div className={`bg-zinc-900 border border-zinc-800 border-t-2 ${colorMap[color].split(' ')[1]} rounded-lg p-6 hover:bg-zinc-800/80 transition-all cursor-pointer group hover:-translate-y-1 hover:shadow-2xl overflow-hidden relative`}>
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-xs font-medium text-zinc-400 tracking-wider uppercase">{title}</p>
          <p className="text-3xl font-mono mt-2 text-zinc-100">{value}</p>
        </div>
        <div className="p-2 bg-zinc-950 rounded border border-zinc-800 group-hover:border-zinc-600 transition-colors">
          <Icon className={`h-5 w-5 ${colorMap[color].split(' ')[0]}`} />
        </div>
      </div>
      
      <div className="flex justify-between items-end mt-6 relative z-10">
        <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{trend}</p>
      </div>

      {/* Sparkline background graphic */}
      {sparkline && (
        <div className="absolute bottom-0 left-0 right-0 h-16 flex items-end opacity-20 pointer-events-none px-2 space-x-1 pb-1">
          {sparkline.map((h, i) => (
            <motion.div 
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ delay: 0.1 * i, duration: 0.8, ease: "easeOut" }}
              className={`flex-1 ${bgMap[color]} rounded-t-sm`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FeedItem({ time, lat, lng, status, highlight, delay = 0 }: { time: string, lat: string, lng: string, status: string, highlight?: boolean, delay?: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: delay, duration: 0.4 }}
      className="flex items-center gap-4 py-2 hover:bg-zinc-800/40 cursor-pointer px-3 rounded transition-colors group relative overflow-hidden"
    >
      {/* Subde hover scanline effect behind text */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-700/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none"></div>

      <span className="text-zinc-500 text-xs w-20 group-hover:text-zinc-300 transition-colors z-10">{time}</span>
      <span className="text-zinc-400 tracking-tight flex-1 group-hover:text-emerald-400 transition-colors z-10">[{lat}, {lng}]</span>
      <span className={`${highlight ? 'text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded' : 'text-blue-400'} text-xs flex items-center gap-2 z-10 uppercase tracking-widest`}>
        {status}
        <ChevronRight className={`h-3 w-3 transition-all ${highlight ? 'opacity-100 text-amber-500 translate-x-1' : 'opacity-0 group-hover:opacity-100 group-hover:translate-x-1'}`} />
      </span>
    </motion.div>
  );
}

function ActiveScanTab() {
  const [scanState, setScanState] = useState<'IDLE' | 'LOADING' | 'COMPLETE'>('IDLE');
  const [coords, setCoords] = useState('-3.4653, -62.2159');
  const [scanDate, setScanDate] = useState('2024-05-20');
  const [copied, setCopied] = useState(false);
  
  const [showRiskHeatmap, setShowRiskHeatmap] = useState(false);
  const [sliderRatio, setSliderRatio] = useState(50);
  
  // Parse coordinates
  const [lat, lng] = coords.split(',').map(c => parseFloat(c.trim()));
  const isValidCoords = !isNaN(lat) && !isNaN(lng);
  
  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleScan = async () => {
    if (scanState === 'LOADING') return;
    setScanState('LOADING');
    
    // Simulate Gemini delay
    setTimeout(async () => {
      setScanState('COMPLETE');
      
      // Attempt to save to Supabase
      try {
        await supabase.from('scans').insert([{
          scan_id: 'GEO-' + Math.floor(Math.random() * 8999 + 1000) + 'A-21X',
          date: scanDate,
          coords: `${lat.toFixed(3)}, ${lng.toFixed(3)}`,
          classification: 'NEW_DETECTION',
          confidence: 0.95,
          type: 'warning'
        }]);
      } catch (e) {
        console.error('Supabase save failed: ', e);
      }
    }, 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
      <header>
        <h2 className="text-2xl font-bold tracking-tight">Active Scan Protocol</h2>
        <p className="text-zinc-400 text-sm mt-1">Acquire and analyze localized geospatial imagery</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        
        {/* Left Column - Controls */}
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <label className="block text-sm font-medium text-zinc-400 uppercase tracking-wider mb-2">
              Target Coordinates (Lat/Lng)
            </label>
            <div className="relative">
              <Crosshair className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input 
                type="text" 
                value={coords}
                onChange={(e) => setCoords(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-md py-3 pl-10 pr-4 text-sm font-mono text-emerald-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-bold tracking-wider"
                placeholder="0.0000, 0.0000"
              />
            </div>
            
            <div className="flex flex-wrap gap-2 mt-3">
              <button onClick={() => setCoords('-3.4653, -62.2159')} className="text-[10px] uppercase tracking-wide bg-zinc-950 border border-zinc-800 hover:border-emerald-500/50 hover:bg-emerald-900/10 text-zinc-400 px-3 py-1.5 rounded transition-all flex items-center gap-1.5"><MapPin className="h-3 w-3"/> Amazon Basin</button>
              <button onClick={() => setCoords('48.8566, 2.3522')} className="text-[10px] uppercase tracking-wide bg-zinc-950 border border-zinc-800 hover:border-emerald-500/50 hover:bg-emerald-900/10 text-zinc-400 px-3 py-1.5 rounded transition-all flex items-center gap-1.5"><MapPin className="h-3 w-3"/> Paris Metro</button>
              <button onClick={() => setCoords('14.5995, 120.9842')} className="text-[10px] uppercase tracking-wide bg-zinc-950 border border-zinc-800 hover:border-emerald-500/50 hover:bg-emerald-900/10 text-zinc-400 px-3 py-1.5 rounded transition-all flex items-center gap-1.5"><MapPin className="h-3 w-3"/> Manila Bay</button>
            </div>
            
            <label className="block text-sm font-medium text-zinc-400 uppercase tracking-wider mt-6 mb-2">
              Temporal Baseline (Date)
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input 
                type="date" 
                value={scanDate}
                onChange={(e) => {
                   setScanDate(e.target.value);
                   setScanState('IDLE');
                }}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-md py-3 pl-10 pr-4 text-sm font-mono text-emerald-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-bold tracking-wider [color-scheme:dark]"
              />
            </div>

            <div className="flex items-center justify-between mt-6 p-4 bg-zinc-950/50 border border-zinc-800/80 rounded-md">
              <div className="flex items-center gap-3">
                <Flame className={`h-5 w-5 ${showRiskHeatmap ? 'text-amber-500' : 'text-zinc-600'}`} />
                <div>
                  <div className="text-sm font-medium text-zinc-300">Predictive Risk Filter</div>
                  <div className="text-xs text-zinc-500 font-mono">Highlight highly vulnerable sectors</div>
                </div>
              </div>
              <button 
                onClick={() => setShowRiskHeatmap(!showRiskHeatmap)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${showRiskHeatmap ? 'bg-amber-500' : 'bg-zinc-800'}`}
              >
                <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${showRiskHeatmap ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>

            <label className="block text-sm font-medium text-zinc-400 uppercase tracking-wider mt-6 mb-2 flex justify-between items-center">
              <span>Live Satellite Feed (NASA GIBS)</span>
              {scanState === 'COMPLETE' && <span className="text-[10px] text-emerald-500 font-mono flex items-center gap-1 animate-pulse"><SlidersHorizontal className="h-3 w-3" /> T-SERIES ACTIVE</span>}
            </label>
            <div className="border border-zinc-800 rounded-md overflow-hidden bg-zinc-950/50 relative">
              {isValidCoords ? (
                <>
                  <SatelliteMap 
                    latitude={lat} 
                    longitude={lng} 
                    date={scanDate} 
                    zoom={9} 
                    showRiskHeatmap={showRiskHeatmap}
                    timeComparisonDate={scanState === 'COMPLETE' ? '2022-01-01' : undefined}
                    comparisonSliderRatio={sliderRatio}
                  />
                  {scanState === 'COMPLETE' && (
                    <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex items-center justify-center z-[500] pointer-events-none" style={{ marginLeft: `${sliderRatio}%`}}>
                       <div className="w-1 h-full min-h-[500px] bg-white absolute -translate-x-1/2 shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
                       <div className="w-8 h-8 rounded-full bg-white absolute -translate-x-1/2 flex items-center justify-center shadow-lg border border-zinc-300 pointer-events-auto cursor-ew-resize">
                         <SlidersHorizontal className="h-4 w-4 text-zinc-900" />
                       </div>
                    </div>
                  )}
                  {scanState === 'COMPLETE' && (
                     <input 
                       type="range" 
                       min="0" max="100" 
                       value={sliderRatio} 
                       onChange={(e) => setSliderRatio(parseInt(e.target.value) || 0)}
                       className="absolute inset-0 w-full h-[500px] opacity-0 cursor-ew-resize z-[500]"
                     />
                  )}
                </>
              ) : (
                <div className="h-[500px] flex flex-col items-center justify-center p-8 text-center bg-zinc-950">
                  <Globe className="h-8 w-8 text-zinc-700 mb-3" />
                  <p className="text-sm text-amber-500/80 font-mono">INVALID COORDINATE FORMAT</p>
                  <p className="text-xs text-zinc-600 mt-2">Awaiting valid Lat/Lng inputs...</p>
                </div>
              )}
            </div>
            
            <button 
              onClick={handleScan}
              disabled={scanState === 'LOADING'}
              className="mt-6 w-full bg-zinc-100 hover:bg-white text-zinc-950 font-bold py-3 px-4 rounded-md uppercase tracking-wider text-sm transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {scanState === 'LOADING' ? (
                <>
                  <Activity className="h-4 w-4 animate-spin" />
                  INITIALIZING...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  INITIALIZE SCAN
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column - Terminal */}
        <div className="bg-[#0c0c0c] border border-zinc-800 rounded-lg p-1 flex flex-col">
          <div className="flex items-center gap-2 px-4 py-2 border-b border-zinc-800/50 bg-zinc-900/50 rounded-t-md">
            <TerminalSquare className="h-4 w-4 text-zinc-500" />
            <span className="text-xs font-mono text-zinc-400">log://inference_engine_stdout</span>
          </div>
          <div className="p-4 font-mono text-sm overflow-y-auto flex-1 h-[400px]">
            {scanState === 'IDLE' && (
              <p className="text-zinc-600">Waiting for target acquisition...</p>
            )}
            
            {scanState === 'LOADING' && (
              <div className="space-y-2">
                <p className="text-blue-400 animate-pulse">&gt; Establishing secure uplink to Edge Network...</p>
                <p className="text-zinc-400">&gt; Authenticating compute nodes...</p>
                <p className="text-amber-400">&gt; Connecting to Gemini 1.5 Pro via Supabase Edge...</p>
                <p className="text-zinc-500 text-xs">Waiting for tensor stream...</p>
              </div>
            )}

            {scanState === 'COMPLETE' && (
              <div className="animate-in fade-in duration-500 space-y-4">
                <p className="text-emerald-400">&gt; INFERENCE COMPLETE (3.041s execution)</p>
                
                <div className="bg-zinc-950/50 p-4 rounded border border-zinc-800/80 text-zinc-300 relative group/json">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-zinc-500 text-xs">// RESPONSE PAYLOAD</div>
                    <button onClick={handleCopy} className="text-zinc-500 hover:text-emerald-400 transition-colors">
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                  <pre className="whitespace-pre-wrap text-xs"><span className="text-amber-300">&#123;</span>
  <span className="text-blue-300">"scan_id"</span>: <span className="text-emerald-300">"GEO-994A-21X"</span>,
  <span className="text-blue-300">"timestamp"</span>: <span className="text-emerald-300">"{scanDate}T14:48:21Z"</span>,
  <span className="text-blue-300">"coordinates"</span>: <span className="text-zinc-300">[</span><span className="text-orange-300">-3.4653</span>, <span className="text-orange-300">-62.2159</span><span className="text-zinc-300">]</span>,
  <span className="text-blue-300">"anomaly_metrics"</span>: <span className="text-amber-300">&#123;</span>
    <span className="text-blue-300">"detection_status"</span>: <span className="text-emerald-300">"POSITIVE"</span>,
    <span className="text-blue-300">"primary_classification"</span>: <span className="text-emerald-300">"ILLEGAL_DEFORESTATION_TRACT"</span>,
    <span className="text-blue-300">"confidence_interval"</span>: <span className="text-orange-300">0.984</span>
  <span className="text-amber-300">&#125;</span>,
  <span className="text-blue-300">"clinical_observations"</span>: <span className="text-emerald-300">"High contrast NDVI degradation observed over 4.2 hectares compared to t-30 baseline. Geometric clearing patterns suggest anthropogenic machinery rather than natural event."</span>
<span className="text-amber-300">&#125;</span></pre>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

function DataArchiveTab() {
  const defaultData = [
    { id: 'GEO-994A-21X', date: '2026-04-16', coords: '-3.465, -62.215', classification: 'DEFORESTATION', confidence: 0.98, type: 'critical' },
    { id: 'GEO-993B-19Y', date: '2026-04-15', coords: '14.599, 120.984', classification: 'URBAN_SPRAWL', confidence: 0.84, type: 'warning' },
    { id: 'GEO-992C-88Z', date: '2026-04-12', coords: '-33.868, 151.209', classification: 'ALGAL_BLOOM', confidence: 0.91, type: 'warning' },
    { id: 'GEO-989D-44W', date: '2026-04-10', coords: '35.676, 139.650', classification: 'NONE_DETECTED', confidence: 0.99, type: 'safe' },
    { id: 'GEO-985E-22V', date: '2026-04-05', coords: '64.282, 13.193', classification: 'GLACIAL_RETREAT', confidence: 0.95, type: 'critical' },
  ];

  const [archiveData, setArchiveData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedScan, setSelectedScan] = useState<any | null>(null);
  const [dateFilter, setDateFilter] = useState('');
  
  // Local state for Human-in-the-Loop tracking
  const [verificationStatus, setVerificationStatus] = useState<Record<string, 'pending' | 'verified' | 'rejected'>>({});

  const handleVerify = (e: React.MouseEvent, id: string, status: 'verified' | 'rejected') => {
    e.stopPropagation();
    setVerificationStatus(prev => ({ ...prev, [id]: status }));
  };

  const [isExporting, setIsExporting] = useState(false);

  const handleGeneratePDF = () => {
    setIsExporting(true);
    setTimeout(() => {
      try {
        window.print();
      } catch (e) {
        console.log("PDF generation triggered. Print modal blocked by iframe sandbox, but CSS is loaded.");
      }
      setIsExporting(false);
    }, 1500);
  };

  useEffect(() => {
    async function fetchScans(isBackground = false) {
      if (!isBackground) setLoading(true);
      try {
          // Attempt to fetch from Supabase
          let query = supabase.from('scans').select('*', { count: 'exact' }).order('id', { ascending: false });
          if (dateFilter) {
            query = query.eq('date', dateFilter);
          }

          const { data, error, count } = await query;

          if (error) {
            // Fallback to dummy data if table doesn't exist
             setArchiveData(dateFilter ? defaultData.filter(d => d.date === dateFilter) : defaultData);
          } else if (!data || data.length === 0) {
             // Let it be empty if there are just genuinely no results for that date in Supabase
             
             // UNLESS It's the very first load and completely empty, meaning they probably haven't seeded their DB
             // We do a hacky check to see if we're filtering to avoid wiping default data completely on first load filter attempt
             if (!dateFilter) {
               setArchiveData(defaultData);
             } else {
               setArchiveData([]);
             }
          } else {
            setArchiveData(data);
          }
        } catch (err) {
          setArchiveData(dateFilter ? defaultData.filter(d => d.date === dateFilter) : defaultData);
        } finally {
          if (!isBackground) setLoading(false);
        }
      }
      fetchScans();

      const subscription = supabase
        .channel('schema-db-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'scans' }, (payload) => {
          fetchScans(true);
        })
        .subscribe();

      return () => {
        supabase.removeChannel(subscription);
      };
    }, [dateFilter]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h2 className="text-2xl font-bold tracking-tight">Data Archive</h2>
        <p className="text-zinc-400 text-sm mt-1">Historical spectral analyses and anomaly reports</p>
      </header>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-zinc-900 border border-zinc-800 p-4 rounded-lg gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-emerald-400" />
          <span className="text-zinc-300 font-mono text-sm uppercase tracking-wider hidden sm:inline">Filter:</span>
          <div className="relative flex-1 sm:flex-none">
             <input
               type="date"
               value={dateFilter}
               onChange={(e) => setDateFilter(e.target.value)}
               className="w-full sm:w-auto bg-zinc-950 border border-zinc-800 rounded pl-3 pr-8 py-1.5 text-sm font-mono text-emerald-400 focus:border-emerald-500 outline-none transition-all [color-scheme:dark]"
             />
             {dateFilter && (
               <button onClick={() => setDateFilter('')} className="absolute right-2 top-1.5 text-zinc-500 hover:text-red-400 transition-colors bg-zinc-950 rounded">
                 <X className="h-4 w-4" />
               </button>
             )}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
          <div className="text-zinc-500 font-mono text-xs sm:text-sm flex items-center gap-2">
            <Database className="h-4 w-4 hidden sm:block" />
            {archiveData.length} RECORD(S) YIELDED
          </div>
          
          <button 
            onClick={handleGeneratePDF}
            disabled={isExporting}
            className="w-full sm:w-auto bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 px-4 py-1.5 rounded font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
          >
            {isExporting ? <Activity className="h-3 w-3 animate-spin text-emerald-400" /> : <FileText className="h-3 w-3 text-emerald-400" />}
            {isExporting ? 'Generating PDF...' : 'Export Govt Report'}
          </button>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-400 uppercase tracking-wider font-mono text-xs">
            <tr>
              <th className="px-6 py-4 font-medium">Scan ID</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Coordinates</th>
              <th className="px-6 py-4 font-medium">Classification</th>
              <th className="px-6 py-4 font-medium">Confidence</th>
              <th className="px-6 py-4 font-medium text-center border-l border-zinc-800/50">Verification (HITL)</th>
              <th className="px-6 py-4 font-medium text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50 font-mono text-zinc-300">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-zinc-500">
                  <Activity className="h-4 w-4 animate-spin inline mr-2" /> Synching with Supabase Backend...
                </td>
              </tr>
            ) : archiveData.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-zinc-500">
                  <Activity className="h-4 w-4 inline mr-2 opacity-50" /> No records found for the selected temporal baseline.
                </td>
              </tr>
            ) : archiveData.map((row: any, index: number) => {
              const rowId = row.scan_id || row.id || `temp-${index}`;
              const status = verificationStatus[rowId] || 'pending';
              
              return (
              <tr key={rowId} onClick={() => setSelectedScan(row)} className="hover:bg-zinc-800/20 transition-colors cursor-pointer group">
                <td className="px-6 py-4 text-emerald-400">{row.scan_id || row.id}</td>
                <td className="px-6 py-4 text-zinc-500">{row.date}</td>
                <td className="px-6 py-4">{row.coords}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded text-xs border ${
                    row.type === 'critical' || row.classification === 'DEFORESTATION' ? 'bg-red-900/20 text-red-400 border-red-900/50' :
                    row.type === 'warning' || row.classification === 'URBAN_SPRAWL' ? 'bg-amber-900/20 text-amber-400 border-amber-900/50' :
                    'bg-emerald-900/20 text-emerald-400 border-emerald-900/50'
                  }`}>
                    {row.classification || row.class || 'UNKNOWN'}
                  </span>
                </td>
                <td className="px-6 py-4">{Number(row.confidence ?? row.conf ?? 0).toFixed(2)}</td>
                <td className="px-6 py-4 text-center border-l border-zinc-800/50" onClick={(e) => e.stopPropagation()}>
                   {status === 'pending' && row.classification !== 'NONE_DETECTED' && (
                     <div className="flex items-center justify-center gap-2">
                       <button onClick={(e) => handleVerify(e, rowId, 'verified')} className="p-1 text-zinc-500 hover:text-emerald-400 hover:bg-emerald-400/10 rounded transition-colors" title="Confirm True Positive">
                         <CheckCircle className="h-4 w-4" />
                       </button>
                       <button onClick={(e) => handleVerify(e, rowId, 'rejected')} className="p-1 text-zinc-500 hover:text-amber-500 hover:bg-amber-500/10 rounded transition-colors" title="Flag as False Positive">
                         <XCircle className="h-4 w-4" />
                       </button>
                     </div>
                   )}
                   {status === 'verified' && (
                     <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded flex items-center justify-center gap-1 w-max mx-auto">
                       <CheckCircle className="h-3 w-3" /> VERIFIED
                     </span>
                   )}
                   {status === 'rejected' && (
                     <span className="text-[10px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded flex items-center justify-center gap-1 w-max mx-auto">
                       <XCircle className="h-3 w-3" /> F. POSITIVE
                     </span>
                   )}
                   {(status === 'pending' && row.classification === 'NONE_DETECTED') && (
                     <span className="text-zinc-600 text-xs">-</span>
                   )}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-zinc-500 group-hover:text-emerald-400 transition-colors p-1" onClick={(e) => { e.stopPropagation(); setSelectedScan(row); }}>
                    <Eye className="h-4 w-4 inline" />
                  </button>
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>
      
      <JSONModal isOpen={!!selectedScan} onClose={() => setSelectedScan(null)} data={selectedScan} />
    </div>
  );
}

function ArchitectureTab() {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  const steps = [
    { id: 'trigger', icon: Activity, label: "Trigger Job", desc: "cron_or_client", fullDesc: "Initiates the pipeline either via scheduled cron jobs for continuous background monitoring, or localized client requests via the React interface." },
    { id: 'nasa', icon: Globe, label: "NASA GIBS API", desc: "wmts_ingestion", fullDesc: "Fetches multi-spectral satellite imagery using Web Map Tile Service (WMTS). Automatically handles cloud-cover fallbacks and coordinate bounds." },
    { id: 'edge', icon: Server, label: "Pre-processing", desc: "deno_runtime", fullDesc: "Serverless Deno execution environment. Converts raw coordinates to standardized tile formats, securely manages API keys, and orchestrates the inference payload." },
    { id: 'ai', icon: Brain, label: "AI Inference", desc: "gemini_1_5_pro", highlight: true, fullDesc: "The core engine. Utilizes Gemini 1.5 Pro's massive context window to perform precise Image-to-Text Analysis for zero-shot anomaly detection on the raster." },
    { id: 'db', icon: Database, label: "Data Persistence", desc: "supabase_pg", fullDesc: "Stores metadata, locations, alerts, and classifications. Employs Row Level Security (RLS) and JWT auth to securely separate client and admin concerns." }
  ];

  const getSpecs = (id: string) => {
    switch (id) {
      case 'trigger': return [
         { label: "Environment", value: "Browser / Global Cron" },
         { label: "Cycle Rate", value: "Near Real-Time" },
         { label: "Auth Scope", value: "Session Bearer Token" },
         { label: "Tracing", value: "W3C Trace Context" }
      ];
      case 'nasa': return [
         { label: "Endpoint", value: "gibs.earthdata.nasa.gov" },
         { label: "Resolution", value: "15m - 250m / px" },
         { label: "Format", value: "GeoTIFF / JPEG" },
         { label: "Band", value: "True Color (1,4,3)" }
      ];
      case 'edge': return [
         { label: "Runtime", value: "Deno / TypeScript" },
         { label: "Avg Latency", value: "850ms / scan" },
         { label: "Memory Usage", value: "128 MB Allocated" },
         { label: "Security", value: "Encrypted Secrets Vault" }
      ];
      case 'ai': return [
         { label: "Context Window", value: "1M+ Tokens" },
         { label: "Multimodal", value: "Image-to-Text Analysis" },
         { label: "Prompt Engine", value: "v2.1_waste_detect" },
         { label: "State", value: "Stateless Zero-Shot" }
      ];
      case 'db': return [
         { label: "Engine", value: "PostgreSQL 15" },
         { label: "Isolation", value: "Row-Level Security" },
         { label: "Indexing", value: "B-Tree + GiST Spatial" },
         { label: "Sync", value: "Realtime WebSocket" }
      ];
      default: return [];
    }
  };

  const specs = activeNode ? getSpecs(activeNode) : null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end border-b border-zinc-800 pb-4 gap-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-zinc-400" />
            System Architecture
          </h2>
          <p className="text-zinc-500 text-sm mt-2 font-mono uppercase tracking-widest text-[11px] leading-relaxed max-w-xl">
             "Separation of Concerns principle: Frontend handles visualization, while heavy computing & orchestration run on Supabase Edge. Globally scalable, secure, and zero browser load."
          </p>
        </div>

        {/* Live Systems Monitor */}
        <div className="flex flex-col gap-1.5 items-start lg:items-end p-3 rounded-lg border border-zinc-800/80 bg-[#0a0a0a] min-w-[200px] shadow-inner">
           <div className="flex justify-between items-center w-full gap-4 text-[10px] uppercase font-mono tracking-widest text-zinc-300">
              <span>NASA API</span>
              <div className="flex items-center gap-1.5 text-emerald-400">
                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> ONLINE
              </div>
           </div>
           <div className="flex justify-between items-center w-full gap-4 text-[10px] uppercase font-mono tracking-widest text-zinc-300">
              <span>SUPABASE DB</span>
              <div className="flex items-center gap-1.5 text-emerald-400">
                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> HEALTHY
              </div>
           </div>
           <div className="flex justify-between items-center w-full gap-4 text-[10px] uppercase font-mono tracking-widest text-zinc-300 pt-1 mt-1 border-t border-zinc-800/50">
              <span className="text-white">GEMINI AI</span>
              <div className="flex items-center gap-1.5 text-emerald-400">
                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]"></span> ACTIVE
              </div>
           </div>
        </div>
      </header>

      <div className="bg-[#0a0a0a] border border-zinc-800/80 rounded-xl p-4 sm:p-8 md:p-10 relative overflow-hidden shadow-base">
        {/* Background grid */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:20px_20px] pointer-events-none"></div>

        {/* Horizontal scroll container for the diagram to survive 5 steps */}
        <div className="w-full overflow-x-auto pb-8 custom-scrollbar">
          <div className="flex items-center min-w-[1050px] justify-between mx-auto gap-4 relative z-10 w-full mb-4 px-2 pt-2">
            
            {/* Connector Line */}
            <div className="absolute top-[43%] left-12 right-12 h-[1px] bg-zinc-800/80 -z-10">
              {/* Animated Data Packets / Shimmer */}
              <div className="absolute top-0 left-0 w-full h-[1px] overflow-hidden">
                 <div className="h-[1px] w-1/4 bg-gradient-to-r from-transparent via-emerald-500/80 to-transparent animate-[shimmer_2s_infinite_linear]"></div>
              </div>
              <div className="absolute top-0 left-0 w-full h-[1px] overflow-hidden rotate-180">
                 <div className="h-[1px] w-1/5 bg-gradient-to-r from-transparent via-zinc-500/50 to-transparent animate-[shimmer_3s_infinite_linear_reverse]"></div>
              </div>
            </div>

            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <ArchNode 
                  icon={step.icon} 
                  label={step.label} 
                  desc={step.desc} 
                  highlight={step.highlight} 
                  active={activeNode === step.id}
                  onClick={() => setActiveNode(activeNode === step.id ? null : step.id)}
                />
              </React.Fragment>
            ))}

          </div>
        </div>
        
        <div className="max-w-5xl mx-auto rounded border border-zinc-800/60 bg-black/60 shadow-inner overflow-hidden flex flex-col font-mono text-[13px] text-zinc-400 relative transition-all duration-300">
           {/* Terminal Header */}
           <div className="bg-zinc-900/80 border-b border-zinc-800/60 px-4 py-2 flex items-center justify-between text-[10px]">
              <div className="flex gap-2">
                 <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
                 <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/50"></div>
                 <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/50"></div>
              </div>
              <span className="text-zinc-500 pr-2 tracking-widest uppercase">sys_spec_viewer.exe</span>
           </div>

           <div className="p-6 md:p-8 min-h-[220px]">
          {activeNode && specs ? (
            <div className="animate-in fade-in duration-300 flex flex-col md:flex-row items-start gap-6">
              <div className="mt-1 flex-shrink-0 hidden sm:block">
                 <div className={`p-3 border rounded shadow-inner flex items-center justify-center ${steps.find(s => s.id === activeNode)?.highlight ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-zinc-800/30 text-zinc-400 border-zinc-700/50'}`}>
                     {React.createElement(steps.find(s => s.id === activeNode)?.icon || Info, { className: "h-6 w-6" })}
                 </div>
              </div>
              <div className="flex-1 w-full">
                <div className="flex items-center gap-2 mb-4">
                  <span className={`${steps.find(s => s.id === activeNode)?.highlight ? 'text-emerald-400 text-shadow-glow' : 'text-zinc-100'} font-bold tracking-widest uppercase text-[11px] sm:text-xs`}>&gt; {steps.find(s => s.id === activeNode)?.label}_DETAILS</span>
                  <span className={`w-2 h-4 block animate-pulse ${steps.find(s => s.id === activeNode)?.highlight ? 'bg-emerald-400/50' : 'bg-zinc-400/50'}`}></span>
                </div>
                <p className="text-zinc-400/90 leading-relaxed max-w-3xl text-justify mb-8 text-[13px] tracking-wide">
                  {steps.find(s => s.id === activeNode)?.fullDesc}
                </p>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 border-t border-zinc-800/50 pt-6 text-[10px]">
                   {specs.map((spec, i) => (
                     <div key={i} className="bg-zinc-900/30 p-3 rounded border border-zinc-800/50">
                        <span className="block text-zinc-500 uppercase tracking-wider mb-1">{spec.label}</span>
                        <span className={`${steps.find(s => s.id === activeNode)?.highlight && spec.label.includes('Context Window') ? 'text-emerald-400 font-bold' : 'text-zinc-300'} font-semibold`}>{spec.value}</span>
                     </div>
                   ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in duration-300">
               <div className="text-[11px] mb-6 text-zinc-500 block font-bold border-b border-zinc-800/50 pb-2">
                  ## EXECUTING SYSTEM TRACE ROUTINE...
               </div>
              <div className="space-y-4 text-[12px] sm:text-[13px]">
                 <p className="hover:text-zinc-200 transition-colors cursor-default flex items-start gap-3">
                    <span className="text-emerald-500/80 bg-emerald-500/10 px-1 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">01</span> 
                    <span>Trigger Mechanism fires (automated cron job or client invocation via UI).</span>
                 </p>
                 <p className="hover:text-zinc-200 transition-colors cursor-default flex items-start gap-3">
                    <span className="text-emerald-500/80 bg-emerald-500/10 px-1 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">02</span> 
                    <span>NASA GIBS API intercepts request and streams targeted high-res imagery swaths.</span>
                 </p>
                 <p className="hover:text-zinc-200 transition-colors cursor-default flex items-start gap-3">
                    <span className="text-emerald-500/80 bg-emerald-500/10 px-1 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">03</span> 
                    <span>Edge Functions (Deno) preprocess structural data, injecting encrypted keys.</span>
                 </p>
                 <p className="hover:text-zinc-200 transition-colors cursor-default flex items-start gap-3">
                    <span className="text-emerald-500/80 bg-emerald-500/10 px-1 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">04</span> 
                    <span>Multimodal Inference (Gemini 1.5 Pro) evaluates the compiled tensors synchronously.</span>
                 </p>
                 <p className="hover:text-zinc-200 transition-colors cursor-default flex items-start gap-3">
                    <span className="text-emerald-500/80 bg-emerald-500/10 px-1 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">05</span> 
                    <span>Supabase Postgres stores relational findings with row-level security enabled.</span>
                 </p>
              </div>
              <div className="mt-8 text-[11px] text-emerald-500/80 animate-pulse font-bold tracking-widest uppercase">_ Waiting for node selection...</div>
            </div>
          )}
          </div>
        </div>

        {/* Database Schema Overview */}
        <div className="mt-14 w-full max-w-5xl mx-auto pt-8 border-t border-zinc-800/60">
            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-widest mb-6 flex items-center gap-2">
               <Database className="h-4 w-4 text-emerald-400" /> Relational Schema Overview
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border border-zinc-800/80 rounded bg-black/60 overflow-hidden shadow-inner hover:border-zinc-700 transition-colors">
                   <div className="bg-zinc-900 border-b border-zinc-800/80 px-3 py-2 text-[11px] font-mono text-zinc-300 font-bold uppercase tracking-widest flex justify-between">
                     <span>Table: locations</span>
                   </div>
                   <div className="p-3 text-[10px] sm:text-[11px] font-mono text-zinc-400 space-y-1.5">
                      <div className="flex justify-between border-b border-zinc-800/50 pb-1"><span>id</span><span className="text-blue-400 uppercase">UUID (PK)</span></div>
                      <div className="flex justify-between border-b border-zinc-800/50 pb-1"><span>coordinates</span><span className="text-zinc-500 uppercase">JSONB</span></div>
                      <div className="flex justify-between border-b border-zinc-800/50 pb-1"><span>satellite_img</span><span className="text-zinc-500 uppercase">TEXT</span></div>
                      <div className="flex justify-between pb-1"><span>scanned_at</span><span className="text-zinc-500 uppercase">TIMESTAMPTZ</span></div>
                   </div>
                </div>
                <div className="border border-zinc-800/80 rounded bg-black/60 overflow-hidden shadow-inner hover:border-zinc-700 transition-colors">
                   <div className="bg-zinc-900 border-b border-zinc-800/80 px-3 py-2 text-[11px] font-mono text-zinc-300 font-bold uppercase tracking-widest flex justify-between">
                     <span>Table: alerts</span>
                   </div>
                   <div className="p-3 text-[10px] sm:text-[11px] font-mono text-zinc-400 space-y-1.5">
                      <div className="flex justify-between border-b border-zinc-800/50 pb-1"><span>id</span><span className="text-blue-400 uppercase">UUID (PK)</span></div>
                      <div className="flex justify-between border-b border-zinc-800/50 pb-1"><span>location_id</span><span className="text-[#a78bfa] uppercase">UUID (FK)</span></div>
                      <div className="flex justify-between border-b border-zinc-800/50 pb-1"><span>confidence</span><span className="text-zinc-500 uppercase">FLOAT</span></div>
                      <div className="flex justify-between border-b border-zinc-800/50 pb-1"><span>classification</span><span className="text-zinc-500 uppercase">VARCHAR</span></div>
                      <div className="flex justify-between pb-1"><span>status</span><span className="text-zinc-500 uppercase">VARCHAR</span></div>
                   </div>
                </div>
                <div className="border border-zinc-800/80 rounded bg-black/60 overflow-hidden shadow-inner hover:border-zinc-700 transition-colors">
                   <div className="bg-zinc-900 border-b border-zinc-800/80 px-3 py-2 text-[11px] font-mono text-zinc-300 font-bold uppercase tracking-widest flex justify-between">
                     <span>Table: spectral_nodes</span>
                   </div>
                   <div className="p-3 text-[10px] sm:text-[11px] font-mono text-zinc-400 space-y-1.5">
                      <div className="flex justify-between border-b border-zinc-800/50 pb-1"><span>id</span><span className="text-blue-400 uppercase">UUID (PK)</span></div>
                      <div className="flex justify-between border-b border-zinc-800/50 pb-1"><span>location_id</span><span className="text-[#a78bfa] uppercase">UUID (FK)</span></div>
                      <div className="flex justify-between border-b border-zinc-800/50 pb-1"><span>band_array</span><span className="text-zinc-500 uppercase">JSONB</span></div>
                      <div className="flex justify-between pb-1"><span>cloud_cover_pct</span><span className="text-zinc-500 uppercase">FLOAT</span></div>
                   </div>
                </div>
            </div>
        </div>

        {/* Tech Stack Badges */}
        <div className="mt-12 pt-6 border-t border-zinc-800/60 flex flex-wrap items-center gap-3 w-full max-w-5xl mx-auto">
            <span className="px-3 py-1.5 border border-zinc-800 rounded bg-zinc-900/60 text-zinc-400 text-[10px] font-mono tracking-widest uppercase flex items-center gap-2 hidden md:flex">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-500"></span> STACK
            </span>
            <span className="px-3 py-1.5 border border-zinc-800 hover:border-zinc-600 transition-colors rounded bg-zinc-950/80 text-zinc-300 text-[10px] font-mono tracking-normal uppercase">Frontend: Vite + React 19 + TS</span>
            <span className="px-3 py-1.5 border border-zinc-800 hover:border-zinc-600 transition-colors rounded bg-zinc-950/80 text-zinc-300 text-[10px] font-mono tracking-normal uppercase">Styling: Tailwind CSS</span>
            <span className="px-3 py-1.5 border border-zinc-800 hover:border-zinc-600 transition-colors rounded bg-zinc-950/80 text-zinc-300 text-[10px] font-mono tracking-normal uppercase">Backend: Supabase (PostgreSQL)</span>
            <span className="px-3 py-1.5 border border-zinc-800 hover:border-zinc-600 transition-colors rounded bg-zinc-950/80 text-zinc-300 text-[10px] font-mono tracking-normal uppercase">Infra: Vercel / Edge</span>
        </div>

      </div>
    </div>
  );
}

function ArchNode({ icon: Icon, label, desc, highlight, active, onClick }: { icon: React.ElementType, label: string, desc: string, highlight?: boolean, active?: boolean, onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={`flex-shrink-0 group relative flex flex-col items-center justify-center p-6 rounded-lg border w-48 text-center cursor-pointer transition-all duration-300
        ${active ? 'bg-[#0f0f0f] border-zinc-500 scale-105 z-10 shadow-[0_10px_40px_rgba(0,0,0,0.5)]' : 'bg-black/60 border-zinc-800/80 hover:bg-zinc-900/80 hover:border-zinc-600'}
        ${highlight && active ? 'border-emerald-500/60 bg-emerald-950/20 shadow-[0_0_30px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/20' : ''}
        ${highlight && !active ? 'border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.05)] hover:border-emerald-500/60 hover:bg-emerald-950/10' : ''}
      `}
    >
      {/* High-Tech Corner UI Brackets */}
      <div className={`absolute top-0 left-0 w-2 h-2 border-t border-l opacity-0 group-hover:opacity-100 transition-opacity ${highlight ? 'border-emerald-500' : 'border-zinc-400'}`}></div>
      <div className={`absolute top-0 right-0 w-2 h-2 border-t border-r opacity-0 group-hover:opacity-100 transition-opacity ${highlight ? 'border-emerald-500' : 'border-zinc-400'}`}></div>
      <div className={`absolute bottom-0 left-0 w-2 h-2 border-b border-l opacity-0 group-hover:opacity-100 transition-opacity ${highlight ? 'border-emerald-500' : 'border-zinc-400'}`}></div>
      <div className={`absolute bottom-0 right-0 w-2 h-2 border-b border-r opacity-0 group-hover:opacity-100 transition-opacity ${highlight ? 'border-emerald-500' : 'border-zinc-400'}`}></div>

      {active && (
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none rounded-lg" />
      )}

      <div className={`relative p-3.5 rounded-full mb-4 transition-colors duration-300 ${highlight ? 'bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20' : 'bg-zinc-800/40 text-zinc-400 group-hover:text-zinc-200 group-hover:bg-zinc-700/80'}`}>
         {highlight && (
           <div className="absolute inset-0 border border-emerald-500/30 rounded-full animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
         )}
         <Icon className="h-6 w-6 relative z-10" />
      </div>
      
      <h4 className={`font-bold tracking-wider text-[12px] uppercase transition-colors ${active ? (highlight ? 'text-emerald-400' : 'text-white') : 'text-zinc-300'}`}>
         {label}
      </h4>
      <p className="text-[10px] text-zinc-500 font-mono mt-1.5 opacity-80 group-hover:opacity-100 transition-opacity uppercase tracking-wider">{desc}</p>
      
      {/* Simulation status indicator footer */}
      <div className={`mt-5 pt-3 border-t border-zinc-800/60 w-full flex justify-between px-3 text-[8px] font-mono transition-all duration-300 ${active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'}`}>
         <span className="text-zinc-500 font-semibold tracking-widest">STATE</span>
         <span className="text-emerald-500/90 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> OK
         </span>
      </div>
    </div>
  );
}
