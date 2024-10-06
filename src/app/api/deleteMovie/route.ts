import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(request: Request) {
  const { id } = await request.json();

  try {
    await prisma.review.deleteMany({
      where: {
        MovieID: id,
      },
    });

    await prisma.movie.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json("Movie Delete", { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete movie and reviews." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
