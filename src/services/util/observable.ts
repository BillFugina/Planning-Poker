export interface IObservable<T> {
    subscribe(handler: EventHandler<T>): Subscription<T>;
    unsubscribe(token: Subscription<T> | EventHandler<T>);
    notify(newValue: T, oldValue: T);
}

export type EventHandler<T> = (newValue: T, oldValue?: T) => void;
export type SubscriptionToken<T> = Subscription<T> | EventHandler<T>;

export class Subscription<T> {
    id: number;
    handler: EventHandler<T>;

    constructor(id: number, handler: EventHandler<T>) {
        this.id = id;
        this.handler = handler;
    }
}

export class Observable<T> implements IObservable<T> {
    private subscriptions: Subscription<T>[] = [];

    subscribe = (handler: EventHandler<T>): Subscription<T> => {
        const self = this;
        const sub = new Subscription(self.subscriptions.length, handler);
        self.subscriptions.push(sub);
        return sub;
    }

    unsubscribe = (token: SubscriptionToken<T>) => {
        const self = this;
        if (token instanceof Subscription) {
            const ndx = self.subscriptions.findIndex(x => x.id === token.id);
            if (ndx >= 0){
                self.subscriptions.splice(ndx, 1);
            }
        } else {
            const ndx = self.subscriptions.findIndex(x => x.handler === token);
            if (ndx >= 0){
                self.subscriptions.splice(ndx, 1);
            }
        }
    }

    notify = (newValue: T, oldValue: T) => {
        const self = this;
        self.subscriptions.forEach(sub => {
            if (sub.handler != null) {
                sub.handler(newValue, oldValue);
            }
        });
    }
}
