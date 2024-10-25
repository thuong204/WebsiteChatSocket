"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chat_route_1 = require("./chat.route");
const clientRoutes = (app) => {
    app.use(`/`, chat_route_1.chatRoutes);
};
exports.default = clientRoutes;
