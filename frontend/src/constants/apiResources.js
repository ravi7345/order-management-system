export const RESOURCES = {
  dashboard: 'dashboard',
  orderOptions: 'orderOptions',
}

/** APIs fetched when a view is opened for the first time in a session. */
export const VIEW_RESOURCES = {
  dashboard: [RESOURCES.dashboard],
  orders: [RESOURCES.orderOptions],
}
