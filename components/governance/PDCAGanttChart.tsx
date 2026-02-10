/**
 * PDCA Gantt Chart Component
 * Visual timeline view of PDCA cycles with filtering capabilities
 */

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Filter,
  ChevronLeft,
  ChevronRight,
  Target,
  Play,
  Search,
  Cog,
  CheckCircle2,
  Pause,
  X,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format, startOfMonth, endOfMonth, addMonths, subMonths, differenceInDays, isWithinInterval, parseISO } from 'date-fns';

// Phase configuration
const PHASES = [
  { id: 'plan', label: 'Plan', icon: Target, color: 'bg-blue-500' },
  { id: 'do', label: 'Do', icon: Play, color: 'bg-green-500' },
  { id: 'check', label: 'Check', icon: Search, color: 'bg-amber-500' },
  { id: 'act', label: 'Act', icon: Cog, color: 'bg-purple-500' },
] as const;

interface PDCACycle {
  id: number;
  cycleNumber: number;
  aiSystemName: string | null;
  phase: 'plan' | 'do' | 'check' | 'act';
  status: 'active' | 'completed' | 'paused';
  startedAt: string;
  completedAt: string | null;
}

interface PDCAGanttChartProps {
  cycles: PDCACycle[];
  onSelectCycle?: (id: number) => void;
  selectedCycleId?: number | null;
}

export default function PDCAGanttChart({
  cycles,
  onSelectCycle,
  selectedCycleId,
}: PDCAGanttChartProps) {
  // Filter state
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed' | 'paused'>('all');
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [viewMonth, setViewMonth] = useState(new Date());
  const [showFilters, setShowFilters] = useState(false);

  // Calculate view range (current month view)
  const viewStart = startOfMonth(viewMonth);
  const viewEnd = endOfMonth(viewMonth);
  const daysInView = differenceInDays(viewEnd, viewStart) + 1;

  // Filter cycles
  const filteredCycles = useMemo(() => {
    return cycles.filter((cycle) => {
      // Status filter
      if (statusFilter !== 'all' && cycle.status !== statusFilter) {
        return false;
      }

      // Date range filter
      if (dateRange.from || dateRange.to) {
        const cycleStart = parseISO(cycle.startedAt);
        const cycleEnd = cycle.completedAt ? parseISO(cycle.completedAt) : new Date();

        if (dateRange.from && dateRange.to) {
          // Check if cycle overlaps with date range
          const rangeStart = dateRange.from;
          const rangeEnd = dateRange.to;
          if (cycleEnd < rangeStart || cycleStart > rangeEnd) {
            return false;
          }
        } else if (dateRange.from) {
          if (cycleEnd < dateRange.from) {
            return false;
          }
        } else if (dateRange.to) {
          if (cycleStart > dateRange.to) {
            return false;
          }
        }
      }

      return true;
    });
  }, [cycles, statusFilter, dateRange]);

  // Calculate bar position and width for each cycle
  const getCycleBarStyle = (cycle: PDCACycle) => {
    const cycleStart = parseISO(cycle.startedAt);
    const cycleEnd = cycle.completedAt ? parseISO(cycle.completedAt) : new Date();

    // Clamp to view range
    const barStart = cycleStart < viewStart ? viewStart : cycleStart;
    const barEnd = cycleEnd > viewEnd ? viewEnd : cycleEnd;

    // Calculate position as percentage
    const startOffset = differenceInDays(barStart, viewStart);
    const duration = differenceInDays(barEnd, barStart) + 1;

    const left = (startOffset / daysInView) * 100;
    const width = (duration / daysInView) * 100;

    // Check if cycle is visible in current view
    const isVisible = barStart <= viewEnd && barEnd >= viewStart;

    return {
      left: `${Math.max(0, left)}%`,
      width: `${Math.min(100 - left, width)}%`,
      isVisible,
    };
  };

  const getPhaseColor = (phase: string) => {
    const phaseConfig = PHASES.find((p) => p.id === phase);
    return phaseConfig?.color || 'bg-gray-500';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 text-xs">Active</Badge>;
      case 'completed':
        return <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 text-xs">Done</Badge>;
      case 'paused':
        return <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300 text-xs">Paused</Badge>;
      default:
        return null;
    }
  };

  const clearFilters = () => {
    setStatusFilter('all');
    setDateRange({ from: undefined, to: undefined });
  };

  const hasActiveFilters = statusFilter !== 'all' || dateRange.from || dateRange.to;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            PDCA Timeline
          </CardTitle>
          <div className="flex items-center gap-2">
            {/* Month Navigation */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMonth(subMonths(viewMonth, 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium min-w-[120px] text-center">
                {format(viewMonth, 'MMMM yyyy')}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMonth(addMonths(viewMonth, 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Filter Toggle */}
            <Button
              variant={showFilters ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-1"
            >
              <Filter className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <span className="ml-1 w-2 h-2 rounded-full bg-primary" />
              )}
            </Button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-4 bg-muted/50 rounded-lg border"
          >
            <div className="flex flex-wrap items-end gap-4">
              {/* Status Filter */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Status</label>
                <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
                  <SelectTrigger className="w-[140px] h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range Filter - From */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">From Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="w-[140px] justify-start h-9">
                      {dateRange.from ? format(dateRange.from, 'MMM d, yyyy') : 'Start date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={dateRange.from}
                      onSelect={(date) => setDateRange((prev) => ({ ...prev, from: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Date Range Filter - To */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">To Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="w-[140px] justify-start h-9">
                      {dateRange.to ? format(dateRange.to, 'MMM d, yyyy') : 'End date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={dateRange.to}
                      onSelect={(date) => setDateRange((prev) => ({ ...prev, to: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9">
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>

            {/* Active Filters Summary */}
            {hasActiveFilters && (
              <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                <span>Showing:</span>
                {statusFilter !== 'all' && (
                  <Badge variant="secondary" className="text-xs">
                    {statusFilter} cycles
                  </Badge>
                )}
                {dateRange.from && (
                  <Badge variant="secondary" className="text-xs">
                    From {format(dateRange.from, 'MMM d')}
                  </Badge>
                )}
                {dateRange.to && (
                  <Badge variant="secondary" className="text-xs">
                    To {format(dateRange.to, 'MMM d')}
                  </Badge>
                )}
                <span className="ml-2">
                  ({filteredCycles.length} of {cycles.length} cycles)
                </span>
              </div>
            )}
          </motion.div>
        )}
      </CardHeader>

      <CardContent>
        {/* Timeline Header - Days */}
        <div className="relative mb-2">
          <div className="flex border-b pb-2">
            <div className="w-48 flex-shrink-0" /> {/* Label column */}
            <div className="flex-1 flex">
              {/* Week markers */}
              {Array.from({ length: Math.ceil(daysInView / 7) }).map((_, weekIndex) => {
                const weekStart = new Date(viewStart);
                weekStart.setDate(weekStart.getDate() + weekIndex * 7);
                return (
                  <div
                    key={weekIndex}
                    className="flex-1 text-xs text-muted-foreground text-center border-l first:border-l-0"
                  >
                    {format(weekStart, 'MMM d')}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Cycle Rows */}
        <div className="space-y-2">
          {filteredCycles.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No cycles match the current filters</p>
              {hasActiveFilters && (
                <Button variant="link" size="sm" onClick={clearFilters} className="mt-2">
                  Clear filters
                </Button>
              )}
            </div>
          ) : (
            filteredCycles.map((cycle) => {
              const barStyle = getCycleBarStyle(cycle);
              const PhaseIcon = PHASES.find((p) => p.id === cycle.phase)?.icon || Target;

              return (
                <motion.div
                  key={cycle.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={cn(
                    'flex items-center group cursor-pointer rounded-lg transition-colors',
                    selectedCycleId === cycle.id
                      ? 'bg-primary/10'
                      : 'hover:bg-muted/50'
                  )}
                  onClick={() => onSelectCycle?.(cycle.id)}
                >
                  {/* Cycle Label */}
                  <div className="w-48 flex-shrink-0 p-2 flex items-center gap-2">
                    <div
                      className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center',
                        getPhaseColor(cycle.phase)
                      )}
                    >
                      <PhaseIcon className="h-4 w-4 text-white" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">
                        Cycle #{cycle.cycleNumber}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {cycle.aiSystemName || 'Unknown'}
                      </div>
                    </div>
                    <div className="ml-auto">
                      {getStatusBadge(cycle.status)}
                    </div>
                  </div>

                  {/* Timeline Bar */}
                  <div className="flex-1 h-10 relative bg-muted/30 rounded-r-lg">
                    {barStyle.isVisible && (
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: barStyle.width }}
                        transition={{ duration: 0.3 }}
                        className={cn(
                          'absolute top-1 bottom-1 rounded',
                          getPhaseColor(cycle.phase),
                          cycle.status === 'paused' && 'opacity-50',
                          cycle.status === 'completed' && 'bg-emerald-500'
                        )}
                        style={{ left: barStyle.left }}
                      >
                        {/* Phase indicator */}
                        <div className="absolute inset-0 flex items-center px-2">
                          <span className="text-xs text-white font-medium truncate">
                            {cycle.phase.toUpperCase()}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">Phases:</span>
            {PHASES.map((phase) => {
              const Icon = phase.icon;
              return (
                <div key={phase.id} className="flex items-center gap-1">
                  <div className={cn('w-3 h-3 rounded', phase.color)} />
                  <span className="text-xs text-muted-foreground">{phase.label}</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">Status:</span>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-emerald-500" />
              <span className="text-xs text-muted-foreground">Completed</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-gray-400 opacity-50" />
              <span className="text-xs text-muted-foreground">Paused</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
