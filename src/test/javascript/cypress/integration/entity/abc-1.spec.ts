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

describe('Abc1 e2e test', () => {
  const abc1PageUrl = '/abc-1';
  const abc1PageUrlPattern = new RegExp('/abc-1(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const abc1Sample = { name: 'Branding' };

  let abc1: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/abc-1-s+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/abc-1-s').as('postEntityRequest');
    cy.intercept('DELETE', '/api/abc-1-s/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (abc1) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/abc-1-s/${abc1.id}`,
      }).then(() => {
        abc1 = undefined;
      });
    }
  });

  it('Abc1s menu should load Abc1s page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('abc-1');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Abc1').should('exist');
    cy.url().should('match', abc1PageUrlPattern);
  });

  describe('Abc1 page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(abc1PageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Abc1 page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/abc-1/new$'));
        cy.getEntityCreateUpdateHeading('Abc1');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc1PageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/abc-1-s',
          body: abc1Sample,
        }).then(({ body }) => {
          abc1 = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/abc-1-s+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [abc1],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(abc1PageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Abc1 page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('abc1');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc1PageUrlPattern);
      });

      it('edit button click should load edit Abc1 page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Abc1');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc1PageUrlPattern);
      });

      it('last delete button click should delete instance of Abc1', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('abc1').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc1PageUrlPattern);

        abc1 = undefined;
      });
    });
  });

  describe('new Abc1 page', () => {
    beforeEach(() => {
      cy.visit(`${abc1PageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Abc1');
    });

    it('should create an instance of Abc1', () => {
      cy.get(`[data-cy="name"]`).type('Pizza').should('have.value', 'Pizza');

      cy.get(`[data-cy="otherField"]`).type('solution-oriented knowledge grey').should('have.value', 'solution-oriented knowledge grey');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        abc1 = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', abc1PageUrlPattern);
    });
  });
});
