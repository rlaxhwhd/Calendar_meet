import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'calendar_vote_visitor_id';

export function useVisitorId() {
  const [visitorId, setVisitorId] = useState<string | null>(null);

  useEffect(() => {
    // 클라이언트에서만 실행
    if (typeof window === 'undefined') return;

    let id = localStorage.getItem(STORAGE_KEY);

    if (!id) {
      id = uuidv4();
      localStorage.setItem(STORAGE_KEY, id);
    }

    setVisitorId(id);
  }, []);

  return visitorId;
}
