import { entityItemSelector } from '../../support/commands';
import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('Abc24 e2e test', () => {
  const abc24PageUrl = '/abc-24';
  const abc24PageUrlPattern = new RegExp('/abc-24(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const abc24Sample = { name: 'Gorgeous Tools' };

  let abc24: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/abc-24-s+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/abc-24-s').as('postEntityRequest');
    cy.intercept('DELETE', '/api/abc-24-s/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (abc24) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/abc-24-s/${abc24.id}`,
      }).then(() => {
        abc24 = undefined;
      });
    }
  });

  it('Abc24s menu should load Abc24s page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('abc-24');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Abc24').should('exist');
    cy.url().should('match', abc24PageUrlPattern);
  });

  describe('Abc24 page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(abc24PageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Abc24 page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/abc-24/new$'));
        cy.getEntityCreateUpdateHeading('Abc24');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc24PageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/abc-24-s',
          body: abc24Sample,
        }).then(({ body }) => {
          abc24 = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/abc-24-s+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [abc24],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(abc24PageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Abc24 page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('abc24');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc24PageUrlPattern);
      });

      it('edit button click should load edit Abc24 page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Abc24');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc24PageUrlPattern);
      });

      it('last delete button click should delete instance of Abc24', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('abc24').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc24PageUrlPattern);

        abc24 = undefined;
      });
    });
  });

  describe('new Abc24 page', () => {
    beforeEach(() => {
      cy.visit(`${abc24PageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Abc24');
    });

    it('should create an instance of Abc24', () => {
      cy.get(`[data-cy="name"]`).type('sensor Cambridgeshire').should('have.value', 'sensor Cambridgeshire');

      cy.get(`[data-cy="otherField"]`).type('backing').should('have.value', 'backing');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        abc24 = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', abc24PageUrlPattern);
    });
  });
});
