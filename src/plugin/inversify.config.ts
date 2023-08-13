import "reflect-metadata"
import { Container } from "inversify"
import TYPES from "./types"
import { type IElements, Elements } from './Elements';
import { WinstonLogger } from '../lib/logger/winston/WinstonLogger';


const container = new Container()

container.bind(TYPES.IElements).to(Elements).inSingletonScope()
container.bind(TYPES.Logger).to(WinstonLogger).inSingletonScope()

export default container