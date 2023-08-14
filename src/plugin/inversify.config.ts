import "reflect-metadata"
import { Container } from "inversify"
import TYPES from "./types"
import { WinstonLogger } from '../lib/logger/winston/WinstonLogger';
import { ObsidianElements } from './ObsidianElements';


const container = new Container()

container.bind(TYPES.Elements).to(ObsidianElements).inSingletonScope()
container.bind(TYPES.Logger).to(WinstonLogger).inSingletonScope()

export default container