import { Fragment } from 'react'
import { EmptyState } from './EmptyState'

/**
 * @param {{ key: string, header: string, render?: (row: object) => React.ReactNode }[]} columns
 */
export function DataTable({
  columns,
  rows,
  emptyMessage = 'No records found.',
  expandedRowId = null,
  renderExpandedRow,
  isRowExpanded,
}) {
  if (!rows?.length) {
    return <EmptyState message={emptyMessage} />
  }

  const checkExpanded = isRowExpanded ?? ((row) => expandedRowId === row.id)

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const expanded = checkExpanded(row)
            return (
              <Fragment key={row.id ?? JSON.stringify(row)}>
                <tr className={expanded ? 'data-table__row--active' : undefined}>
                  {columns.map((col) => (
                    <td key={col.key}>{col.render ? col.render(row) : row[col.key]}</td>
                  ))}
                </tr>
                {expanded && renderExpandedRow && (
                  <tr className="data-table__expand-row">
                    <td colSpan={columns.length}>{renderExpandedRow(row)}</td>
                  </tr>
                )}
              </Fragment>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
