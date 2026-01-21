// 닉네임 유효성 검사
export function validateNickname(nickname: string): { valid: boolean; error?: string } {
  if (!nickname || nickname.trim().length === 0) {
    return { valid: false, error: '닉네임을 입력해주세요.' };
  }

  if (nickname.length > 20) {
    return { valid: false, error: '닉네임은 20자 이하로 입력해주세요.' };
  }

  // 특수문자 제한 (한글, 영문, 숫자만 허용)
  const validPattern = /^[가-힣a-zA-Z0-9\s]+$/;
  if (!validPattern.test(nickname)) {
    return { valid: false, error: '닉네임은 한글, 영문, 숫자만 사용할 수 있습니다.' };
  }

  return { valid: true };
}

// 방 제목 유효성 검사
export function validateTitle(title: string): { valid: boolean; error?: string } {
  if (!title || title.trim().length === 0) {
    return { valid: false, error: '제목을 입력해주세요.' };
  }

  if (title.length > 50) {
    return { valid: false, error: '제목은 50자 이하로 입력해주세요.' };
  }

  return { valid: true };
}

// 날짜 범위 유효성 검사
export function validateDateRange(
  startDate: string,
  endDate: string
): { valid: boolean; error?: string } {
  if (!startDate || !endDate) {
    return { valid: false, error: '날짜를 선택해주세요.' };
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start > end) {
    return { valid: false, error: '종료일은 시작일보다 이후여야 합니다.' };
  }

  // 최대 60일 (약 2달) 제한
  const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  if (daysDiff > 60) {
    return { valid: false, error: '날짜 범위는 최대 60일까지 가능합니다.' };
  }

  return { valid: true };
}

// 참여 인원 유효성 검사
export function validateMaxParticipants(count: number): { valid: boolean; error?: string } {
  if (!count || count < 2) {
    return { valid: false, error: '최소 2명 이상이어야 합니다.' };
  }

  if (count > 50) {
    return { valid: false, error: '최대 50명까지 가능합니다.' };
  }

  return { valid: true };
}

// UUID 형식 유효성 검사
export function isValidUUID(uuid: string): boolean {
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidPattern.test(uuid);
}
