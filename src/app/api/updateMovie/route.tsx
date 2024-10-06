import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req: Request) {
  const { method } = req;

  if (method === "PUT") {
    const { Name, Release_Date, id } = await req.json();

    if (!Name || !Release_Date) {
      return NextResponse.json(
        { error: "Name release is required" },
        { status: 400 }
      );
    }
    try {
      const updatedMovie = await prisma.movie.update({
        where: { id: Number(id) },
        data: { Name, Release_Date },
      });

      return NextResponse.json(updatedMovie, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { error: "Failed to update movie" },
        { status: 500 }
      );
    }
  }
}
