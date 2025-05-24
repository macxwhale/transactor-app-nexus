
import React, { useMemo } from "react";
import { FixedSizeList as List } from "react-window";

interface VirtualizedListProps<T> {
  items: T[];
  height: number;
  itemHeight: number;
  renderItem: ({ index, style }: { index: number; style: React.CSSProperties }) => React.ReactNode;
  className?: string;
}

export function VirtualizedList<T>({
  items,
  height,
  itemHeight,
  renderItem,
  className
}: VirtualizedListProps<T>) {
  const memoizedItems = useMemo(() => items, [items]);

  const ItemRenderer = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style}>
      {renderItem({ index, style })}
    </div>
  );

  if (memoizedItems.length === 0) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ height }}>
        <p className="text-muted-foreground">No items to display</p>
      </div>
    );
  }

  return (
    <List
      height={height}
      itemCount={memoizedItems.length}
      itemSize={itemHeight}
      className={className}
    >
      {ItemRenderer}
    </List>
  );
}
