global.codeine = Object.assign(global.codeine ?? {}, {
    ioc: global.codeine?.ioc ?? new Map(),
});

type Class = { prototype: { constructor: new (...args: any[]) => never }, name: string };
type Classish = { prototype: { constructor: any }, name: string };
type Constructor<T extends Classish> = T extends { prototype: infer U, name: string } ? U : never;

function constructConcrete<T extends Class>(concrete: T): Constructor<T> {
    const c = new concrete.prototype.constructor();
    return c
}

function registerIoC(target: Classish, fn: Function) {
    global.codeine.ioc.set(target.name, fn)
}

export function register(target: Classish, concrete: Classish) {
    registerIoC(target, () => constructConcrete(concrete))
}

export function registerSingleton(target: Classish, concrete: Classish) {
    const singleton = constructConcrete(concrete);
    registerIoC(target, () => singleton);
}

export function resolve<T extends Classish>(target: T): Constructor<T> | undefined {
    const key = target.name;
    const resolver = global.codeine.ioc.get(key);
    if (resolver) {
        return resolver()
    }

    return undefined;
}
