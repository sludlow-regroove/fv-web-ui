import 'cypress-testing-library/add-commands'
import copy from '../../../app/assets/javascripts/views/pages/explore/dialect/Recorder/internationalization'

describe('Recorder/Create.js > RecorderCreate', () => {
  it('Create', () => {
    /*
    Temporary line to force the test to fail until it is updated.
   */
    cy.log('Forcing the test to fail until it is updated for dev.').then(() => {
      cy.expect(true).to.equal(false)
    })

    // Login
    cy.login()

    cy.visit('/explore/FV/Workspaces/Data/Athabascan/Dene/Dene/create/recorder')
    cy.queryByText(copy.create.title).should('exist')

    // Submit w/no data
    cy.getByText(copy.create.submit).click()

    // Error should be displayed
    cy.getByLabelText(copy.validation.name)

    // Fill in required field
    cy.getByLabelText(`${copy.create.name} *`).type('[CY] Recorder Name')

    // Resubmit
    cy.getByText(copy.create.submit).click()

    // Should see success
    cy.getByText(copy.create.success.title).should('exist')

    // Create another
    cy.getByText(copy.create.success.linkCreateAnother).click()

    // Confirm
    cy.queryByText(copy.create.title).should('exist')

    // Submit w/no data
    cy.getByText(copy.create.submit).click()

    // Error should be displayed
    cy.getByLabelText(copy.validation.name)
  })
})
