/// <reference types="cypress" />
describe("index.html", () => {
    beforeEach(() => {
        cy.visit("./merge-module-category/output/index.html");
    });

    it("contains a separate module link for the class E which has no @module jsdoc tag", () => {
        cy.get("nav").find("a[href='./modules/e.html']");
    });

    it("contains 3 merged module links", () => {
        cy.get("nav").find("a[href='./modules/merged.html']"); // for A & B
        cy.get("nav").find("a[href='./modules/merged-1.html']"); // for C
        cy.get("nav").find("a[href='./modules/merged-2.html']"); // for D
    });
});

describe("modules/e.html", () => {
    beforeEach(() => {
        cy.visit("./merge-module-category/output/modules/e.html");
    });

    it("contains a sub link to the class E", () => {
        cy.get("nav").find("a[href='../classes/e.E.html']");
    });
});

describe("modules/merged.html", () => {
    beforeEach(() => {
        cy.visit("./merge-module-category/output/modules/merged.html");
    });

    it("contains sub links to the classes A and B", () => {
        cy.get("nav").find("a[href='../classes/merged.A.html']");
        cy.get("nav").find("a[href='../classes/merged.B.html']");
    });
});

describe("modules/merged-1.html", () => {
    beforeEach(() => {
        cy.visit("./merge-module-category/output/modules/merged-1.html");
    });

    it("contains a sub link to the class C", () => {
        cy.get("nav").find("a[href='../classes/merged-1.C.html']");
    });
});

describe("modules/merged-2.html", () => {
    beforeEach(() => {
        cy.visit("./merge-module-category/output/modules/merged-2.html");
    });

    it("contains a sub link to the class D", () => {
        cy.get("nav").find("a[href='../classes/merged-2.D.html']");
    });
});
