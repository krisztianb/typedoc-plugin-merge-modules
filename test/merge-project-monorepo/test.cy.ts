/// <reference types="cypress" />
describe("index.html", () => {
    beforeEach(() => {
        cy.visit("./merge-project-monorepo/output/index.html");
    });

    it("contains no module links for a, b, and c", () => {
        cy.get("nav").find("a[href='./modules/a.html']").should("not.exist");
        cy.get("nav").find("a[href='./modules/b.html']").should("not.exist");
        cy.get("nav").find("a[href='./modules/c.html']").should("not.exist");
    });

    it("contains direct links to the classes A, B and C", () => {
        cy.get("nav").find("a[href='./classes/A.html']");
        cy.get("nav").find("a[href='./classes/B.html']");
        cy.get("nav").find("a[href='./classes/C.html']");
    });

    it("contains links to the project documentations", () => {
        cy.get("nav").find("a[href='./documents/doc1.html']");
        cy.get("nav").find("a[href='./documents/doc2.html']");
    });
});
