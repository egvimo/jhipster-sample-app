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

describe('Abc29 e2e test', () => {
  const abc29PageUrl = '/abc-29';
  const abc29PageUrlPattern = new RegExp('/abc-29(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const abc29Sample = { name: 'Bike Keyboard' };

  let abc29: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/abc-29-s+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/abc-29-s').as('postEntityRequest');
    cy.intercept('DELETE', '/api/abc-29-s/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (abc29) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/abc-29-s/${abc29.id}`,
      }).then(() => {
        abc29 = undefined;
      });
    }
  });

  it('Abc29s menu should load Abc29s page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('abc-29');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Abc29').should('exist');
    cy.url().should('match', abc29PageUrlPattern);
  });

  describe('Abc29 page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(abc29PageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Abc29 page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/abc-29/new$'));
        cy.getEntityCreateUpdateHeading('Abc29');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc29PageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/abc-29-s',
          body: abc29Sample,
        }).then(({ body }) => {
          abc29 = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/abc-29-s+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [abc29],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(abc29PageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Abc29 page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('abc29');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc29PageUrlPattern);
      });

      it('edit button click should load edit Abc29 page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Abc29');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc29PageUrlPattern);
      });

      it('last delete button click should delete instance of Abc29', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('abc29').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc29PageUrlPattern);

        abc29 = undefined;
      });
    });
  });

  describe('new Abc29 page', () => {
    beforeEach(() => {
      cy.visit(`${abc29PageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Abc29');
    });

    it('should create an instance of Abc29', () => {
      cy.get(`[data-cy="name"]`).type('convergence withdrawal').should('have.value', 'convergence withdrawal');

      cy.get(`[data-cy="otherField"]`).type('red').should('have.value', 'red');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        abc29 = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', abc29PageUrlPattern);
    });
  });
});
