describe("index.html", () => {
    beforeEach(() => {
        cy.visit("./merge-off/output/index.html");
    });

    it("contains separate module links for a, b, and c", () => {
        cy.get("nav").find("a[href='modules/a.html']");
        cy.get("nav").find("a[href='modules/b.html']");
        cy.get("nav").find("a[href='modules/c.html']");
    });

    it("contains sub links to the classes A, B and C", () => {
        cy.get("nav").find("a[href='classes/a.A.html']");
        cy.get("nav").find("a[href='classes/b.B.html']");
        cy.get("nav").find("a[href='classes/c.C.html']");
    });
});
