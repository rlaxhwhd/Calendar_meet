// 투표 상태
export type VoteStatus = 'AVAILABLE' | 'MAYBE';

// 방 상태
export type RoomStatus = 'VOTING' | 'CLOSED' | 'CONFIRMED' | 'EXPIRED';

// 방 정보
export interface Room {
  id: number;
  roomId: string;
  title: string;
  hostNickname: string;
  hostVisitorId: string;
  startDate: string;
  endDate: string;
  maxParticipants: number;
  deadline: string | null;
  status: RoomStatus;
  confirmedDate: string | null;
  createdAt: string;
  updatedAt: string;
}

// 방 조회 응답
export interface RoomResponse {
  roomId: string;
  title: string;
  hostNickname: string;
  startDate: string;
  endDate: string;
  maxParticipants: number;
  currentParticipants: number;
  deadline: string | null;
  status: RoomStatus;
  confirmedDate: string | null;
  isHost: boolean;
  createdAt: string;
}

// 투표 선택
export interface VoteSelection {
  date: string;
  status: VoteStatus;
}

// 투표 데이터
export interface Vote {
  nickname: string;
  isMe: boolean;
  selections: Record<string, VoteStatus>;
}

// 날짜별 집계
export interface DateSummary {
  date: string;
  availableCount: number;
  maybeCount: number;
  totalScore: number;
  participants: string[];
}

// 투표 결과 응답
export interface VotesResponse {
  votes: Vote[];
  summary: {
    topDates: DateSummary[];
    allDates: Record<string, {
      available: number;
      maybe: number;
    }>;
  };
  totalParticipants: number;
}

// API 응답 래퍼
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 방 생성 요청
export interface CreateRoomRequest {
  title: string;
  hostNickname: string;
  hostVisitorId: string;
  startDate: string;
  endDate: string;
  maxParticipants: number;
  deadline?: string;
}

// 투표 제출 요청
export interface SubmitVoteRequest {
  nickname: string;
  visitorId: string;
  selections: Record<string, VoteStatus>;
}
