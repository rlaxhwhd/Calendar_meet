import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { validateNickname } from '@/utils/validation';
import { VoteStatus } from '@prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roomId } = req.query;

  if (typeof roomId !== 'string') {
    return res.status(400).json({ success: false, error: '잘못된 요청입니다.' });
  }

  switch (req.method) {
    case 'GET':
      return handleGet(roomId, req, res);
    case 'POST':
      return handlePost(roomId, req, res);
    case 'PUT':
      return handlePut(roomId, req, res);
    default:
      return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}

async function handleGet(roomId: string, req: NextApiRequest, res: NextApiResponse) {
  const visitorId = req.query.visitorId as string | undefined;

  try {
    const room = await prisma.room.findUnique({
      where: { roomId },
    });

    if (!room) {
      return res.status(404).json({ success: false, error: '방을 찾을 수 없습니다.' });
    }

    const votes = await prisma.vote.findMany({
      where: { roomId },
      include: {
        selections: true,
      },
    });

    // 투표 데이터 가공
    const formattedVotes = votes.map((vote) => ({
      nickname: vote.nickname,
      isMe: vote.visitorId === visitorId,
      selections: vote.selections.reduce((acc, sel) => {
        const dateStr = sel.date.toISOString().split('T')[0];
        acc[dateStr] = sel.status;
        return acc;
      }, {} as Record<string, VoteStatus>),
    }));

    // 날짜별 집계
    const allDates: Record<string, { available: number; maybe: number }> = {};

    votes.forEach((vote) => {
      vote.selections.forEach((sel) => {
        const dateStr = sel.date.toISOString().split('T')[0];
        if (!allDates[dateStr]) {
          allDates[dateStr] = { available: 0, maybe: 0 };
        }
        if (sel.status === 'AVAILABLE') allDates[dateStr].available++;
        else if (sel.status === 'MAYBE') allDates[dateStr].maybe++;
      });
    });

    // 상위 6개 날짜 계산 (점수 = available*2 + maybe*1)
    const topDates = Object.entries(allDates)
      .map(([date, counts]) => ({
        date,
        availableCount: counts.available,
        maybeCount: counts.maybe,
        totalScore: counts.available * 2 + counts.maybe,
        participants: votes
          .filter((v) =>
            v.selections.some(
              (s) => s.date.toISOString().split('T')[0] === date && s.status === 'AVAILABLE'
            )
          )
          .map((v) => v.nickname),
      }))
      .sort((a, b) => {
        // 1순위: 점수 높은 순
        if (b.totalScore !== a.totalScore) {
          return b.totalScore - a.totalScore;
        }
        // 2순위: 점수 같으면 날짜 빠른 순
        return a.date.localeCompare(b.date);
      })
      .slice(0, 6);

    return res.status(200).json({
      success: true,
      data: {
        votes: formattedVotes,
        summary: {
          topDates,
          allDates,
        },
        totalParticipants: votes.length,
      },
    });
  } catch (error) {
    console.error('Votes fetch error:', error);
    return res.status(500).json({ success: false, error: '서버 오류가 발생했습니다.' });
  }
}

async function handlePost(roomId: string, req: NextApiRequest, res: NextApiResponse) {
  const { nickname, visitorId, selections } = req.body;

  // 유효성 검사
  const nicknameValidation = validateNickname(nickname);
  if (!nicknameValidation.valid) {
    return res.status(400).json({ success: false, error: nicknameValidation.error });
  }

  if (!visitorId) {
    return res.status(400).json({ success: false, error: '브라우저 식별자가 필요합니다.' });
  }

  try {
    const room = await prisma.room.findUnique({
      where: { roomId },
      include: { _count: { select: { votes: true } } },
    });

    if (!room) {
      return res.status(404).json({ success: false, error: '방을 찾을 수 없습니다.' });
    }

    if (room.status !== 'VOTING') {
      return res.status(400).json({ success: false, error: '투표가 마감되었습니다.' });
    }

    if (room._count.votes >= room.maxParticipants) {
      return res.status(400).json({ success: false, error: '참여 인원이 가득 찼습니다.' });
    }

    // 중복 체크
    const existingVote = await prisma.vote.findFirst({
      where: {
        roomId,
        OR: [{ nickname: nickname.trim() }, { visitorId }],
      },
    });

    if (existingVote) {
      if (existingVote.nickname === nickname.trim()) {
        return res.status(409).json({ success: false, error: '이미 사용중인 닉네임입니다.' });
      }
      return res.status(409).json({ success: false, error: '이미 투표에 참여하셨습니다.' });
    }

    // 투표 생성 (selections가 없어도 참가자로 등록)
    await prisma.vote.create({
      data: {
        roomId,
        nickname: nickname.trim(),
        visitorId,
        selections: selections && Object.keys(selections).length > 0
          ? {
            create: Object.entries(selections).map(([date, status]) => ({
              date: new Date(date),
              status: status as VoteStatus,
            })),
          }
          : undefined,
      },
    });

    const hasSelections = selections && Object.keys(selections).length > 0;
    return res.status(201).json({
      success: true,
      message: hasSelections ? '투표가 완료되었습니다.' : '참가자로 등록되었습니다.'
    });
  } catch (error) {
    console.error('Vote submit error:', error);
    return res.status(500).json({ success: false, error: '서버 오류가 발생했습니다.' });
  }
}

async function handlePut(roomId: string, req: NextApiRequest, res: NextApiResponse) {
  const { visitorId, selections } = req.body;

  if (!visitorId) {
    return res.status(400).json({ success: false, error: '브라우저 식별자가 필요합니다.' });
  }

  try {
    const room = await prisma.room.findUnique({
      where: { roomId },
    });

    if (!room) {
      return res.status(404).json({ success: false, error: '방을 찾을 수 없습니다.' });
    }

    if (room.status !== 'VOTING') {
      return res.status(400).json({ success: false, error: '투표가 마감되었습니다.' });
    }

    const vote = await prisma.vote.findFirst({
      where: { roomId, visitorId },
    });

    if (!vote) {
      return res.status(404).json({ success: false, error: '투표 기록을 찾을 수 없습니다.' });
    }

    // 기존 선택 삭제 후 새로 생성 (트랜잭션으로 원자성 보장)
    await prisma.$transaction([
      prisma.voteSelection.deleteMany({
        where: { voteId: vote.id },
      }),
      prisma.voteSelection.createMany({
        data: Object.entries(selections).map(([date, status]) => ({
          voteId: vote.id,
          date: new Date(date),
          status: status as VoteStatus,
        })),
      }),
    ]);

    return res.status(200).json({ success: true, message: '투표가 수정되었습니다.' });
  } catch (error) {
    console.error('Vote update error:', error);
    return res.status(500).json({ success: false, error: '서버 오류가 발생했습니다.' });
  }
}
