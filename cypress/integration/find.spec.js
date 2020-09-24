describe('Find all elements on the page', () => {
  beforeEach(() => {
    cy.visit("/")
  })

  it("Finds all elements by test id", () => {
    cy.findByTestId("hello-world").should("contain", "Hello World")

    cy.findByTestId("json-file").should("contain", "hi")

    cy.findByTestId("logo").should("have.attr", "alt", "logo").should("have.attr", "src").and("match", /logo-?\w*.svg/)

    cy.findByTestId("javascript-index").should("contain", "hello from javascript")

    cy.findByTestId("green-button").screenshot().should("contain", "I'm a Button").should("have.css", "background-color", "rgb(144, 238, 144)")

    cy.findByTestId("small-house").screenshot().should("have.class", "small-house").should("have.attr", "src").and("match", /small-house-?\w*.png/)
  })
});
