import express, { Express, Request, Response } from "express";
import axios from "axios";
// import pug from "pug";

const app: Express = express();
app.set('views', './src/views');
app.set('view engine', 'pug');
app.use(express.json());
const port = 3000;

const BASE_URL = "https://collectionapi.metmuseum.org/public/collection/v1"
let objectIDs: number[];

async function getAllObjectIDs() {
    const artResponse = await axios.get(`${BASE_URL}/objects`);
    objectIDs = artResponse.data.objectIDs;
}

getAllObjectIDs().then(() => {
    app.get('/', async (req: Request, res: Response) => {
        let imageUrl = "";
        while(!imageUrl) {
            const randPieceID = objectIDs[Math.floor(Math.random() * objectIDs.length)];
            console.log(randPieceID);
            const pieceResponse = await axios.get(`${BASE_URL}/objects/${randPieceID}`);
            imageUrl = pieceResponse.data.primaryImageSmall;
        }
        console.log(imageUrl);
        res.render('index', { title: 'Hey', imageUrl: imageUrl });
    });
    
    app.listen(port, () => {
        console.log(`[server]: Server is running at http://localhost:${port}`);
    });
})

