/// <reference types="cypress" />
describe("index.html", () => {
    beforeEach(() => {
        cy.visit("./default-export-rename-on/output/index.html");
    });

    it("renamed default to A", () => {
        cy.get("nav").find("a[href='./classes/A.html']");
        cy.get("nav").find("a[href='./classes/default.html']").should("not.exist");
    });

    it("didn't rename B", () => {
        cy.get("nav").find("a[href='./classes/B.html']");
    });
});
