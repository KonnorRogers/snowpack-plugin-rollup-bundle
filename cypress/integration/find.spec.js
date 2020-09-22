describe('Find all elements on the page', () => {
  beforeEach(() => {
    cy.visit("/")
  })

  it("Finds all elements by test id", () => {
    cy.findByTestId("hello-world").contains("Hello World")

    cy.findByTestId("json-file").contains("hi")

    cy.findByTestId("logo").invoke("attr", "alt").should("include", "logo")
  })
});
