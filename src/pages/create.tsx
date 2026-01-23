import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useVisitorId } from '@/hooks/useVisitorId';
import { Toast, useToast } from '@/components/ui/Toast';

export default function CreateRoom() {
  const router = useRouter();
  const visitorId = useVisitorId();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    hostNickname: '',
    startDate: '',
    endDate: '',
    maxParticipants: 10,
    deadline: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorId) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          hostVisitorId: visitorId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push(`/${data.data.roomId}`);
      } else {
        showToast(data.error || '방 생성에 실패했습니다.', 'error');
      }
    } catch (error) {
      showToast('오류가 발생했습니다.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center max-w-md mx-auto">
          <Link href="/" className="text-gray-600 mr-3">←</Link>
          <h1 className="text-lg font-semibold">새 일정 만들기</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              일정 제목 *
            </label>
            <input
              type="text"
              required
              maxLength={50}
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="예: 신년 모임"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              내 닉네임 *
            </label>
            <input
              type="text"
              required
              maxLength={20}
              value={formData.hostNickname}
              onChange={(e) => setFormData({ ...formData, hostNickname: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="예: 홍길동"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              날짜 범위 *
            </label>
            <div className="flex items-center gap-2">
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <span className="text-gray-500">→</span>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">ⓘ 최대 2달까지 선택 가능</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              최대 참여 인원 *
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                required
                min={2}
                max={50}
                value={formData.maxParticipants}
                onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) })}
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <span className="text-gray-600">명</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              투표 마감일 (선택)
            </label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">ⓘ 미설정 시 수동으로 마감</p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !visitorId}
            className="w-full py-3 px-4 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '생성 중...' : '일정 만들기'}
          </button>
        </form>
      </main>

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
