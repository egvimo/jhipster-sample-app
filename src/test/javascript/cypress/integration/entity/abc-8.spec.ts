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

describe('Abc8 e2e test', () => {
  const abc8PageUrl = '/abc-8';
  const abc8PageUrlPattern = new RegExp('/abc-8(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const abc8Sample = { name: 'deposit Dynamic' };

  let abc8: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/abc-8-s+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/abc-8-s').as('postEntityRequest');
    cy.intercept('DELETE', '/api/abc-8-s/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (abc8) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/abc-8-s/${abc8.id}`,
      }).then(() => {
        abc8 = undefined;
      });
    }
  });

  it('Abc8s menu should load Abc8s page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('abc-8');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Abc8').should('exist');
    cy.url().should('match', abc8PageUrlPattern);
  });

  describe('Abc8 page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(abc8PageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Abc8 page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/abc-8/new$'));
        cy.getEntityCreateUpdateHeading('Abc8');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc8PageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/abc-8-s',
          body: abc8Sample,
        }).then(({ body }) => {
          abc8 = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/abc-8-s+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [abc8],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(abc8PageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Abc8 page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('abc8');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc8PageUrlPattern);
      });

      it('edit button click should load edit Abc8 page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Abc8');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc8PageUrlPattern);
      });

      it('last delete button click should delete instance of Abc8', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('abc8').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc8PageUrlPattern);

        abc8 = undefined;
      });
    });
  });

  describe('new Abc8 page', () => {
    beforeEach(() => {
      cy.visit(`${abc8PageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Abc8');
    });

    it('should create an instance of Abc8', () => {
      cy.get(`[data-cy="name"]`).type('black next-generation generating').should('have.value', 'black next-generation generating');

      cy.get(`[data-cy="otherField"]`).type('Frozen').should('have.value', 'Frozen');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        abc8 = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', abc8PageUrlPattern);
    });
  });
});
