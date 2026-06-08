import { Room } from '@prisma/client';

export const mapRoomResponse = (room: Room) => {
  return {
    id: room.id,

    roomCode: room.roomCode,

    name: room.name,

    description: room.description,

    capacity: room.capacity,

    createdAt: room.createdAt,
    updatedAt: room.updatedAt,
  };
};
