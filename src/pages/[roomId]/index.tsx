import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useVisitorId } from '@/hooks/useVisitorId';
import { useRoom } from '@/hooks/useRoom';
import { useVote } from '@/hooks/useVote';
import { Calendar } from '@/components/calendar/Calendar';
import { VoteStatusSelector } from '@/components/vote/VoteStatus';
import { ParticipantList } from '@/components/vote/ParticipantList';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Toast, useToast } from '@/components/ui/Toast';
import { KakaoShareButton } from '@/components/share/KakaoShareButton';
import { LinkCopyButton } from '@/components/share/LinkCopyButton';
import { VoteStatus } from '@/types';
import { formatDate, parseDate } from '@/utils/date';

export default function VotePage() {
  const router = useRouter();
  const { roomId } = router.query;
  const visitorId = useVisitorId();

  const { room, isLoading: roomLoading, error: roomError } = useRoom(
    roomId as string,
    visitorId
  );
  const { votes, isLoading: votesLoading, registerParticipant, submitVote, updateVote, refetch } = useVote(
    roomId as string,
    visitorId
  );

  // 초기 로딩 완료 여부 (visitorId와 votes가 모두 로드된 후에만 모달 표시)
  const isInitialized = !!visitorId && !votesLoading && !!votes;

  const [showNicknameModal, setShowNicknameModal] = useState(false);
  const [nickname, setNickname] = useState('');
  const [nicknameError, setNicknameError] = useState('');
  const [currentStatus, setCurrentStatus] = useState<VoteStatus>('AVAILABLE');
  const [mySelections, setMySelections] = useState<Record<string, VoteStatus>>({});
  const [hasVoted, setHasVoted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  // 기존 투표 여부 확인
  useEffect(() => {
    // 초기화가 완료되지 않으면 아무것도 하지 않음
    if (!isInitialized || !room) return;

    const myVote = votes.votes.find((v) => v.isMe);

    if (myVote) {
      // 이미 참가자로 등록된 경우
      setHasVoted(true);
      setNickname(myVote.nickname);
      setMySelections(myVote.selections as Record<string, VoteStatus>);
      setShowNicknameModal(false);
    } else if (room.isHost) {
      // 방장인 경우: 자동으로 참가자 등록
      setNickname(room.hostNickname);
      setShowNicknameModal(false);
      // 방장 자동 등록
      registerParticipant(room.hostNickname).then((result) => {
        if (result.success) {
          setHasVoted(true);
          refetch();
        }
      });
    } else {
      // 새 참가자인 경우: 닉네임 입력 모달 표시
      setShowNicknameModal(true);
    }
  }, [isInitialized, votes, room, registerParticipant, refetch]);

  const handleDateClick = (date: Date) => {
    if (!room || room.status !== 'VOTING') return;

    const dateStr = formatDate(date);
    const startDate = parseDate(room.startDate);
    const endDate = parseDate(room.endDate);

    // 범위 체크
    if (date < startDate || date > endDate) return;

    setMySelections((prev) => {
      const current = prev[dateStr];

      if (!current) {
        // 선택 안됨 -> 현재 상태로 설정
        return { ...prev, [dateStr]: currentStatus };
      } else if (current === currentStatus) {
        // 같은 상태 클릭 -> 해제
        const newSelections = { ...prev };
        delete newSelections[dateStr];
        return newSelections;
      } else {
        // 다른 상태 -> 변경
        return { ...prev, [dateStr]: currentStatus };
      }
    });
  };

  const handleNicknameSubmit = async () => {
    if (!nickname.trim()) {
      setNicknameError('닉네임을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    setNicknameError('');

    try {
      // 닉네임 등록 (참가자로 즉시 등록)
      const result = await registerParticipant(nickname);

      if (result.success) {
        setShowNicknameModal(false);
        setHasVoted(true); // 참가자로 등록됨
        showToast('참가자로 등록되었습니다.', 'success');
      } else {
        setNicknameError(result.error || '등록에 실패했습니다.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (!visitorId || Object.keys(mySelections).length === 0) {
      showToast('최소 하나의 날짜를 선택해주세요.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = hasVoted
        ? await updateVote(mySelections)
        : await submitVote(nickname, mySelections);

      if (result.success) {
        setHasVoted(true);
        await refetch();
        showToast(hasVoted ? '투표가 수정되었습니다.' : '투표가 완료되었습니다.', 'success');
      } else {
        showToast(result.error || '오류가 발생했습니다.', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (roomLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  if (roomError || !room) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <p className="text-gray-500 mb-4">{roomError || '방을 찾을 수 없습니다.'}</p>
        <Link href="/" className="text-primary-500 hover:underline">
          홈으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">{room.title}</h1>
              <p className="text-sm text-gray-500">
                {room.currentParticipants}/{room.maxParticipants}명 참여 중
              </p>
            </div>
            <div className="flex items-center gap-2">
              <LinkCopyButton roomId={room.roomId} />
            </div>
          </div>
        </div>
      </header>

      {/* 메인 */}
      <main className="max-w-md mx-auto px-4 py-6 space-y-4">
        {/* 캘린더 */}
        <Calendar
          startDate={parseDate(room.startDate)}
          endDate={parseDate(room.endDate)}
          mySelections={mySelections}
          allDates={votes?.summary.allDates}
          totalParticipants={votes?.totalParticipants || 0}
          onDateClick={handleDateClick}
          disabled={room.status !== 'VOTING'}
        />

        {/* 투표 상태 선택 */}
        {room.status === 'VOTING' && (
          <VoteStatusSelector
            currentStatus={currentStatus}
            onStatusChange={setCurrentStatus}
          />
        )}

        {/* 참가자 목록 */}
        {votes && votes.votes.length > 0 && (
          <ParticipantList votes={votes.votes} hostNickname={room.hostNickname} />
        )}

        {/* 액션 버튼 */}
        <div className="space-y-3">
          {room.status === 'VOTING' && (
            <Button
              fullWidth
              onClick={handleSubmit}
              disabled={isSubmitting || Object.keys(mySelections).length === 0}
            >
              {isSubmitting ? '저장 중...' : hasVoted ? '선택하기' : '선택 완료'}
            </Button>
          )}

          <Link href={`/${room.roomId}/result`} className="block">
            <Button variant="outline" fullWidth>
              결과 보기
            </Button>
          </Link>
        </div>

        {/* 공유 버튼 */}
        <div className="flex gap-2 pt-4">
          <KakaoShareButton title={room.title} roomId={room.roomId} />
          <LinkCopyButton roomId={room.roomId} />
        </div>
      </main>

      {/* 닉네임 입력 모달 - 초기화 완료 후, 방장이 아니고 투표하지 않은 경우에만 표시 */}
      <Modal
        isOpen={isInitialized && showNicknameModal && !hasVoted && !room.isHost}
        onClose={() => { }}
        title={room.title}
      >
        <div className="space-y-4">
          <p className="text-gray-600">닉네임을 입력하세요</p>
          <Input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임"
            maxLength={20}
            error={nicknameError}
          />
          <Button fullWidth onClick={handleNicknameSubmit}>
            참여하기
          </Button>
        </div>
      </Modal>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </div>
  );
}
