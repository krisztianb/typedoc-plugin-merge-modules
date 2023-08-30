/// <reference types="cypress" />
describe("index.html", () => {
    beforeEach(() => {
        cy.visit("./merge-module-monorepo/output/index.html");
    });

    it("contains no module links for a, b and c", () => {
        cy.get("nav").find("a[href='modules/a.html']").should("not.exist");
        cy.get("nav").find("a[href='modules/b.html']").should("not.exist");
        cy.get("nav").find("a[href='modules/c.html']").should("not.exist");
    });

    it("contains a module link for 'Project 1'", () => {
        cy.get("nav").find("a[href='modules/Project_1.html']");
    });
});

describe("modules/Project_1.html", () => {
    beforeEach(() => {
        cy.visit("./merge-module-monorepo/output/modules/Project_1.html");
    });

    it("contains sub links to the classes A, B and C", () => {
        cy.get("nav").find("a[href='../classes/Project_1.A.html']");
        cy.get("nav").find("a[href='../classes/Project_1.B.html']");
        cy.get("nav").find("a[href='../classes/Project_1.C.html']");
    });

    it("contains index links to the classes A, B and C", () => {
        cy.get(".col-content .tsd-index-list").find("a[href='../classes/Project_1.A.html']");
        cy.get(".col-content .tsd-index-list").find("a[href='../classes/Project_1.B.html']");
        cy.get(".col-content .tsd-index-list").find("a[href='../classes/Project_1.C.html']");
    });
});
