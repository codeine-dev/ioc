import { expect } from 'chai';

import * as ioc from './';

abstract class Greeter {
    public instance: string = "";

    abstract greet(name: string): string;
}

class Hello extends Greeter {
    greet(name: string): string {
        return `Hello, ${name}`;
    }
}

class Goodbye extends Greeter {
    greet(name: string): string {
        return `Goodbye, ${name}`;
    }
}

describe('Basics', () => {
    it('should register a concrete class', () => {
        ioc.register(Greeter, Hello);

        const h = ioc.resolve(Greeter);
        expect(h).to.not.be.undefined;

        if (!h) {
            return
        }
        
        expect(h.greet("User")).to.equal("Hello, User");
        h.instance = "Hello";
        expect(h.instance).to.equal('Hello')

        const h2 = ioc.resolve(Greeter);
        expect(h2?.instance).to.not.equal("Hello");
    })

    it('should register a singleton concrete class', () => {
        ioc.registerSingleton(Greeter, Goodbye);

        const g = ioc.resolve(Greeter)
        expect(g).to.not.be.undefined
        if (!g) {
            return;
        }

        g.instance = "Bye"
        expect(g?.instance).to.not.be.undefined
        expect(g?.greet("User")).to.equal("Goodbye, User");

        const g2 = ioc.resolve(Greeter)
        expect(g2?.instance).to.equal(g.instance);
    })
})