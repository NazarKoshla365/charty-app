import express from "express";
import {friendRequest} from "../controllers/requestController"

const friendRouter = express.Router();

friendRouter.post('/request',friendRequest)


export default friendRouter;
