"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
class App {
    constructor() {
        this.express = express();
        this.mountRoutes();
    }
    mountRoutes() {
        const router = express.Router();
        router.get('/', (req, res) => {
            res.json({
                message: 'Hello World!'
            });
        });
        this.express.use('/', router);
    }
}
exports.start = () => {
    let app = new App().express;
    const port = process.env.PORT || 3000;
    app.listen(port, (err) => {
        if (err) {
            return console.log(err);
        }
        return console.log(`server is listening on ${port}`);
    });
};
exports.default = exports.start;
