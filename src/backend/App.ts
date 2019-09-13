import * as express from 'express'

class App {
    public express;

    constructor() {
        this.express = express();
        this.mountRoutes();
    }

    private mountRoutes(): void {
        const router = express.Router();
        router.get('/', (req, res) => {
            res.json({
                message: 'Hello World!'
            });
        });
        this.express.use('/', router);
    }
}

export const start = () => {

    let app = new App().express;
    const port = process.env.PORT || 3000;

    app.listen(port, (err) => {
        if (err) {
            return console.log(err)
        }

        return console.log(`server is listening on ${port}`)
    })
}

export default start
