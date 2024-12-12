import express, { Express, Request, Response } from "express";
import axios from "axios";
import { PrismaClient } from '@prisma/client';
import objectIDs from 'objectIds.json';

const app: Express = express();

app.set('views', './src/views');
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('./src/assets'));

const port = 3000;

const prisma = new PrismaClient();

const BASE_URL = "https://collectionapi.metmuseum.org/public/collection/v1"

async function getRandPieceUrl() {
    let imageUrl = "";
        while(!imageUrl) {
            const randPieceID = objectIDs[Math.floor(Math.random() * objectIDs.length)];
            console.log(randPieceID);
            const pieceResponse = await axios.get(`${BASE_URL}/objects/${randPieceID}`);
            imageUrl = pieceResponse.data.primaryImageSmall;
        }
    console.log(imageUrl);
    return imageUrl
}

async function initializeData() {
    // const book = await prisma.book.create({});
    // console.log(book);
}

initializeData().then(async () => {
    app.get('/', async (req: Request, res: Response) => {
        const pages = await prisma.page.findMany({
            where: {
                bookId: 1
            },
            select: {
                imageUrl: true,
                caption: true
            }
        });
        console.log(pages);
        const newImage = await getRandPieceUrl();
        res.render('layout', { newImage, pages });
    });

    app.post('/caption', async (req: Request, res: Response) => {
        const { imageUrl, caption } = req.body;
        console.log(caption);
        const pageCount = await prisma.page.count({
            where: {
                bookId: 1
            }
        });
        const page = await prisma.page.create({
            data: {
                bookId: 1,
                number: pageCount+1,
                imageUrl,
                caption
            }
        });
        console.log(page)
        

        res.render('components/page.pug', { page: {imageUrl, caption} });
    })
    
    app.listen(port, () => {
        console.log(`[server]: Server is running at http://localhost:${port}`);
    });
})

process.on('SIGINT', async () => {
    console.log('Server shutting down...');
    await prisma.$disconnect();
    process.exit(0);
})

