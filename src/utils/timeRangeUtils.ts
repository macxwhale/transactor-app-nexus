import { startOfToday, startOfWeek, startOfMonth, startOfYear, subMonths, endOfToday, endOfWeek, endOfMonth, endOfYear } from 'date-fns';

export type TimeRange = 'Today' | 'This Week' | 'This Month' | 'Last 3 Months' | 'This Year';

export interface DateRange {
  startDate: Date;
  endDate: Date;
  previousStartDate: Date;
  previousEndDate: Date;
}

export function getDateRangeFromTimeRange(timeRange: TimeRange): DateRange {
  const now = new Date();
  
  switch (timeRange) {
    case 'Today': {
      const startDate = startOfToday();
      const endDate = endOfToday();
      const previousStartDate = new Date(startDate);
      previousStartDate.setDate(previousStartDate.getDate() - 1);
      const previousEndDate = new Date(endDate);
      previousEndDate.setDate(previousEndDate.getDate() - 1);
      
      return { startDate, endDate, previousStartDate, previousEndDate };
    }
    
    case 'This Week': {
      const startDate = startOfWeek(now, { weekStartsOn: 1 }); // Monday
      const endDate = endOfWeek(now, { weekStartsOn: 1 });
      const previousStartDate = new Date(startDate);
      previousStartDate.setDate(previousStartDate.getDate() - 7);
      const previousEndDate = new Date(endDate);
      previousEndDate.setDate(previousEndDate.getDate() - 7);
      
      return { startDate, endDate, previousStartDate, previousEndDate };
    }
    
    case 'This Month': {
      const startDate = startOfMonth(now);
      const endDate = endOfMonth(now);
      const previousStartDate = startOfMonth(subMonths(now, 1));
      const previousEndDate = endOfMonth(subMonths(now, 1));
      
      return { startDate, endDate, previousStartDate, previousEndDate };
    }
    
    case 'Last 3 Months': {
      const startDate = startOfMonth(subMonths(now, 2));
      const endDate = endOfMonth(now);
      const previousStartDate = startOfMonth(subMonths(now, 5));
      const previousEndDate = endOfMonth(subMonths(now, 3));
      
      return { startDate, endDate, previousStartDate, previousEndDate };
    }
    
    case 'This Year': {
      const startDate = startOfYear(now);
      const endDate = endOfYear(now);
      const previousStartDate = startOfYear(subMonths(now, 12));
      const previousEndDate = endOfYear(subMonths(now, 12));
      
      return { startDate, endDate, previousStartDate, previousEndDate };
    }
    
    default:
      return getDateRangeFromTimeRange('This Week');
  }
}

export function calculateTrend(currentValue: number, previousValue: number): { value: number; positive: boolean } {
  if (previousValue === 0) {
    return { value: currentValue > 0 ? 100 : 0, positive: currentValue > 0 };
  }
  
  const percentageChange = ((currentValue - previousValue) / previousValue) * 100;
  return {
    value: Math.abs(Number(percentageChange.toFixed(1))),
    positive: percentageChange >= 0
  };
}
