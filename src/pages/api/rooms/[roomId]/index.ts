import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roomId } = req.query;
  const visitorId = req.headers['x-visitor-id'] as string | undefined;

  if (typeof roomId !== 'string') {
    return res.status(400).json({ success: false, error: '잘못된 요청입니다.' });
  }

  if (req.method === 'GET') {
    return handleGet(roomId, visitorId, res);
  } else if (req.method === 'PATCH') {
    return handlePatch(roomId, visitorId, req, res);
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}

async function handleGet(roomId: string, visitorId: string | undefined, res: NextApiResponse) {
  try {
    const room = await prisma.room.findUnique({
      where: { roomId },
      include: {
        _count: {
          select: { votes: true },
        },
      },
    });

    if (!room) {
      return res.status(404).json({ success: false, error: '방을 찾을 수 없습니다.' });
    }

    return res.status(200).json({
      success: true,
      data: {
        roomId: room.roomId,
        title: room.title,
        hostNickname: room.hostNickname,
        startDate: room.startDate.toISOString().split('T')[0],
        endDate: room.endDate.toISOString().split('T')[0],
        maxParticipants: room.maxParticipants,
        currentParticipants: room._count.votes,
        deadline: room.deadline?.toISOString() || null,
        status: room.status,
        confirmedDate: room.confirmedDate?.toISOString().split('T')[0] || null,
        isHost: visitorId === room.hostVisitorId,
        createdAt: room.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Room fetch error:', error);
    return res.status(500).json({ success: false, error: '서버 오류가 발생했습니다.' });
  }
}

async function handlePatch(
  roomId: string,
  visitorId: string | undefined,
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const room = await prisma.room.findUnique({
      where: { roomId },
    });

    if (!room) {
      return res.status(404).json({ success: false, error: '방을 찾을 수 없습니다.' });
    }

    if (room.hostVisitorId !== visitorId) {
      return res.status(403).json({ success: false, error: '방장만 수정할 수 있습니다.' });
    }

    const { title, startDate, endDate, maxParticipants, deadline } = req.body;

    const updateData: any = {};
    if (title !== undefined) updateData.title = title.trim();
    if (startDate !== undefined) updateData.startDate = new Date(startDate);
    if (endDate !== undefined) updateData.endDate = new Date(endDate);
    if (maxParticipants !== undefined) updateData.maxParticipants = maxParticipants;
    if (deadline !== undefined) updateData.deadline = deadline ? new Date(deadline) : null;

    await prisma.room.update({
      where: { roomId },
      data: updateData,
    });

    return res.status(200).json({ success: true, message: '방이 수정되었습니다.' });
  } catch (error) {
    console.error('Room update error:', error);
    return res.status(500).json({ success: false, error: '서버 오류가 발생했습니다.' });
  }
}
