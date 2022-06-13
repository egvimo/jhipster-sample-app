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

describe('Abc25 e2e test', () => {
  const abc25PageUrl = '/abc-25';
  const abc25PageUrlPattern = new RegExp('/abc-25(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const abc25Sample = { name: 'National Music' };

  let abc25: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/abc-25-s+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/abc-25-s').as('postEntityRequest');
    cy.intercept('DELETE', '/api/abc-25-s/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (abc25) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/abc-25-s/${abc25.id}`,
      }).then(() => {
        abc25 = undefined;
      });
    }
  });

  it('Abc25s menu should load Abc25s page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('abc-25');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Abc25').should('exist');
    cy.url().should('match', abc25PageUrlPattern);
  });

  describe('Abc25 page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(abc25PageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Abc25 page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/abc-25/new$'));
        cy.getEntityCreateUpdateHeading('Abc25');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc25PageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/abc-25-s',
          body: abc25Sample,
        }).then(({ body }) => {
          abc25 = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/abc-25-s+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [abc25],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(abc25PageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Abc25 page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('abc25');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc25PageUrlPattern);
      });

      it('edit button click should load edit Abc25 page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Abc25');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc25PageUrlPattern);
      });

      it('last delete button click should delete instance of Abc25', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('abc25').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc25PageUrlPattern);

        abc25 = undefined;
      });
    });
  });

  describe('new Abc25 page', () => {
    beforeEach(() => {
      cy.visit(`${abc25PageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Abc25');
    });

    it('should create an instance of Abc25', () => {
      cy.get(`[data-cy="name"]`).type('Sausages front-end violet').should('have.value', 'Sausages front-end violet');

      cy.get(`[data-cy="otherField"]`).type('Money Concrete red').should('have.value', 'Money Concrete red');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        abc25 = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', abc25PageUrlPattern);
    });
  });
});
