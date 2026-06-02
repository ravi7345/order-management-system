import { Button } from '../../components/ui/Button'

export function OrderRowActions({
  orderId,
  cancelingOrderId,
  isExpanded,
  onViewDetails,
  onCancel,
}) {
  return (
    <div className="table-actions">
      <Button variant="secondary" onClick={() => onViewDetails(orderId)}>
        {isExpanded ? 'Hide' : 'Details'}
      </Button>
      <Button
        variant="danger"
        loading={cancelingOrderId === orderId}
        onClick={() => onCancel(orderId)}
      >
        Cancel
      </Button>
    </div>
  )
}
