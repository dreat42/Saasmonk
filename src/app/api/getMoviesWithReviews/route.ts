import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const movies = await prisma.movie.findMany({
      include: {
        reviews: true,
      },
    });

    return NextResponse.json(movies);
  } catch (error) {
    console.error("Error fetching movies and reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch movies and reviews." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
