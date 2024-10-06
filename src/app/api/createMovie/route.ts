import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { name, releaseDate } = await request.json();

  try {
    const movie = await prisma.movie.create({
      data: {
        Name: name,
        Release_Date: releaseDate,
      },
    });

    return NextResponse.json(movie, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create movie." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
