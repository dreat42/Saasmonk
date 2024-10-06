import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req: Request) {
  const { method } = req;

  if (method === "PUT") {
    const { Comment, id, Rating, Name } = await req.json();

    try {
      const updatedReview = await prisma.review.update({
        where: { id: Number(id) },
        data: { Comment, Rating, Name },
      });

      return NextResponse.json(updatedReview, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { error: "Failed to update review" },
        { status: 500 }
      );
    }
  }
}
