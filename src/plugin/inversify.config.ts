import { Container } from "inversify";
import { TYPES } from "./types";
import Elements from './Elements';

const container = new Container();
container.bind(TYPES.Plugin).to(Elements);