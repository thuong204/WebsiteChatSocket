"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chat_route_1 = require("./chat.route");
const user_route_1 = require("./user.route");
const clientRoutes = (app) => {
    app.use(`/`, chat_route_1.chatRoutes);
    app.use("/user", user_route_1.userRoutes);
};
exports.default = clientRoutes;
