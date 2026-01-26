import { useState, useEffect, useCallback } from 'react';
import { VotesResponse, ApiResponse, VoteStatus } from '@/types';

export function useVote(roomId: string | undefined, visitorId: string | null) {
  const [votes, setVotes] = useState<VotesResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVotes = useCallback(async () => {
    if (!roomId) return;

    setIsLoading(true);
    setError(null);

    try {
      const url = visitorId
        ? `/api/votes/${roomId}?visitorId=${visitorId}`
        : `/api/votes/${roomId}`;

      const response = await fetch(url);
      const data: ApiResponse<VotesResponse> = await response.json();

      if (data.success && data.data) {
        setVotes(data.data);
      } else {
        setError(data.error || '투표 정보를 불러올 수 없습니다.');
      }
    } catch (err) {
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [roomId, visitorId]);

  // 닉네임만 등록 (참가자로 즉시 등록)
  const registerParticipant = useCallback(async (nickname: string) => {
    if (!roomId || !visitorId) return { success: false, error: '잘못된 요청입니다.' };

    try {
      const response = await fetch(`/api/votes/${roomId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname, visitorId, selections: {} }),
      });

      const data = await response.json();

      if (data.success) {
        await fetchVotes();
      }

      return data;
    } catch (err) {
      return { success: false, error: '네트워크 오류가 발생했습니다.' };
    }
  }, [roomId, visitorId, fetchVotes]);

  const submitVote = useCallback(async (
    nickname: string,
    selections: Record<string, VoteStatus>
  ) => {
    if (!roomId || !visitorId) return { success: false, error: '잘못된 요청입니다.' };

    try {
      const response = await fetch(`/api/votes/${roomId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname, visitorId, selections }),
      });

      const data = await response.json();

      if (data.success) {
        await fetchVotes();
      }

      return data;
    } catch (err) {
      return { success: false, error: '네트워크 오류가 발생했습니다.' };
    }
  }, [roomId, visitorId, fetchVotes]);

  const updateVote = useCallback(async (selections: Record<string, VoteStatus>) => {
    if (!roomId || !visitorId) return { success: false, error: '잘못된 요청입니다.' };

    try {
      const response = await fetch(`/api/votes/${roomId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitorId, selections }),
      });

      const data = await response.json();

      if (data.success) {
        await fetchVotes();
      }

      return data;
    } catch (err) {
      return { success: false, error: '네트워크 오류가 발생했습니다.' };
    }
  }, [roomId, visitorId, fetchVotes]);

  useEffect(() => {
    fetchVotes();
  }, [fetchVotes]);

  return { votes, isLoading, error, refetch: fetchVotes, registerParticipant, submitVote, updateVote };
}
