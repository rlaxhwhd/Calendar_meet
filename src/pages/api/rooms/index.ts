import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { generateRoomId } from '@/lib/nanoid';
import { validateTitle, validateNickname, validateDateRange, validateMaxParticipants } from '@/utils/validation';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { title, hostNickname, hostVisitorId, startDate, endDate, maxParticipants, deadline } = req.body;

    // 유효성 검사
    const titleValidation = validateTitle(title);
    if (!titleValidation.valid) {
      return res.status(400).json({ success: false, error: titleValidation.error });
    }

    const nicknameValidation = validateNickname(hostNickname);
    if (!nicknameValidation.valid) {
      return res.status(400).json({ success: false, error: nicknameValidation.error });
    }

    const dateValidation = validateDateRange(startDate, endDate);
    if (!dateValidation.valid) {
      return res.status(400).json({ success: false, error: dateValidation.error });
    }

    const participantsValidation = validateMaxParticipants(maxParticipants);
    if (!participantsValidation.valid) {
      return res.status(400).json({ success: false, error: participantsValidation.error });
    }

    if (!hostVisitorId) {
      return res.status(400).json({ success: false, error: '브라우저 식별자가 필요합니다.' });
    }

    // 방 생성
    const roomId = generateRoomId();
    const room = await prisma.room.create({
      data: {
        roomId,
        title: title.trim(),
        hostNickname: hostNickname.trim(),
        hostVisitorId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        maxParticipants,
        deadline: deadline ? new Date(deadline) : null,
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const shareUrl = `${baseUrl}/${roomId}`;

    return res.status(201).json({
      success: true,
      data: {
        roomId: room.roomId,
        shareUrl,
      },
    });
  } catch (error) {
    console.error('Room creation error:', error);
    return res.status(500).json({ success: false, error: '서버 오류가 발생했습니다.' });
  }
}
