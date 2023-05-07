describe("index.html", () => {
    beforeEach(() => {
        cy.visit("./default-export-rename-off/output/index.html");
    });

    it("didn't rename default to A", () => {
        cy.get("nav").find("a[href='classes/default.html']");
        cy.get("nav").find("a[href='classes/A.html']").should("not.exist");
    });

    it("didn't rename B", () => {
        cy.get("nav").find("a[href='classes/B.html']");
    });
});
