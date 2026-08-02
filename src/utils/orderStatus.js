export const ORDER_STATUSES = [
  'awaiting_whatsapp',
  'confirmed',
  'preparing',
  'ready',
  'out_for_delivery',
  'delivered',
  'cancelled',
  'expired',
]

export const ORDER_STATUS_LABELS = {
  awaiting_whatsapp: 'À confirmer sur WhatsApp',
  confirmed: 'Confirmée',
  preparing: 'En préparation',
  ready: 'Prête',
  out_for_delivery: 'En livraison',
  delivered: 'Livrée',
  cancelled: 'Annulée',
  expired: 'Expirée',
}

export const ORDER_STATUS_TONES = {
  awaiting_whatsapp: 'warning',
  confirmed: 'info',
  preparing: 'info',
  ready: 'success',
  out_for_delivery: 'info',
  delivered: 'success',
  cancelled: 'danger',
  expired: 'muted',
}

export const PAYMENT_STATUS_LABELS = {
  unpaid: 'Non payé',
  paid: 'Payé',
  refunded: 'Remboursé',
}

export const ORDER_STATUS_TRANSITIONS = {
  awaiting_whatsapp: ['confirmed', 'cancelled', 'expired'],
  confirmed: ['preparing', 'cancelled'],
  preparing: ['ready', 'cancelled'],
  ready: ['out_for_delivery', 'delivered', 'cancelled'],
  out_for_delivery: ['delivered', 'cancelled'],
  delivered: [],
  cancelled: ['confirmed'],
  expired: ['confirmed'],
}

const ORDER_DATE_FORMATTER = new Intl.DateTimeFormat('fr-GN', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'Africa/Conakry',
  })

export const formatOrderDate = (value) => {
  if (!value) return 'Date inconnue'
  const normalized = /(?:Z|[+-]\d\d:\d\d)$/.test(value)
    ? value
    : `${value.replace(' ', 'T')}Z`
  const date = new Date(normalized)
  return Number.isNaN(date.getTime())
    ? 'Date inconnue'
    : ORDER_DATE_FORMATTER.format(date)
}

export const formatOrderDay = (value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return 'Date non précisée'
  return new Intl.DateTimeFormat('fr-GN', {
    dateStyle: 'long',
    timeZone: 'Africa/Conakry',
  }).format(new Date(`${value}T12:00:00Z`))
}
