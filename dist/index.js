"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_route_1 = __importDefault(require("./routes/client/index.route"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.static(`${__dirname}/public`));
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");
(0, index_route_1.default)(app);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
