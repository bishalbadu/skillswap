import { Server } from "socket.io";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";   // 🔥 ADD THIS

let io: Server;

export async function GET(req: any) {
  if (!io) {
    io = new Server(3001, {
      cors: {
        origin: "*",
      },
    });

    io.on("connection", (socket) => {
      console.log("User connected:", socket.id);

      // 🔹 Join room
      socket.on("joinRoom", (sessionId) => {
        socket.join(`session-${sessionId}`);
      });

      // 🔥 SAVE MESSAGE + EMIT
      socket.on("sendMessage", async (data) => {
        try {
          const savedMessage = await prisma.message.create({
            data: {
              sessionId: Number(data.sessionId),
              senderId: Number(data.senderId),
              content: data.content,
            },
            include: {
              sender: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  avatar: true,
                },
              },
            },
          });

          // Emit to everyone in room
          io.to(`session-${data.sessionId}`).emit(
            "receiveMessage",
            savedMessage
          );

        } catch (error) {
          console.error("Message save error:", error);
        }
      });

      socket.on("disconnect", () => {
        console.log("User disconnected");
      });
    });
  }

  return NextResponse.json({ status: "Socket running" });
}