/// <reference types="cypress" />
describe("index.html", () => {
    beforeEach(() => {
        cy.visit("./merge-off/output/index.html");
    });

    it("contains separate module links for a, b, and c", () => {
        cy.get("nav").find("a[href='modules/a.html']");
        cy.get("nav").find("a[href='modules/b.html']");
        cy.get("nav").find("a[href='modules/c.html']");
    });
});

describe("modules/a.html", () => {
    beforeEach(() => {
        cy.visit("./merge-off/output/modules/a.html");
    });

    it("contains a sub link to the class A", () => {
        cy.get("nav").find("a[href='../classes/a.A.html']");
    });
});

describe("modules/b.html", () => {
    beforeEach(() => {
        cy.visit("./merge-off/output/modules/b.html");
    });

    it("contains a sub link to the class B", () => {
        cy.get("nav").find("a[href='../classes/b.B.html']");
    });
});

describe("modules/c.html", () => {
    beforeEach(() => {
        cy.visit("./merge-off/output/modules/c.html");
    });

    it("contains a sub link to the class C", () => {
        cy.get("nav").find("a[href='../classes/c.C.html']");
    });
});
