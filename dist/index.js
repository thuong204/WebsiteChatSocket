"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._io = void 0;
const express_1 = __importDefault(require("express"));
const index_route_1 = __importDefault(require("./routes/client/index.route"));
const express_flash_1 = __importDefault(require("express-flash"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_session_1 = __importDefault(require("express-session"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const http_1 = __importDefault(require("http"));
const database = __importStar(require("./config/database"));
const socket_io_1 = require("socket.io");
const connect_mongo_1 = __importDefault(require("connect-mongo"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use((0, cookie_parser_1.default)("JHGJKLKLGFLJK"));
app.use((0, express_session_1.default)({
    secret: "thuong",
    resave: false,
    saveUninitialized: false,
    store: connect_mongo_1.default.create({ mongoUrl: process.env.MONGO_URL }),
    cookie: {
        maxAge: 60000,
        secure: process.env.NODE_ENV === 'production',
    },
}));
database.connect();
app.use((0, express_flash_1.default)());
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
exports._io = io;
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(express_1.default.static(`${__dirname}/public`));
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");
(0, index_route_1.default)(app);
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
exports.default = app;
