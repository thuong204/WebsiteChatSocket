// global.d.ts
import { Server } from "socket.io";

declare global {
    var _io: Server;
}

export { }; // Đảm bảo file này được coi là một module
