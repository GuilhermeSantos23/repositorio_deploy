import { getStockLevel, STOCK_LEVEL_TEXT_CLASSES, STOCK_LEVEL_LABELS } from '../../../utils/stockRules';

interface StockStatusBadgeProps {
  quantity: number;
}

function StockStatusBadge({ quantity }: StockStatusBadgeProps) {
  const level = getStockLevel(quantity);

  return (
    <span className={`text-sm font-medium whitespace-nowrap ${STOCK_LEVEL_TEXT_CLASSES[level]}`}>
      {STOCK_LEVEL_LABELS[level]}
    </span>
  );
}

export default StockStatusBadge;