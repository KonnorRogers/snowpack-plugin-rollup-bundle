describe('Find all elements on the page', () => {
  beforeEach(() => {
    cy.visit("/")
  })

  it("Finds all elements by test id", () => {
    cy.findByTestId()
  })
});
