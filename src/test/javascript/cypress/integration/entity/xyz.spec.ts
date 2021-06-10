import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('Xyz e2e test', () => {
  let startingEntitiesCount = 0;

  beforeEach(() => {
    cy.getOauth2Data();
    cy.get('@oauth2Data').then(oauth2Data => {
      cy.oauthLogin(oauth2Data, Cypress.env('E2E_USERNAME') || 'admin', Cypress.env('E2E_PASSWORD') || 'admin');
    });
    cy.intercept('GET', '/api/xyzs*').as('entitiesRequest');
    cy.visit('');
    cy.clickOnEntityMenuItem('xyz');
    cy.wait('@entitiesRequest').then(({ request, response }) => (startingEntitiesCount = response.body.length));
    cy.visit('/');
  });

  afterEach(() => {
    cy.get('@oauth2Data').then(oauth2Data => {
      cy.oauthLogout(oauth2Data);
    });
    cy.clearCache();
  });

  it('should load Xyzs', () => {
    cy.intercept('GET', '/api/xyzs*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('xyz');
    cy.wait('@entitiesRequest');
    cy.getEntityHeading('Xyz').should('exist');
    if (startingEntitiesCount === 0) {
      cy.get(entityTableSelector).should('not.exist');
    } else {
      cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount);
    }
    cy.visit('/');
  });

  it('should load details Xyz page', () => {
    cy.intercept('GET', '/api/xyzs*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('xyz');
    cy.wait('@entitiesRequest');
    if (startingEntitiesCount > 0) {
      cy.get(entityDetailsButtonSelector).first().click({ force: true });
      cy.getEntityDetailsHeading('xyz');
      cy.get(entityDetailsBackButtonSelector).should('exist');
    }
    cy.visit('/');
  });

  it('should load create Xyz page', () => {
    cy.intercept('GET', '/api/xyzs*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('xyz');
    cy.wait('@entitiesRequest');
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('Xyz');
    cy.get(entityCreateSaveButtonSelector).should('exist');
    cy.visit('/');
  });

  it('should load edit Xyz page', () => {
    cy.intercept('GET', '/api/xyzs*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('xyz');
    cy.wait('@entitiesRequest');
    if (startingEntitiesCount > 0) {
      cy.get(entityEditButtonSelector).first().click({ force: true });
      cy.getEntityCreateUpdateHeading('Xyz');
      cy.get(entityCreateSaveButtonSelector).should('exist');
    }
    cy.visit('/');
  });

  it('should create an instance of Xyz', () => {
    cy.intercept('GET', '/api/xyzs*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('xyz');
    cy.wait('@entitiesRequest').then(({ request, response }) => (startingEntitiesCount = response.body.length));
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('Xyz');

    cy.get(`[data-cy="uniqueField"]`).type('Borders Lead', { force: true }).invoke('val').should('match', new RegExp('Borders Lead'));

    cy.get(`[data-cy="anotherField"]`)
      .type('Cross-platform Handcrafted', { force: true })
      .invoke('val')
      .should('match', new RegExp('Cross-platform Handcrafted'));

    cy.get(entityCreateSaveButtonSelector).click({ force: true });
    cy.scrollTo('top', { ensureScrollable: false });
    cy.get(entityCreateSaveButtonSelector).should('not.exist');
    cy.intercept('GET', '/api/xyzs*').as('entitiesRequestAfterCreate');
    cy.visit('/');
    cy.clickOnEntityMenuItem('xyz');
    cy.wait('@entitiesRequestAfterCreate');
    cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount + 1);
    cy.visit('/');
  });

  it('should delete last instance of Xyz', () => {
    cy.intercept('GET', '/api/xyzs*').as('entitiesRequest');
    cy.intercept('DELETE', '/api/xyzs/*').as('deleteEntityRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('xyz');
    cy.wait('@entitiesRequest').then(({ request, response }) => {
      startingEntitiesCount = response.body.length;
      if (startingEntitiesCount > 0) {
        cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount);
        cy.get(entityDeleteButtonSelector).last().click({ force: true });
        cy.getEntityDeleteDialogHeading('xyz').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click({ force: true });
        cy.wait('@deleteEntityRequest');
        cy.intercept('GET', '/api/xyzs*').as('entitiesRequestAfterDelete');
        cy.visit('/');
        cy.clickOnEntityMenuItem('xyz');
        cy.wait('@entitiesRequestAfterDelete');
        cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount - 1);
      }
      cy.visit('/');
    });
  });
});
