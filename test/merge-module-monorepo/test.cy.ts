/// <reference types="cypress" />
describe("index.html", () => {
    beforeEach(() => {
        cy.visit("./merge-module-monorepo/output/index.html");
    });

    it("contains no module links for the 'index' modules", () => {
        cy.get("nav").find("a[href='./modules/Project_1.index.html']").should("not.exist");
        cy.get("nav").find("a[href='./modules/Project_2.index.html']").should("not.exist");
    });

    it("contains a module link for 'Project 1'", () => {
        cy.get("nav").find("a[href='./modules/Project_1.html']");
    });

    it("contains a link to the project documentation of 'Project 1'", () => {
        cy.get("nav").find("a[href='./documents/Project_1.doc1.html']");
    });

    it("contains no module link for the 'merged' module within 'Project 1'", () => {
        cy.get("nav").find("a[href='./modules/Project_1.merged.html']").should("not.exist");
    });

    it("contains a module link for 'Project 2'", () => {
        cy.get("nav").find("a[href='./modules/Project_2.html']");
    });

    it("contains a link to the project documentation of 'Project 2'", () => {
        cy.get("nav").find("a[href='./documents/Project_2.doc2.html']");
    });

    it("contains links for the 'merged' module within 'Project 2'", () => {
        cy.get("nav").find("a[href='./modules/Project_2.merged.html']");
        cy.get("nav").find("a[href='./classes/Project_2.merged.A.html']");
        cy.get("nav").find("a[href='./classes/Project_2.merged.B.html']");
        cy.get("nav").find("a[href='./classes/Project_2.merged.C.html']");
    });
});

describe("modules/Project_2.merged.html", () => {
    beforeEach(() => {
        cy.visit("./merge-module-monorepo/output/modules/Project_2.merged.html");
    });

    it("contains index links to the classes A, B and C", () => {
        cy.get(".col-content .tsd-index-list").find("a[href='../classes/Project_2.merged.A.html']");
        cy.get(".col-content .tsd-index-list").find("a[href='../classes/Project_2.merged.B.html']");
        cy.get(".col-content .tsd-index-list").find("a[href='../classes/Project_2.merged.C.html']");
    });
});
