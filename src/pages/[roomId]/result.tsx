import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useVisitorId } from '@/hooks/useVisitorId';
import { useRoom } from '@/hooks/useRoom';
import { useVote } from '@/hooks/useVote';
import { VoteSummary } from '@/components/vote/VoteSummary';
import { ParticipantList } from '@/components/vote/ParticipantList';
import { Calendar } from '@/components/calendar/Calendar';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Toast, useToast } from '@/components/ui/Toast';
import { KakaoShareButton } from '@/components/share/KakaoShareButton';
import { LinkCopyButton } from '@/components/share/LinkCopyButton';
import { parseDate, formatKoreanDate } from '@/utils/date';

export default function ResultPage() {
  const router = useRouter();
  const { roomId } = router.query;
  const visitorId = useVisitorId();

  const { room, isLoading: roomLoading, error: roomError, refetch: refetchRoom } = useRoom(
    roomId as string,
    visitorId
  );
  const { votes, isLoading: votesLoading } = useVote(roomId as string, visitorId);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  const handleCloseVoting = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/rooms/${roomId}/close`, {
        method: 'POST',
        headers: {
          'X-Visitor-Id': visitorId || '',
        },
      });

      const data = await response.json();
      if (data.success) {
        showToast('투표가 마감되었습니다.', 'success');
        setShowCloseModal(false);
        refetchRoom();
      } else {
        showToast(data.error || '오류가 발생했습니다.', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirm = async () => {
    if (!selectedDate) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/rooms/${roomId}/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Visitor-Id': visitorId || '',
        },
        body: JSON.stringify({ confirmedDate: selectedDate }),
      });

      const data = await response.json();
      if (data.success) {
        showToast('날짜가 확정되었습니다.', 'success');
        setShowConfirmModal(false);
        refetchRoom();
      } else {
        showToast(data.error || '오류가 발생했습니다.', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (roomLoading || votesLoading) {
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
          <div className="flex items-center">
            <Link href={`/${room.roomId}`} className="text-gray-600 mr-3">
              ←
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">{room.title}</h1>
              <p className="text-sm text-gray-500">투표 결과</p>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 */}
      <main className="max-w-md mx-auto px-4 py-6 space-y-4">
        {/* 확정된 날짜 표시 */}
        {room.status === 'CONFIRMED' && room.confirmedDate && (
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 text-center">
            <p className="text-sm text-primary-600 mb-1">확정된 날짜</p>
            <p className="text-xl font-bold text-primary-700">
              {formatKoreanDate(parseDate(room.confirmedDate))}
            </p>
          </div>
        )}

        {/* 상태 표시 */}
        {room.status === 'CLOSED' && (
          <div className="bg-gray-100 rounded-lg p-4 text-center">
            <p className="text-gray-600">투표가 마감되었습니다.</p>
          </div>
        )}

        {/* 전체 캘린더 */}
        {votes && (
          <Calendar
            startDate={parseDate(room.startDate)}
            endDate={parseDate(room.endDate)}
            mySelections={{}}
            allDates={votes.summary.allDates}
            totalParticipants={votes.totalParticipants}
            onDateClick={() => {}}
            disabled
          />
        )}

        {/* BEST 날짜 */}
        {votes && (
          <VoteSummary
            topDates={votes.summary.topDates}
            totalParticipants={votes.totalParticipants}
          />
        )}

        {/* 참가자별 응답 */}
        {votes && votes.votes.length > 0 && (
          <ParticipantList
            votes={votes.votes}
            hostNickname={room.hostNickname}
            showDetail
          />
        )}

        {/* 방장 전용 버튼 */}
        {room.isHost && room.status === 'VOTING' && (
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center mb-3">방장 전용</p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                fullWidth
                onClick={() => setShowCloseModal(true)}
                disabled={isSubmitting}
              >
                투표 마감
              </Button>
              <Button
                fullWidth
                onClick={() => setShowConfirmModal(true)}
                disabled={isSubmitting}
              >
                날짜 확정
              </Button>
            </div>
          </div>
        )}

        {/* 공유 버튼 */}
        <div className="flex gap-2 pt-4">
          <KakaoShareButton title={room.title} roomId={room.roomId} />
          <LinkCopyButton roomId={room.roomId} />
        </div>

        {/* 돌아가기 */}
        <Link href={`/${room.roomId}`} className="block">
          <Button variant="outline" fullWidth>
            투표 페이지로 돌아가기
          </Button>
        </Link>
      </main>

      {/* 날짜 확정 모달 */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="날짜 확정"
      >
        <div className="space-y-4">
          <p className="text-gray-600">확정할 날짜를 선택하세요</p>

          {votes?.summary.topDates.map((item) => (
            <button
              key={item.date}
              type="button"
              onClick={() => setSelectedDate(item.date)}
              className={`
                w-full p-3 rounded-lg border text-left
                ${selectedDate === item.date
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">
                  {formatKoreanDate(parseDate(item.date))}
                </span>
                <span className="text-sm text-gray-500">
                  {item.availableCount}명 가능
                </span>
              </div>
            </button>
          ))}

          <Button
            fullWidth
            onClick={handleConfirm}
            disabled={!selectedDate || isSubmitting}
          >
            {isSubmitting ? '처리 중...' : '확정하기'}
          </Button>
        </div>
      </Modal>

      {/* 투표 마감 확인 모달 */}
      <Modal
        isOpen={showCloseModal}
        onClose={() => setShowCloseModal(false)}
        title="투표 마감"
      >
        <div className="space-y-4">
          <p className="text-gray-600">투표를 마감하시겠습니까?</p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              fullWidth
              onClick={() => setShowCloseModal(false)}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button
              fullWidth
              onClick={handleCloseVoting}
              disabled={isSubmitting}
            >
              {isSubmitting ? '처리 중...' : '마감하기'}
            </Button>
          </div>
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
