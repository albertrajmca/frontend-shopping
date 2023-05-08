describe('My First Test', () => {
    beforeEach(() => {
        cy.visit('http://localhost:8081/signup')
      })
    it('Visits the Shopware', () => {
      cy.visit('http://localhost:8081/signup')
    }) 
    it('validate the email and password fields', () => {
        cy.get('[data-cy="name-field"]').type('Albert Sebastiar')
        cy.get('[data-cy="email-field"]').type('albert')
        cy.get('[data-cy="password-field"]').type('albert')
        cy.get('[data-cy="email-field"] .v-messages__message')
        .should('have.text', 'Invalid email address')
        cy.get('[data-cy="con-password-field"]').type('albe')
        cy.get('[data-cy="con-password-field"] .v-messages__message')
        .should('have.text', 'Passwords do not match')
        cy.get('[data-cy=submit]')
            .should('be.disabled');
        cy.get('[data-cy="con-password-field"]')
        .invoke('show') 
        .type('rt') 

        cy.get('[data-cy="email-field"]').type('@gmail.com')

        cy.get('[data-cy=submit]')
        .should('be.enabled');
        cy.get('[data-cy=submit]').click()        
    })

  })