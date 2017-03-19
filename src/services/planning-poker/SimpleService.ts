import { ISimpleService } from "services/planning-poker";

export class SimpleService implements ISimpleService {
    HelloWorld(): string {
        return "Hello World"
    }
}