/// <reference types="cypress" />
describe("index.html", () => {
    beforeEach(() => {
        cy.visit("./merge-module/output/index.html");
    });

    it("contains no module links for a and b", () => {
        cy.get("nav").find("a[href='./modules/a.html']").should("not.exist");
        cy.get("nav").find("a[href='./modules/b.html']").should("not.exist");
    });

    it("contains a separate module link for c", () => {
        cy.get("nav").find("a[href='./modules/c.html']");
    });

    it("contains a merged module link for a and b", () => {
        cy.get("nav").find("a[href='./modules/merged.html']");
    });

    it("contains a link to the project documentation", () => {
        cy.get("nav").find("a[href='./documents/doc1.html']");
    });
});

describe("modules/c.html", () => {
    beforeEach(() => {
        cy.visit("./merge-module/output/modules/c.html");
    });

    it("contains a sub link to the class C", () => {
        cy.get("nav").find("a[href='../classes/c.C.html']");
    });
});

describe("modules/merged.html", () => {
    beforeEach(() => {
        cy.visit("./merge-module/output/modules/merged.html");
    });

    it("contains sub links to the classes A and B", () => {
        cy.get("nav").find("a[href='../classes/merged.A.html']");
        cy.get("nav").find("a[href='../classes/merged.B.html']");
    });
});
