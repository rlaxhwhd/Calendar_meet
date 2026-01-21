import { nanoid } from 'nanoid';

// 12자리 URL-safe ID 생성
export function generateRoomId(): string {
  return nanoid(12);
}
