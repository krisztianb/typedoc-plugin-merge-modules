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

describe("modules.html", () => {
    beforeEach(() => {
        cy.visit("./merge-project-monorepo/output/modules.html");
    });

    it("contains the category Alpha and its description", () => {
        const sectionSelector = ".col-content .tsd-panel-group:nth-of-type(1)";

        cy.get(sectionSelector + " h2").should("have.text", " Alpha");
        cy.get(sectionSelector + " p").should("have.text", "Category description from the file of A.");
    });

    it("contains the category Beta and its description", () => {
        const sectionSelector = ".col-content .tsd-panel-group:nth-of-type(2)";

        cy.get(sectionSelector + " h2").should("have.text", " Beta");
        cy.get(sectionSelector + " p").should("have.text", "Category description from the file of B.");
    });

    it("contains the category Gamma and its description", () => {
        const sectionSelector = ".col-content .tsd-panel-group:nth-of-type(3)";

        cy.get(sectionSelector + " h2").should("have.text", " Gamma");
        cy.get(sectionSelector + " p").should("have.text", "Category description from the file of C.");
    });
});
