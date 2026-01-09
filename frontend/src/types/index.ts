export enum AttendeeType {
  BUYER = 'buyer',
  SELLER = 'seller',
  PARTNER = 'partner',
  GOV = 'government',
  OEM = 'OEM'
}

export enum BookingStatus {
  DRAFT = 'Draft',
  REQUESTED = 'Requested',
  VERIFIED = 'Verified',
  ACCEPTED = 'Accepted',
  REJECTED = 'Rejected',
  CANCELLED = 'Cancelled',
  RESCHEDULE_PROPOSED = 'Reschedule Proposed'
}

export interface AttendeeProfile {
  id: string;
  name: string;
  email?: string; // Đã thêm trường này
  attendee_type: AttendeeType;
  company: string;
  role_title: string;
  industries: string[];
  interests: string[];
  intent: string;
  preferred_meeting_duration: 15 | 30;
  avatar_url?: string;
  meet_me_location?: string;
  isAdmin?: boolean;
}

export interface Booking {
  id: string;
  fromId: string;
  toId: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  notes?: string;
  location?: string;
  responseMessage?: string;
  alternativeSlot?: string;
  createdAt: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}