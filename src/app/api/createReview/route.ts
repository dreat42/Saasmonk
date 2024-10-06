// app/api/createReview/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { movieId, reviewerName, rating, comments } = await request.json();

  try {
    const review = await prisma.review.create({
      data: {
        MovieID: movieId,
        Name: reviewerName,
        Rating: parseInt(rating),
        Comment: comments,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create review." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
