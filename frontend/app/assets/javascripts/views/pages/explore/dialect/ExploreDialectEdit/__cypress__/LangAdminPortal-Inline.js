// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!

describe('LangAdminPortal.js > LangAdminCreatePortal', () => {
  it('Test to check that a language admin can edit the portal by using the inline pencil.', () => {
    // TODO: Add database setup here.
    // Requires the default portal information and media is all that exists for SENCOTEN.

    /*
            Login as Language Admin.
        */
    cy.login({
      userName: 'SENCOTEN_ADMIN_USERNAME',
      userPassword: 'SENCOTEN_ADMIN_PASSWORD',
      url: 'https://dev.firstvoices.com/nuxeo/startup',
    })
    cy.visit('/explore/FV/Workspaces/Data/TEst/Test/Sencoten')
    cy.wait(500)

    // Add to the greeting.
    cy.get('button[class="EditableComponent__btnEdit FlatButton FlatButton--compact"]')
      .eq(0)
      .click()
    cy.get('[name="fv-portal:greeting"]').type('TestPortalInlineGreeting')
    cy.getByText('Save').click()

    // Add to the about section.
    cy.get('button[class="EditableComponent__btnEdit FlatButton FlatButton--compact"]')
      .eq(1)
      .click()
    cy.get('div.ql-editor.ql-blank').type('TestPortalInlineAbout')
    cy.getByText('Save').click()

    // Add to the news section.
    cy.get('button[class="EditableComponent__btnEdit FlatButton FlatButton--compact"]')
      .eq(2)
      .click()
    cy.get('div.ql-editor.ql-blank').type('TestPortalInlineNews')
    cy.getByText('Save').click()

    // Add to the related links section.
    cy.get('button[class="EditableComponent__btnEdit FlatButton FlatButton--compact"]')
      .eq(3)
      .click()
    cy.getByText('+ Add new').click()
    cy.getByText('Edit Link').click()
    cy.getByText('Add New Link To Sencoten')
      .parent()
      .within(() => {
        cy.get('[name="dc:title"]').type('TestPortalInlineRelatedLinkTitle')
        cy.get('[name="dc:description"]').type('TestPortalInlineRelatedLinkDescription')
        cy.get('[name="fvlink:url"]').type('https://dev.firstvoices.com/explore/FV/Workspaces/Data/TEst/Test/Sencoten')
        cy.getByText('Save').click()
      })
    cy.getByText('Save').click()

    // Change country.
    cy.get('button[class="EditableComponent__btnEdit FlatButton FlatButton--compact"]')
      .eq(4)
      .click()
    cy.getByTestId('fvdialect-country').select('United States')
    cy.getByText('Save').click()

    // Add to region section.
    cy.get('button[class="EditableComponent__btnEdit FlatButton FlatButton--compact"]')
      .eq(5)
      .click()
    cy.getByTestId('EditableComponent__fv-dialect-region').within(() => {
      cy.get('[class="form-control"]').type('TestPortalInlineRegion')
    })
    cy.getByText('Save').click()

    /*
            Reload the page and make sure all changes are visible.
         */
    cy.reload()
    cy.getByText('TestPortalInlineGreeting').should('exist')
    cy.getByText('TestPortalInlineAbout').should('exist')
    cy.getByText('TestPortalInlineNews').should('exist')
    cy.getByText('TestPortalInlineRelatedLinkTitle').should('exist')
    cy.getByText('US', { exact: true }).should('exist')
    cy.getByText('TestPortalInlineRegion').should('exist')

    /*
      Test to make sure the public view does not change yet.
     */
    cy.getByText('Public View').click()
    cy.queryByText('TestPortalInlineGreeting').should('not.exist')
    cy.queryByText('TestPortalInlineAbout').should('not.exist')
    cy.queryByText('TestPortalInlineNews').should('not.exist')
    cy.queryByText('TestPortalInlineRelatedLinkTitle').should('not.exist')
  })
})