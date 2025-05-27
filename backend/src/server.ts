import app from './app'
import http from "http";
import { InitSocket } from './sockets/socket';


const port = process.env.PORT || 4000;
const server = http.createServer(app);

const io = InitSocket(server);


server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

