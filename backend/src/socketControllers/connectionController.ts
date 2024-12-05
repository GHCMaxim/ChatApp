import { Server, Socket } from "socket.io";
import { prisma } from "../app";
import { socketUserMap } from "../utils/socketUtils";

export const getSocketIdsByConversationId = async (
  conversationId: number
): Promise<string[]> => {
  const participants = await prisma.participants.findMany({
    where: {
      conversationId,
    },
    select: {
      userId: true,
    },
  });
  const socketIds = participants
    .map((participant) => socketUserMap.get(participant.userId.toString()))
    .filter((socketId) => socketId !== undefined) as string[];
  return socketIds;
};

export const getSocketDetails = async (userId: number) => {
  // Get all rooms
  const result = await prisma.participants.findMany({
    where: {
      userId,
      conversationId: {
        not: null,
      },
    },
    select: {
      conversationId: true,
    },
  });

  return result.map(
    (room) => room.conversationId?.toString() as string
  ) as string[];
};

export const onlineController = (io: Server, socket: Socket) => {
  socket.on("user:online", async (userId) => {
    // Get user detaiils
    console.log(`User ${userId} is online with socket id ${socket.id}`);
    socket.data.userId = userId;
    const result = await getSocketDetails(userId);
    // Make user join rooms
    for (const room of result) {
      console.log(`User ${userId} is joining rooms ${room}`);
      socket.join(room);
      socket.to(room + "").emit("user:online", userId);
    }

    // TODO Update user status to online, last seen undefined
  });
};

export const offlineController = (io: Server, socket: Socket) => {
  socket.on("user:offline", async (userId) => {
    // Get user detaiils
    const result = await getSocketDetails(userId);

    const time = new Date(Date.now()).toISOString();

    // TODO Update user status to offline, last seen

    socket.to(result).emit("user:offline", { userId, time });
  });
};

// socket disconnection
export const disconnectingController = (io: Server, socket: Socket) => {
  socket.on("disconnecting", async (userId) => {
    if (!userId) return;

    const result = await getSocketDetails(socket.data.userid);

    const time = new Date(Date.now()).toISOString();

    // TODO: update user status to offline, last seen

    socket.to(result).emit("user:offline", { userId, time });
  });
};

export const joinRoomController = (io: Server, socket: Socket) => {
  socket.on("user:joinRooms", ({ rooms }: { rooms: string[] }) => {
    socket.join(rooms);
  });

  // socket.on("webrtc:offer", async ({ offer, to }) => {
  //   const targetSocketId = await getSocketIdsByConversationId(to);
  //   targetSocketId.forEach((socketId) => {
  //     socket.to(socketId).emit("webrtc:offer", { offer, from: socket.id });
  //   });
  // });

  // socket.on("webrtc:answer", ({ answer, to }) => {
  //   socket.to(to).emit("webrtc:answer", { answer, from: socket.id });
  // });

  // socket.on("webrtc:ice-candidate", ({ candidate, to }) => {
  //   socket.to(to).emit("webrtc:ice-candidate", { candidate, from: socket.id });
  // });
  socket.on("webrtc:offer", async ({ offer, conversationId }) => {
    const socketsInRoom = await io.in(conversationId.toString()).fetchSockets();
    socketsInRoom.forEach((socketId) => {
      console.log(socketId.data);
      socket.to(socketId.data).emit("webrtc:offer", { offer, from: socket.id });
    });
  });

  socket.on("webrtc:answer", ({ answer, to }) => {
    socket.to(to).emit("webrtc:answer", { answer, from: socket.id });
  });

  socket.on("webrtc:ice-candidate", ({ candidate, to }) => {
    socket.to(to).emit("webrtc:ice-candidate", { candidate, from: socket.id });
  });
};
