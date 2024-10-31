// global.d.ts
import { Server } from "socket.io";

declare global {
    var _io: Server; // Khai báo _io có kiểu là Server
}

export {}; // Đảm bảo file này được coi là một module
