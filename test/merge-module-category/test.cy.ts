describe("index.html", () => {
    beforeEach(() => {
        cy.visit("./merge-module-category/output/index.html");
    });

    it("contains a separate module and class link for the class E which has no @module jsdoc tag", () => {
        cy.get("nav").find("a[href='modules/e.html']");
        cy.get("nav").find("a[href='classes/e.E.html']");
    });

    it("contains 3 merged module links", () => {
        cy.get("nav").find("a[href='modules/merged.html']"); // for A & B
        cy.get("nav").find("a[href='modules/merged-1.html']"); // for C
        cy.get("nav").find("a[href='modules/merged-2.html']"); // for D
    });

    it("merged the modules of A and B", () => {
        cy.get("nav").find("a[href='classes/merged.A.html']");
        cy.get("nav").find("a[href='classes/merged.B.html']");
    });

    it("didn't merge the modules of C and D", () => {
        cy.get("nav").find("a[href='classes/merged-1.C.html']");
        cy.get("nav").find("a[href='classes/merged-2.D.html']");
    });
});
