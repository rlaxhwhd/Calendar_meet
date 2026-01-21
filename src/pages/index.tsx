import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50">
      <main className="text-center max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">📅 일정 맞춤</h1>
        <p className="text-gray-600 mb-8">모두가 되는 날, 쉽게 찾기</p>

        <div className="space-y-3">
          <Link
            href="/create"
            className="block w-full py-3 px-4 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-colors"
          >
            ➕ 새 일정 만들기
          </Link>

          <button
            onClick={() => {
              const code = prompt('방 코드를 입력하세요');
              if (code) {
                window.location.href = `/${code}`;
              }
            }}
            className="block w-full py-3 px-4 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            🔗 코드로 참여하기
          </button>
        </div>
      </main>
    </div>
  );
}
