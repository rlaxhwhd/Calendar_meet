import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useVisitorId } from '@/hooks/useVisitorId';
import { Toast, useToast } from '@/components/ui/Toast';

export default function CreateRoom() {
  const router = useRouter();
  const visitorId = useVisitorId();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    hostNickname: '',
    startDate: '',
    endDate: '',
    maxParticipants: 10,
    deadline: '',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

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
      {/* 헤더 */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="flex items-center max-w-md mx-auto px-4 py-3">
          <Link
            href="/"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors mr-3"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-lg font-bold text-gray-800">새 일정 만들기</h1>
            <p className="text-xs text-gray-500">모임 일정을 조율해보세요</p>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        {/* 미리보기 카드 */}
        <div
          className={`mb-6 transition-all duration-500 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                <span className="text-2xl">📅</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 truncate">
                  {formData.title || '일정 제목'}
                </h3>
                <p className="text-sm text-gray-500">
                  {formData.hostNickname ? `${formData.hostNickname}님의 일정` : '방장 닉네임'}
                </p>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-400">참여 인원</div>
                <div className="font-semibold text-green-600">{formData.maxParticipants}명</div>
              </div>
            </div>
          </div>
        </div>

        {/* 폼 */}
        <form
          onSubmit={handleSubmit}
          className={`space-y-4 transition-all duration-500 delay-100 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {/* 일정 제목 */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <div className="w-6 h-6 rounded-lg bg-green-100 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              일정 제목
            </label>
            <input
              type="text"
              required
              maxLength={50}
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-green-500 focus:bg-white transition-all text-gray-800 placeholder-gray-400"
              placeholder="예: 2월 정기 모임"
            />
          </div>

          {/* 닉네임 */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              내 닉네임
            </label>
            <input
              type="text"
              required
              maxLength={20}
              value={formData.hostNickname}
              onChange={(e) => setFormData({ ...formData, hostNickname: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-green-500 focus:bg-white transition-all text-gray-800 placeholder-gray-400"
              placeholder="예: 홍길동"
            />
          </div>

          {/* 날짜 범위 */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <div className="w-6 h-6 rounded-lg bg-purple-100 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              투표 기간
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-green-500 focus:bg-white transition-all text-gray-800"
                />
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
              <div className="flex-1">
                <input
                  type="date"
                  required
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-green-500 focus:bg-white transition-all text-gray-800"
                />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              최대 2달까지 선택 가능
            </p>
          </div>

          {/* 참여 인원 & 마감일 */}
          <div className="grid grid-cols-2 gap-3">
            {/* 최대 참여 인원 */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <div className="w-6 h-6 rounded-lg bg-orange-100 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                인원
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  required
                  min={2}
                  max={50}
                  value={formData.maxParticipants}
                  onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) || 2 })}
                  className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-green-500 focus:bg-white transition-all text-gray-800 text-center"
                />
              </div>
            </div>

            {/* 투표 마감일 */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <div className="w-6 h-6 rounded-lg bg-red-100 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                마감일
              </label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-green-500 focus:bg-white transition-all text-gray-800"
              />
            </div>
          </div>

          {/* 제출 버튼 */}
          <button
            type="submit"
            disabled={isSubmitting || !visitorId}
            className={`
              w-full py-4 px-6 rounded-2xl font-semibold text-white shadow-lg
              transition-all duration-300 flex items-center justify-center gap-2
              ${isSubmitting || !visitorId
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-green-500/25 active:scale-[0.98]'
              }
            `}
          >
            {isSubmitting ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                생성 중...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                일정 만들기
              </>
            )}
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
