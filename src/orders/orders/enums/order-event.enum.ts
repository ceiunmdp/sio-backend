export enum OrderEvent {
  PENDING_ORDERS = 'pending_orders',

  NEW_PENDING_ORDER = 'new_pending_order',
  UPDATED_ORDER = 'updated_order',

  JOIN_ORDER_ROOM = 'join_order_room',
  JOINED_ORDER_ROOM = 'joined_order_room',
  LEAVE_ORDER_ROOM = 'leave_order_room',
  LEFT_ORDER_ROOM = 'left_order_room',
}
