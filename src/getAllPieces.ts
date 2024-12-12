import axios from "axios";
import fs from "fs";

const filePath = "objectIds.json";
const BASE_URL = "https://collectionapi.metmuseum.org/public/collection/v1"

async function initializeData() {
    const artResponse = await axios.get(`${BASE_URL}/objects`);
    const objectIDs = artResponse.data.objectIDs;
    fs.writeFile(filePath, JSON.stringify(objectIDs), (err) => {
        if (err) {
            console.error('Error writing to file:', err);
        } else {
            console.log('Write successful');
        }
    });
}

initializeData()