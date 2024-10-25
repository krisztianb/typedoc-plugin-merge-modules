/// <reference types="cypress" />
describe("index.html", () => {
    beforeEach(() => {
        cy.visit("./merge-project/output/index.html");
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

    it("contains a link to the project documentation", () => {
        cy.get("nav").find("a[href='./documents/doc1.html']");
    });
});

describe("modules.html", () => {
    beforeEach(() => {
        cy.visit("./merge-project/output/modules.html");
    });

    it("contains the category Alpha and its description", () => {
        const sectionSelector = ".col-content .tsd-index-section:nth-of-type(1)";

        cy.get(sectionSelector + " h3").should("have.text", "Alpha");
        cy.get(sectionSelector + " p").should("have.text", "Category description from the file of A.");
    });

    it("contains the category Beta and its description", () => {
        const sectionSelector = ".col-content .tsd-index-section:nth-of-type(2)";

        cy.get(sectionSelector + " h3").should("have.text", "Beta");
        cy.get(sectionSelector + " p").should("have.text", "Category description from the file of B.");
    });

    it("contains the category Gamma and its description", () => {
        const sectionSelector = ".col-content .tsd-index-section:nth-of-type(3)";

        cy.get(sectionSelector + " h3").should("have.text", "Gamma");
        cy.get(sectionSelector + " p").should("have.text", "Category description from the file of C.");
    });
});
