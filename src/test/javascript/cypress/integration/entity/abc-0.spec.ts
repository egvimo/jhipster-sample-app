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

describe('Abc0 e2e test', () => {
  const abc0PageUrl = '/abc-0';
  const abc0PageUrlPattern = new RegExp('/abc-0(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const abc0Sample = { name: 'Frozen Cheese Fresh' };

  let abc0: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/abc-0-s+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/abc-0-s').as('postEntityRequest');
    cy.intercept('DELETE', '/api/abc-0-s/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (abc0) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/abc-0-s/${abc0.id}`,
      }).then(() => {
        abc0 = undefined;
      });
    }
  });

  it('Abc0s menu should load Abc0s page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('abc-0');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Abc0').should('exist');
    cy.url().should('match', abc0PageUrlPattern);
  });

  describe('Abc0 page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(abc0PageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Abc0 page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/abc-0/new$'));
        cy.getEntityCreateUpdateHeading('Abc0');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc0PageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/abc-0-s',
          body: abc0Sample,
        }).then(({ body }) => {
          abc0 = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/abc-0-s+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [abc0],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(abc0PageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Abc0 page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('abc0');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc0PageUrlPattern);
      });

      it('edit button click should load edit Abc0 page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Abc0');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc0PageUrlPattern);
      });

      it('last delete button click should delete instance of Abc0', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('abc0').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc0PageUrlPattern);

        abc0 = undefined;
      });
    });
  });

  describe('new Abc0 page', () => {
    beforeEach(() => {
      cy.visit(`${abc0PageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Abc0');
    });

    it('should create an instance of Abc0', () => {
      cy.get(`[data-cy="name"]`).type('HTTP Checking Tunisian').should('have.value', 'HTTP Checking Tunisian');

      cy.get(`[data-cy="otherField"]`).type('Wooden help-desk').should('have.value', 'Wooden help-desk');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        abc0 = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', abc0PageUrlPattern);
    });
  });
});
