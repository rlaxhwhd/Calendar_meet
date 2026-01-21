import { useState, useEffect, useCallback } from 'react';
import { RoomResponse, ApiResponse } from '@/types';

export function useRoom(roomId: string | undefined, visitorId: string | null) {
  const [room, setRoom] = useState<RoomResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoom = useCallback(async () => {
    if (!roomId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/rooms/${roomId}`, {
        headers: visitorId ? { 'X-Visitor-Id': visitorId } : {},
      });

      const data: ApiResponse<RoomResponse> = await response.json();

      if (data.success && data.data) {
        setRoom(data.data);
      } else {
        setError(data.error || '방을 찾을 수 없습니다.');
      }
    } catch (err) {
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [roomId, visitorId]);

  useEffect(() => {
    fetchRoom();
  }, [fetchRoom]);

  return { room, isLoading, error, refetch: fetchRoom };
}
