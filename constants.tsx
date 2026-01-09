
import { AttendeeProfile, AttendeeType, Booking, BookingStatus } from './types';

export const EVENT_DATES = ['2025-02-20', '2025-02-21', '2025-02-22', '2025-02-23'];
export const EVENT_HOURS = { start: 9, end: 17 }; // 9 AM to 5 PM

export const INDUSTRY_OPTIONS = [
  'Aerospace', 'Defense', 'MRO', 'Sustainable Aviation', 'Avionics', 
  'UAVs', 'Cybersecurity', 'Space Tech', 'Manufacturing', 'Supply Chain', 'R&D'
];

export const INTEREST_OPTIONS = [
  'Networking', 'Procurement', 'Investment', 'Policy', 'Sales', 
  'Strategic Partnerships', 'Digital Transformation', 'Sustainable Fuel'
];

export const MOCK_ATTENDEES: AttendeeProfile[] = [
  {
    id: 'a1',
    name: 'Sarah Chen',
    attendee_type: AttendeeType.BUYER,
    company: 'Singapore Airlines',
    role_title: 'Procurement Director',
    industries: ['Aviation', 'Supply Chain'],
    interests: ['Sustainable Fuel', 'Digital Maintenance'],
    intent: 'Looking for sustainable aviation fuel providers for 2026 contracts.',
    preferred_meeting_duration: 30,
    avatar_url: 'https://picsum.photos/seed/sarah/200/200',
    meet_me_location: 'SIA Corporate Pavilion, Booth A12',
    isAdmin: false
  },
  {
    id: 'a2',
    name: 'Robert Miller',
    attendee_type: AttendeeType.SELLER,
    company: 'SkyPower Systems',
    role_title: 'VP Sales',
    industries: ['Propulsion', 'Defense'],
    interests: ['Electric Engines', 'OEM Partnerships'],
    intent: 'Promoting our new hydrogen-electric propulsion units.',
    preferred_meeting_duration: 15,
    avatar_url: 'https://picsum.photos/seed/robert/200/200',
    meet_me_location: 'Outdoor Display Area, Static P1',
    isAdmin: false
  },
  {
    id: 'a3',
    name: 'Gen. Tan Wei',
    attendee_type: AttendeeType.GOV,
    company: 'MINDEF Singapore',
    role_title: 'Defense Attache',
    industries: ['Defense', 'Security'],
    interests: ['UAVs', 'Cybersecurity'],
    intent: 'Briefing on regional security trends and collaborative exercises.',
    preferred_meeting_duration: 30,
    avatar_url: 'https://picsum.photos/seed/tan/200/200',
    meet_me_location: 'VIP Lounge, Level 2',
    isAdmin: true
  },
  {
    id: 'a4',
    name: 'Elena Rodriguez',
    attendee_type: AttendeeType.OEM,
    company: 'Airbus',
    role_title: 'Strategic Partnerships',
    industries: ['Manufacturing', 'R&D'],
    interests: ['Digital Twins', 'Supply Chain Resilience'],
    intent: 'Identifying innovation partners for next-gen narrow body aircraft.',
    preferred_meeting_duration: 30,
    avatar_url: 'https://picsum.photos/seed/elena/200/200',
    meet_me_location: 'Airbus Innovation Hub, Booth C05',
    isAdmin: false
  }
];

// Dữ liệu mẫu cho các cuộc hẹn gửi đến Gen. Tan Wei (a3)
export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'b1',
    fromId: 'a1', // Sarah Chen
    toId: 'a3',   // Gen. Tan Wei
    startTime: '2025-02-20T10:00:00',
    endTime: '2025-02-20T10:30:00',
    status: BookingStatus.REQUESTED,
    notes: 'Chúng tôi muốn thảo luận về lộ trình cung ứng nhiên liệu bền vững cho các phi đội vận tải quốc phòng.',
    location: 'VIP Lounge - Hall 1',
    createdAt: new Date().toISOString()
  },
  {
    id: 'b2',
    fromId: 'a2', // Robert Miller
    toId: 'a3',   // Gen. Tan Wei
    startTime: '2025-02-20T10:00:00', // Trùng giờ với b1 để test tính năng Conflict
    endTime: '2025-02-20T10:15:00',
    status: BookingStatus.REQUESTED,
    notes: 'Giới thiệu về hệ thống đẩy hybrid mới phù hợp cho các dòng UAV tuần tra biên giới.',
    location: 'Experia Pod B4',
    createdAt: new Date().toISOString()
  },
  {
    id: 'b3',
    fromId: 'a4', // Elena Rodriguez
    toId: 'a3',
    startTime: '2025-02-21T14:00:00',
    endTime: '2025-02-21T14:30:00',
    status: BookingStatus.ACCEPTED, // Một lịch đã được chấp nhận
    notes: 'Trao đổi về việc triển khai Digital Twins trong bảo trì máy bay quân sự.',
    location: 'Meeting Room 202',
    createdAt: new Date().toISOString()
  }
];
