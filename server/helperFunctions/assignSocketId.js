import { nanoid } from 'nanoid';

export default function assignSocketId(socket) {
  socket.id = nanoid();
}
