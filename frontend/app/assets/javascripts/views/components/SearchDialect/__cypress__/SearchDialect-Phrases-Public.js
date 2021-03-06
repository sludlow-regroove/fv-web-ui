// NOTE: this file will be copied to `cypress/integration` and run from there,
// so imports paths will be based on that location!
import 'cypress-testing-library/add-commands'
import testSearchPhrases from '../../../app/assets/javascripts/views/components/SearchDialect/__cypress__/common/testSearchPhrases.js'

describe('SearchDialectPhrases-Public.js > SearchDialect', () => {
  it('Select letter with enough results for pagination, confirm has data, navigate to next page, confirm has data', () => {
    /*
      Temporary line to force the test to fail until it is updated.
    */
    cy.log('Forcing the test to fail until it is updated for dev.').then(() => {
      cy.expect(true).to.equal(false)
    })

    cy.visit('/explore/FV/sections/Data/Athabascan/Dene/Dene/learn/phrases')
    testSearchPhrases()
  })
})
