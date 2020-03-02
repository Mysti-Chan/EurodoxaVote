/**
 * @author DE BRUYNE Alexis
 * Last Update: 4/12/2019
 */

const Config = require("./config/config");
import { Server } from "./server";

const host = Config.get("host");
const port = Config.get("port");

const server = new Server(host,port, Config.get("db"), Config.get('jwt').secret);
server.start();