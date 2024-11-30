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
        cy.get("nav").find("a[href='./modules/notMerged.html']");
    });

    it("contains a merged module link for a and b", () => {
        cy.get("nav").find("a[href='./modules/merged.html']");
    });

    it("contains a link to the project documentation", () => {
        cy.get("nav").find("a[href='./documents/doc1.html']");
    });
});

describe("modules/notMerged.html", () => {
    beforeEach(() => {
        cy.visit("./merge-module/output/modules/notMerged.html");
    });

    it("contains a sub link to the class C", () => {
        cy.get("nav").find("a[href='../classes/notMerged.C.html']");
    });

    it("contains the category Gamma and its description", () => {
        const sectionSelector = ".col-content .tsd-panel-group:nth-of-type(1)";

        cy.get(sectionSelector + " h2").should("contain", "Gamma");
        cy.get(sectionSelector + " p").should("have.text", "Category description from the file of C.");
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

    it("contains the category Alpha and its description", () => {
        const sectionSelector = ".col-content .tsd-panel-group:nth-of-type(1)";

        cy.get(sectionSelector + " h2").should("contain", "Alpha");
        cy.get(sectionSelector + " p").should("have.text", "Category description from the file of A.");
    });

    it("contains the category Beta and its description", () => {
        const sectionSelector = ".col-content .tsd-panel-group:nth-of-type(2)";

        cy.get(sectionSelector + " h2").should("contain", "Beta");
        cy.get(sectionSelector + " p").should("have.text", "Category description from the file of B.");
    });
});
