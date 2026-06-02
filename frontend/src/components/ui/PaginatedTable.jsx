import { DataTable } from './DataTable'
import { LoadingOverlay } from './LoadingOverlay'
import { Pagination } from './Pagination'

export function PaginatedTable({
  list,
  columns,
  emptyMessage = 'No records found.',
  loadingMessage = 'Loading…',
  ...tableProps
}) {
  const {
    items,
    page,
    pageSize,
    total,
    totalPages,
    loading,
    setPage,
    setPageSize,
  } = list

  return (
    <div className={`paginated-table${loading ? ' paginated-table--loading' : ''}`}>
      <LoadingOverlay visible={loading && !items.length} label={loadingMessage} />
      <DataTable
        columns={columns}
        rows={items}
        emptyMessage={loading ? loadingMessage : emptyMessage}
        {...tableProps}
      />
      <Pagination
        page={page}
        totalPages={totalPages}
        total={total}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        loading={loading}
      />
    </div>
  )
}
