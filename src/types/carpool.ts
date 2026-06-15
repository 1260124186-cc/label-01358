export type TripStatus = 'recruiting' | 'full' | 'departed' | 'completed'

export type SeatStatus = 'free' | 'occupied' | 'pending'

export type SeatPosition = 'driver' | 'front_passenger' | 'rear_left' | 'rear_middle' | 'rear_right' | 'third_row_left' | 'third_row_middle' | 'third_row_right'

export interface SeatInfo {
  position: SeatPosition
  label: string
  status: SeatStatus
  memberId?: string
  memberName?: string
  memberAvatar?: string
}

export interface SeatConfig {
  totalSeats: number
  driverAvailable: boolean
  frontPassengerAvailable: boolean
  luggageSpace: string
}

export interface TripMember {
  id: string
  name: string
  avatar: string
  phone: string
  status: 'confirmed' | 'pending' | 'owner'
  seatPosition?: SeatPosition
  joinTime: number
}

export interface TripInfo {
  id: string
  departure: string
  destination: string
  departureTime: number
  pricePerPerson: number
  costSharing: string
  seatConfig: SeatConfig
  seats: SeatInfo[]
  members: TripMember[]
  status: TripStatus
  remark: string
  publisherId: string
  publisherName: string
  publisherAvatar: string
  contactPhone: string
  wechatId: string
  verified: boolean
  views: number
  createTime: number
  departureReminderSent: boolean
}

export interface TripFormData {
  departure: string
  destination: string
  departureTime: string
  pricePerPerson: string
  costSharing: string
  seatConfig: SeatConfig
  remark: string
  contactName: string
  contactPhone: string
  wechatId: string
}

export const TRIP_STATUS_MAP: Record<TripStatus, { label: string; color: string }> = {
  recruiting: { label: '招募中', color: '#14b8a6' },
  full: { label: '已满员', color: '#f59e0b' },
  departed: { label: '已出发', color: '#0ea5e9' },
  completed: { label: '已完成', color: '#86909c' }
}

export const SEAT_STATUS_MAP: Record<SeatStatus, { label: string; color: string }> = {
  free: { label: '空闲', color: '#14b8a6' },
  occupied: { label: '已占', color: '#86909c' },
  pending: { label: '待确认', color: '#f59e0b' }
}

export const COST_SHARING_OPTIONS = ['AA分摊', '包车均摊', '车主承担', '面议']

export const LUGGAGE_SPACE_OPTIONS = ['无行李空间', '小型行李箱', '中型行李箱', '大型行李箱', '超大后备箱']
