import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { roomId } = req.query;
  const visitorId = req.headers['x-visitor-id'] as string | undefined;

  if (typeof roomId !== 'string') {
    return res.status(400).json({ success: false, error: '잘못된 요청입니다.' });
  }

  try {
    const room = await prisma.room.findUnique({
      where: { roomId },
    });

    if (!room) {
      return res.status(404).json({ success: false, error: '방을 찾을 수 없습니다.' });
    }

    if (room.hostVisitorId !== visitorId) {
      return res.status(403).json({ success: false, error: '방장만 날짜를 확정할 수 있습니다.' });
    }

    const { confirmedDate } = req.body;

    if (!confirmedDate) {
      return res.status(400).json({ success: false, error: '확정할 날짜를 선택해주세요.' });
    }

    await prisma.room.update({
      where: { roomId },
      data: {
        confirmedDate: new Date(confirmedDate),
        status: 'CONFIRMED',
      },
    });

    return res.status(200).json({ success: true, message: '날짜가 확정되었습니다.' });
  } catch (error) {
    console.error('Room confirm error:', error);
    return res.status(500).json({ success: false, error: '서버 오류가 발생했습니다.' });
  }
}
