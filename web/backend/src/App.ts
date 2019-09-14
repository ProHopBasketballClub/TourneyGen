import * as express from 'express'
import * as bodyParser from 'body-parser'

class App {
    public express: express.Application

    constructor() {
        this.express = express()
        this.config()
        this.mountRoutes()
    }

    private config(): void {
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({extended: false}));
    }
    //this can be moved to a separate fine
    private mountRoutes(): void {
        const router = express.Router()
        router.get('/', (req, res) => {
            res.json({
                message: 'Hello World!'
            })
        })
        this.express.use('/', router)
    }
}

export default new App().express