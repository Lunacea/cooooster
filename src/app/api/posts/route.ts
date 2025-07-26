import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { postsTable, usersTable } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';

// 投稿一覧取得
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get('limit')) || 20;
    const offset = Number(searchParams.get('offset')) || 0;
    const userId = searchParams.get('userId');

    let query = db
      .select({
        id: postsTable.id,
        userId: postsTable.userId,
        area: postsTable.area,
        content: postsTable.content,
        imageUrl: postsTable.imageUrl,
        latitude: postsTable.latitude,
        longitude: postsTable.longitude,
        createdAt: postsTable.createdAt,
        updatedAt: postsTable.updatedAt,
        user: {
          id: usersTable.id,
          name: usersTable.name,
        },
      })
      .from(postsTable)
      .leftJoin(usersTable, eq(postsTable.userId, usersTable.id))
      .orderBy(desc(postsTable.createdAt))
      .limit(limit)
      .offset(offset);

    // 特定ユーザーの投稿のみ取得
    if (userId) {
      query = query.where(eq(postsTable.userId, userId)) as any;
    }

    const posts = await query;

    return NextResponse.json({
      posts,
      total: posts.length,
    });
  } catch (error) {
    console.error('投稿取得エラー:', error);
    return NextResponse.json(
      { error: '投稿の取得に失敗しました' },
      { status: 500 }
    );
  }
}

// 投稿作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, area, content, imageUrl, latitude, longitude } = body;

    if (!userId || !area || !content) {
      return NextResponse.json(
        { error: '必要な項目が不足しています' },
        { status: 400 }
      );
    }

    const result = await db
      .insert(postsTable)
      .values({
        userId,
        area,
        content,
        imageUrl,
        latitude: latitude?.toString() || null,
        longitude: longitude?.toString() || null,
      })
      .returning({ id: postsTable.id });

    return NextResponse.json({ id: result[0].id });
  } catch (error) {
    console.error('投稿作成エラー:', error);
    return NextResponse.json(
      { error: '投稿の作成に失敗しました' },
      { status: 500 }
    );
  }
}