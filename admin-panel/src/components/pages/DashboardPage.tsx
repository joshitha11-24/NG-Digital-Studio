import React, { useEffect, useState } from 'react';
import { 
  CalendarCheck2, 
  Clock, 
  CheckCircle, 
  CheckCircle2, 
  TrendingUp, 
  AlertCircle,
  RefreshCw,
  BarChart3,
  LineChart as LineChartIcon,
  IndianRupee,
  Layers,
  ArrowRight,
  Calendar,
  ChevronRight,
  Info,
  SlidersHorizontal,
  XCircle,
  Ban
} from 'lucide-react';
import { 
  api, 
  StudioAnalyticsData, 
  MonthlyBookingRecord, 
  MonthlyRevenueRecord, 
  TwoMonthComparisonData, 
  DataValidationSummary 
} from '../../services/api';
import { firestoreAdminService } from '../../services/firestoreAdmin';
import { AdminTab } from '../AdminSidebar';

interface DashboardPageProps {
  onNavigateTab: (tab: AdminTab) => void;
}

// -------------------------------------------------------------
// Interactive SVG Line Chart Component
// -------------------------------------------------------------
interface LineChartProps {
  data: { label: string; value: number; secondaryText?: string }[];
  valuePrefix?: string;
  valueSuffix?: string;
  color?: string;
  gradientId: string;
  height?: number;
  emptyMessage?: string;
}

const InteractiveLineChart: React.FC<LineChartProps> = ({
  data,
  valuePrefix = '',
  valueSuffix = '',
  color = '#d4af37',
  gradientId,
  height = 220,
  emptyMessage = 'No monthly records available'
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div 
        style={{ height }} 
        className="flex flex-col items-center justify-center bg-[#0d0d12]/60 rounded-xl border border-neutral-800/80 p-6 text-center"
      >
        <LineChartIcon className="w-8 h-8 text-neutral-600 mb-2" />
        <p className="text-xs text-neutral-400 font-medium">{emptyMessage}</p>
        <p className="text-[11px] text-neutral-500 mt-1">Bookings submitted in the system will automatically plot here.</p>
      </div>
    );
  }

  const paddingLeft = 55;
  const paddingRight = 35;
  const paddingTop = 25;
  const paddingBottom = 40;
  const chartWidth = 600;
  const chartHeight = height;

  const maxVal = Math.max(...data.map(d => d.value), 1);
  const minVal = 0;
  const range = maxVal - minVal;

  const usableWidth = chartWidth - paddingLeft - paddingRight;
  const usableHeight = chartHeight - paddingTop - paddingBottom;

  const getX = (idx: number) => {
    if (data.length <= 1) return paddingLeft + usableWidth / 2;
    return paddingLeft + (idx / (data.length - 1)) * usableWidth;
  };

  const getY = (val: number) => {
    return paddingTop + usableHeight - ((val - minVal) / range) * usableHeight;
  };

  const points = data.map((d, i) => ({
    x: getX(i),
    y: getY(d.value),
    label: d.label,
    value: d.value,
    secondaryText: d.secondaryText
  }));

  const pointsString = points.map(p => `${p.x},${p.y}`).join(' ');

  // Create smooth area path
  const areaPath = `M ${points[0].x},${paddingTop + usableHeight} ` +
    points.map(p => `L ${p.x},${p.y}`).join(' ') +
    ` L ${points[points.length - 1].x},${paddingTop + usableHeight} Z`;

  // Grid line ticks
  const gridTicks = [0, 0.33, 0.66, 1].map(frac => {
    const val = Math.round(minVal + frac * range);
    return { val, y: getY(val) };
  });

  return (
    <div className="relative w-full overflow-hidden select-none">
      <svg 
        viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
        className="w-full h-auto overflow-visible"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.32" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal Gridlines */}
        {gridTicks.map((tick, i) => (
          <g key={i}>
            <line
              x1={paddingLeft}
              y1={tick.y}
              x2={chartWidth - paddingRight}
              y2={tick.y}
              stroke="#20202d"
              strokeDasharray="3 3"
              strokeWidth="1"
            />
            <text
              x={paddingLeft - 8}
              y={tick.y + 3}
              textAnchor="end"
              fill="#6b7280"
              fontSize="9"
              fontFamily="sans-serif"
            >
              {valuePrefix}{tick.val >= 1000 ? `${(tick.val / 1000).toFixed(0)}k` : tick.val}{valueSuffix}
            </text>
          </g>
        ))}

        {/* Area under line */}
        <path d={areaPath} fill={`url(#${gradientId})`} />

        {/* Main Line */}
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={pointsString}
        />

        {/* Interactive Dots and Labels */}
        {points.map((p, i) => {
          const isHovered = hoveredIdx === i;
          return (
            <g 
              key={i}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <circle cx={p.x} cy={p.y} r="16" fill="transparent" />
              <circle
                cx={p.x}
                cy={p.y}
                r={isHovered ? '6' : '3.5'}
                fill="#121217"
                stroke={color}
                strokeWidth={isHovered ? '3' : '2'}
                className="transition-all duration-200"
              />
              <text
                x={p.x}
                y={chartHeight - 12}
                textAnchor="middle"
                fill={isHovered ? '#ffffff' : '#888899'}
                fontSize="9.5"
                fontWeight={isHovered ? '600' : '400'}
                fontFamily="sans-serif"
              >
                {p.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Floating Tooltip */}
      {hoveredIdx !== null && points[hoveredIdx] && (
        <div 
          className="absolute z-20 pointer-events-none px-3 py-2 rounded-xl bg-[#181824] border border-[#d4af37]/60 shadow-2xl text-left transform -translate-x-1/2 -translate-y-full"
          style={{
            left: `${(points[hoveredIdx].x / chartWidth) * 100}%`,
            top: `${(points[hoveredIdx].y / chartHeight) * 100 - 10}%`
          }}
        >
          <p className="text-[10px] text-neutral-400 font-medium">{points[hoveredIdx].label}</p>
          <p className="text-xs font-bold text-white flex items-center gap-1.5 mt-0.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
            {valuePrefix}{points[hoveredIdx].value.toLocaleString('en-IN')}{valueSuffix}
          </p>
          {points[hoveredIdx].secondaryText && (
            <p className="text-[10px] text-neutral-400 mt-0.5 border-t border-neutral-800 pt-0.5">
              {points[hoveredIdx].secondaryText}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

// -------------------------------------------------------------
// Two-Month Comparative Side-by-Side Bar Chart Component
// -------------------------------------------------------------
interface ComparativeBarChartProps {
  labelA: string;
  valA: number;
  labelB: string;
  valB: number;
  title: string;
  unit: string;
  prefix?: string;
  colorA?: string;
  colorB?: string;
}

const ComparativeBarChart: React.FC<ComparativeBarChartProps> = ({
  labelA,
  valA,
  labelB,
  valB,
  title,
  unit,
  prefix = '',
  colorA = '#38bdf8',
  colorB = '#d4af37'
}) => {
  const maxVal = Math.max(valA, valB, 1);
  const pctA = Math.max((valA / maxVal) * 100, 3);
  const pctB = Math.max((valB / maxVal) * 100, 3);

  return (
    <div className="bg-[#14141d] border border-neutral-800 rounded-xl p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider">{title}</h4>
        <span className="text-[11px] text-neutral-400">Comparison Bar Chart</span>
      </div>

      <div className="space-y-4">
        {/* Month A Bar */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colorA }} />
              <span className="font-semibold text-neutral-200">{labelA}</span>
            </div>
            <span className="font-bold text-white">
              {prefix}{valA.toLocaleString('en-IN')} <span className="text-[10px] text-neutral-400 font-normal">{unit}</span>
            </span>
          </div>
          <div className="w-full h-4 bg-[#1a1a26] rounded-full overflow-hidden border border-neutral-800">
            <div 
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${pctA}%`, backgroundColor: colorA }}
            />
          </div>
        </div>

        {/* Month B Bar */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colorB }} />
              <span className="font-semibold text-neutral-200">{labelB}</span>
            </div>
            <span className="font-bold text-white">
              {prefix}{valB.toLocaleString('en-IN')} <span className="text-[10px] text-neutral-400 font-normal">{unit}</span>
            </span>
          </div>
          <div className="w-full h-4 bg-[#1a1a26] rounded-full overflow-hidden border border-neutral-800">
            <div 
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${pctB}%`, backgroundColor: colorB }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Main Data Analytics Dashboard Component
// -------------------------------------------------------------
export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigateTab }) => {
  const [data, setData] = useState<StudioAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Selected comparison months
  const [selectedMonthA, setSelectedMonthA] = useState<string>('');
  const [selectedMonthB, setSelectedMonthB] = useState<string>('');

  const fetchAnalytics = async (monthA?: string, monthB?: string, isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      else setRefreshing(true);

      // Fetch live bookings from Cloud Firestore
      let res: StudioAnalyticsData;
      try {
        const liveBookings = await firestoreAdminService.getLiveBookings();
        res = firestoreAdminService.computeLiveAnalytics(liveBookings, monthA || selectedMonthA, monthB || selectedMonthB);
      } catch (firestoreErr) {
        console.warn("Could not query Firestore directly, fallback to API analytics:", firestoreErr);
        res = await api.getStudioAnalytics(monthA, monthB);
      }

      setData(res);
      setError(null);

      // Initialize selected months if not yet set
      if (res.availableMonths && res.availableMonths.length > 0) {
        if (!selectedMonthA || !res.availableMonths.some(m => m.month === selectedMonthA)) {
          const defaultA = res.availableMonths.length >= 2 
            ? res.availableMonths[res.availableMonths.length - 2].month 
            : res.availableMonths[0].month;
          setSelectedMonthA(defaultA);
        }
        if (!selectedMonthB || !res.availableMonths.some(m => m.month === selectedMonthB)) {
          const defaultB = res.availableMonths[res.availableMonths.length - 1].month;
          setSelectedMonthB(defaultB);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to calculate studio data analytics');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics(selectedMonthA, selectedMonthB);

    // Subscribe to live Firestore changes so dashboard updates immediately
    const unsubscribe = firestoreAdminService.subscribeLiveBookings((liveBookings) => {
      const liveRes = firestoreAdminService.computeLiveAnalytics(liveBookings, selectedMonthA, selectedMonthB);
      setData(liveRes);
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [selectedMonthA, selectedMonthB]);

  const handleMonthAChange = (newMonthA: string) => {
    setSelectedMonthA(newMonthA);
    fetchAnalytics(newMonthA, selectedMonthB, true);
  };

  const handleMonthBChange = (newMonthB: string) => {
    setSelectedMonthB(newMonthB);
    fetchAnalytics(selectedMonthA, newMonthB, true);
  };

  // Loading state
  if (loading && !data) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[500px]">
        <div className="w-10 h-10 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
          Processing Studio Data Analytics...
        </p>
        <p className="text-[11px] text-neutral-500 mt-1">
          Validating records, checking duplicate IDs & grouping creation months...
        </p>
      </div>
    );
  }

  // Error state
  if (error || !data) {
    return (
      <div className="p-8 text-center max-w-lg mx-auto my-12 bg-[#121217] border border-red-900/40 rounded-2xl p-6">
        <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
        <h3 className="text-base font-bold text-white mb-1">Data Analytics Engine Error</h3>
        <p className="text-xs text-red-300 mb-4">{error || 'Unable to retrieve database analytics'}</p>
        <button
          onClick={() => fetchAnalytics(selectedMonthA, selectedMonthB)}
          className="px-4 py-2 rounded-xl bg-[#d4af37] hover:bg-[#b8952b] text-xs font-bold text-black transition-all cursor-pointer"
        >
          Retry Analytics Engine
        </button>
      </div>
    );
  }

  const { monthlyBookingAnalysis, monthlyRevenueAnalysis, twoMonthComparison, validationSummary, availableMonths } = data;

  const hasData = validationSummary.validRecordsCount > 0;

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* ------------------------------------------------------------- */}
      {/* HEADER & CONTROLS TOOLBAR                                     */}
      {/* ------------------------------------------------------------- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#121217] p-5 rounded-2xl border border-[#20202a]">
        <div>
          <div className="flex items-center gap-2.5">
            <Layers className="w-4 h-4 text-[#d4af37]" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Studio Data Analytics Dashboard
            </h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-semibold border border-emerald-500/30">
              Validated Real DB Data
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Analyzing {validationSummary.validRecordsCount} valid booking records across {monthlyBookingAnalysis.records.length} active months (confirmed duplicate IDs excluded).
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Refresh Action */}
          <button
            onClick={() => fetchAnalytics(selectedMonthA, selectedMonthB, true)}
            disabled={refreshing}
            className="p-2 rounded-xl bg-[#1c1c27] hover:bg-[#252535] border border-neutral-700 text-neutral-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 text-xs font-medium"
            title="Refresh Data Analytics from Database"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-[#d4af37]' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* EMPTY DATABASE STATE                                          */}
      {/* ------------------------------------------------------------- */}
      {!hasData && (
        <div className="bg-[#121217] border border-[#20202a] rounded-2xl p-8 sm:p-12 text-center max-w-xl mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center mx-auto text-[#d4af37]">
            <Calendar className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-white">No Valid Booking Records in Database</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            The studio database does not contain any valid customer bookings yet. Once clients submit booking inquiries through the customer booking page, monthly booking counts and confirmed booking values will populate automatically.
          </p>
            <button
              onClick={() => onNavigateTab('bookings')}
              className="px-5 py-2.5 rounded-xl btn-gold text-xs font-bold text-black transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Manage Studio Bookings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
        </div>
      )}

      {hasData && (
        <>
          {/* ========================================================= */}
          {/* FEATURE 1: MONTHLY BOOKING ANALYSIS                       */}
          {/* ========================================================= */}
          <div className="bg-[#121217] border border-[#20202a] rounded-2xl p-5 sm:p-7 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-800">
              <div>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                    <LineChartIcon className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Feature 1: Monthly Booking Analysis
                  </h3>
                </div>
                <p className="text-xs text-neutral-400 mt-1">
                  Bookings grouped chronologically by creation month from real database records. Confirmed duplicate records are strictly excluded.
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-xs text-neutral-400">Total Valid Bookings:</span>
                <span className="text-sm font-extrabold text-white px-2.5 py-0.5 rounded-lg bg-blue-500/15 text-blue-400 border border-blue-500/30">
                  {monthlyBookingAnalysis.totalBookings}
                </span>
              </div>
            </div>

            {/* Clearly Defined Booking Statuses Banner */}
            <div className="bg-[#15151f] border border-neutral-800/80 rounded-xl p-4">
              <div className="flex items-center gap-1.5 mb-2.5">
                <Info className="w-3.5 h-3.5 text-blue-400" />
                <h4 className="text-[11px] font-bold text-white uppercase tracking-wider">
                  Defined Booking Statuses & Current Distribution
                </h4>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
                {/* Confirmed */}
                <div className="bg-[#101018] border border-emerald-500/30 rounded-lg p-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-400 font-semibold text-[11px]">Confirmed</span>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="text-base font-extrabold text-white mt-1">
                    {monthlyBookingAnalysis.statusTotals.confirmed}
                  </div>
                  <span className="text-[10px] text-neutral-500 block">Accepted & scheduled</span>
                </div>

                {/* Pending */}
                <div className="bg-[#101018] border border-amber-500/30 rounded-lg p-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-amber-400 font-semibold text-[11px]">Pending</span>
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div className="text-base font-extrabold text-white mt-1">
                    {monthlyBookingAnalysis.statusTotals.pending}
                  </div>
                  <span className="text-[10px] text-neutral-500 block">Awaiting admin review</span>
                </div>

                {/* Completed */}
                <div className="bg-[#101018] border border-purple-500/30 rounded-lg p-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-purple-400 font-semibold text-[11px]">Completed</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                  <div className="text-base font-extrabold text-white mt-1">
                    {monthlyBookingAnalysis.statusTotals.completed}
                  </div>
                  <span className="text-[10px] text-neutral-500 block">Photos/albums delivered</span>
                </div>

                {/* Cancelled */}
                <div className="bg-[#101018] border border-neutral-700 rounded-lg p-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400 font-semibold text-[11px]">Cancelled</span>
                    <Ban className="w-3.5 h-3.5 text-neutral-400" />
                  </div>
                  <div className="text-base font-extrabold text-white mt-1">
                    {monthlyBookingAnalysis.statusTotals.cancelled}
                  </div>
                  <span className="text-[10px] text-neutral-500 block">Client withdrawn</span>
                </div>

                {/* Rejected */}
                <div className="bg-[#101018] border border-red-500/30 rounded-lg p-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-red-400 font-semibold text-[11px]">Rejected</span>
                    <XCircle className="w-3.5 h-3.5 text-red-400" />
                  </div>
                  <div className="text-base font-extrabold text-white mt-1">
                    {monthlyBookingAnalysis.statusTotals.rejected}
                  </div>
                  <span className="text-[10px] text-neutral-500 block">Slot unavailable</span>
                </div>
              </div>
            </div>

            {/* Monthly Booking Counts Line Chart */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="text-neutral-300 font-medium">Monthly Booking Volume Trend</span>
                <span className="text-[11px] text-neutral-500">Points grouped by booking creation month</span>
              </div>
              <InteractiveLineChart
                data={monthlyBookingAnalysis.records.map(r => ({
                  label: r.label,
                  value: r.bookingCount,
                  secondaryText: `Confirmed: ${r.statusBreakdown.confirmed} | Pending: ${r.statusBreakdown.pending} | Completed: ${r.statusBreakdown.completed}`
                }))}
                color="#38bdf8"
                gradientId="monthlyBookingLineGradient"
                valueSuffix=" bookings"
                height={230}
              />
            </div>
          </div>

          {/* ========================================================= */}
          {/* FEATURE 2: MONTHLY REVENUE ANALYSIS                       */}
          {/* ========================================================= */}
          <div className="bg-[#121217] border border-[#20202a] rounded-2xl p-5 sm:p-7 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-800">
              <div>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-[#d4af37]/15 text-[#d4af37]">
                    <IndianRupee className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Feature 2: Monthly Revenue Analysis
                  </h3>
                </div>
                <p className="text-xs text-neutral-400 mt-1">
                  Calculation of monthly confirmed booking values based on confirmed bookings and their stored prices.
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-xs text-neutral-400">Total Confirmed Booking Value:</span>
                <span className="text-sm font-extrabold text-[#d4af37] px-2.5 py-0.5 rounded-lg bg-[#d4af37]/15 border border-[#d4af37]/30">
                  ₹{monthlyRevenueAnalysis.totalConfirmedBookingValue.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Metric Label & Distinction Notice (Strict Requirement) */}
            <div className="bg-[#18150f] border border-[#d4af37]/30 rounded-xl p-4 text-xs text-neutral-300 space-y-1">
              <div className="flex items-center gap-2 text-[#d4af37] font-bold uppercase tracking-wider text-[11px]">
                <Info className="w-3.5 h-3.5 shrink-0" />
                <span>Metric Classification Notice: {monthlyRevenueAnalysis.revenueMetricLabel}</span>
              </div>
              <p className="text-neutral-400 text-[11px] leading-relaxed">
                {monthlyRevenueAnalysis.explanation}
              </p>
            </div>

            {/* Metric Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#15151e] border border-neutral-800 p-4 rounded-xl">
                <span className="text-[11px] text-neutral-400 block uppercase font-semibold">Total Confirmed Value</span>
                <span className="text-xl font-extrabold text-[#d4af37] block mt-1">
                  ₹{monthlyRevenueAnalysis.totalConfirmedBookingValue.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-neutral-500 block mt-0.5">Across all confirmed bookings</span>
              </div>

              <div className="bg-[#15151e] border border-neutral-800 p-4 rounded-xl">
                <span className="text-[11px] text-neutral-400 block uppercase font-semibold">Confirmed Reservations</span>
                <span className="text-xl font-extrabold text-white block mt-1">
                  {monthlyRevenueAnalysis.records.reduce((acc, curr) => acc + curr.confirmedBookingsCount, 0)} Shoots
                </span>
                <span className="text-[10px] text-neutral-500 block mt-0.5">Confirmed or Completed status</span>
              </div>

              <div className="bg-[#15151e] border border-neutral-800 p-4 rounded-xl">
                <span className="text-[11px] text-neutral-400 block uppercase font-semibold">Average Confirmed Shoot Price</span>
                <span className="text-xl font-extrabold text-emerald-400 block mt-1">
                  ₹{(() => {
                    const totalConfirmedCount = monthlyRevenueAnalysis.records.reduce((acc, curr) => acc + curr.confirmedBookingsCount, 0);
                    return totalConfirmedCount > 0 
                      ? Math.round(monthlyRevenueAnalysis.totalConfirmedBookingValue / totalConfirmedCount).toLocaleString('en-IN')
                      : '0';
                  })()}
                </span>
                <span className="text-[10px] text-neutral-500 block mt-0.5">Per confirmed client reservation</span>
              </div>
            </div>

            {/* Monthly Confirmed Booking Value Line Chart */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="text-neutral-300 font-medium">Monthly Confirmed Booking Value (₹)</span>
                <span className="text-[11px] text-[#d4af37] font-semibold">Metric: Confirmed Booking Value</span>
              </div>
              <InteractiveLineChart
                data={monthlyRevenueAnalysis.records.map(r => ({
                  label: r.label,
                  value: r.confirmedBookingValue,
                  secondaryText: `${r.confirmedBookingsCount} confirmed bookings (Avg: ₹${r.averageBookingValue.toLocaleString('en-IN')})`
                }))}
                color="#d4af37"
                gradientId="monthlyRevenueLineGradient"
                valuePrefix="₹"
                height={230}
              />
            </div>
          </div>

          {/* ========================================================= */}
          {/* FEATURE 3: TWO-MONTH COMPARISON                           */}
          {/* ========================================================= */}
          <div className="bg-[#121217] border border-[#20202a] rounded-2xl p-5 sm:p-7 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
              <div>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Feature 3: Two-Month Comparison
                  </h3>
                </div>
                <p className="text-xs text-neutral-400 mt-1">
                  Select any two months to compare booking volumes and corresponding confirmed booking values with absolute differences.
                </p>
              </div>

              {/* Month Selection Dropdowns */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 bg-[#171722] px-3 py-1.5 rounded-xl border border-neutral-800">
                  <span className="text-[11px] text-[#38bdf8] font-bold">Month 1:</span>
                  <select
                    value={selectedMonthA}
                    onChange={(e) => handleMonthAChange(e.target.value)}
                    className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
                  >
                    {availableMonths.map((m) => (
                      <option key={m.month} value={m.month} className="bg-[#171722] text-white">
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>

                <span className="text-xs text-neutral-500 font-bold">vs</span>

                <div className="flex items-center gap-2 bg-[#171722] px-3 py-1.5 rounded-xl border border-neutral-800">
                  <span className="text-[11px] text-[#d4af37] font-bold">Month 2:</span>
                  <select
                    value={selectedMonthB}
                    onChange={(e) => handleMonthBChange(e.target.value)}
                    className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
                  >
                    {availableMonths.map((m) => (
                      <option key={m.month} value={m.month} className="bg-[#171722] text-white">
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Comparison Details & Absolute Differences */}
            {twoMonthComparison ? (
              <div className="space-y-6">
                {/* Absolute Difference Highlight Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Absolute Booking Difference Card */}
                  <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-br from-[#121624] to-[#121217] border border-blue-500/30">
                    <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider block">
                      Booking Count Comparison
                    </span>
                    <div className="mt-2 flex items-baseline justify-between">
                      <div>
                        <span className="text-2xl font-extrabold text-white">
                          {twoMonthComparison.differences.absoluteBookingDiff}{' '}
                          <span className="text-xs font-normal text-neutral-400">Bookings</span>
                        </span>
                        <span className="text-[11px] text-blue-300 font-semibold block mt-0.5">
                          Absolute Difference (|Month 1 - Month 2|)
                        </span>
                      </div>
                      <span className="text-xs px-2.5 py-1 rounded-lg bg-blue-500/15 text-blue-300 font-bold border border-blue-500/30">
                        {twoMonthComparison.differences.bookingHigher === 'Equal'
                          ? 'Identical Volume'
                          : `${twoMonthComparison.differences.bookingHigher} is Higher`}
                      </span>
                    </div>

                    <div className="mt-4 pt-3 border-t border-neutral-800/80 flex justify-between text-xs text-neutral-400">
                      <span>{twoMonthComparison.monthA.label}: <strong className="text-white">{twoMonthComparison.monthA.bookingCount}</strong></span>
                      <span>{twoMonthComparison.monthB.label}: <strong className="text-white">{twoMonthComparison.monthB.bookingCount}</strong></span>
                    </div>
                  </div>

                  {/* Absolute Confirmed Booking Value Difference Card */}
                  <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-br from-[#1c1911] to-[#121217] border border-[#d4af37]/40">
                    <span className="text-[11px] font-semibold text-[#d4af37] uppercase tracking-wider block">
                      Confirmed Booking Value Comparison
                    </span>
                    <div className="mt-2 flex items-baseline justify-between">
                      <div>
                        <span className="text-2xl font-extrabold text-white">
                          ₹{twoMonthComparison.differences.absoluteRevenueDiff.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[11px] text-[#f3e5ab] font-semibold block mt-0.5">
                          Absolute Difference (|Month 1 - Month 2|)
                        </span>
                      </div>
                      <span className="text-xs px-2.5 py-1 rounded-lg bg-[#d4af37]/15 text-[#f3e5ab] font-bold border border-[#d4af37]/30">
                        {twoMonthComparison.differences.revenueHigher === 'Equal'
                          ? 'Equal Value'
                          : `${twoMonthComparison.differences.revenueHigher} is Higher`}
                      </span>
                    </div>

                    <div className="mt-4 pt-3 border-t border-neutral-800/80 flex justify-between text-xs text-neutral-400">
                      <span>{twoMonthComparison.monthA.label}: <strong className="text-[#38bdf8]">₹{twoMonthComparison.monthA.confirmedBookingValue.toLocaleString('en-IN')}</strong></span>
                      <span>{twoMonthComparison.monthB.label}: <strong className="text-[#d4af37]">₹{twoMonthComparison.monthB.confirmedBookingValue.toLocaleString('en-IN')}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Comparative Bar Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Bar Chart 1: Booking Count Comparison */}
                  <ComparativeBarChart
                    labelA={twoMonthComparison.monthA.label}
                    valA={twoMonthComparison.monthA.bookingCount}
                    labelB={twoMonthComparison.monthB.label}
                    valB={twoMonthComparison.monthB.bookingCount}
                    title="1. Booking Count Bar Comparison"
                    unit="bookings"
                    colorA="#38bdf8"
                    colorB="#d4af37"
                  />

                  {/* Bar Chart 2: Confirmed Booking Value Comparison */}
                  <ComparativeBarChart
                    labelA={twoMonthComparison.monthA.label}
                    valA={twoMonthComparison.monthA.confirmedBookingValue}
                    labelB={twoMonthComparison.monthB.label}
                    valB={twoMonthComparison.monthB.confirmedBookingValue}
                    title="2. Confirmed Booking Value Bar Comparison"
                    unit="INR"
                    prefix="₹"
                    colorA="#38bdf8"
                    colorB="#d4af37"
                  />
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-neutral-400">
                Please select two valid months with database records to compare.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
