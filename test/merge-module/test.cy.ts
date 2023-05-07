/// <reference types="cypress" />
describe("index.html", () => {
    beforeEach(() => {
        cy.visit("./merge-module/output/index.html");
    });

    it("contains no module links for a and b", () => {
        cy.get("nav").find("a[href='modules/a.html']").should("not.exist");
        cy.get("nav").find("a[href='modules/b.html']").should("not.exist");
    });

    it("contains a separate module link for c", () => {
        cy.get("nav").find("a[href='modules/c.html']");
    });

    it("contains a merged module link for a and b", () => {
        cy.get("nav").find("a[href='modules/merged.html']");
    });

    it("contains sub links to the classes A, B and C", () => {
        cy.get("nav").find("a[href='classes/merged.A.html']");
        cy.get("nav").find("a[href='classes/merged.B.html']");
        cy.get("nav").find("a[href='classes/c.C.html']");
    });
});
