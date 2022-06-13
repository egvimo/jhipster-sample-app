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

describe('Abc10 e2e test', () => {
  const abc10PageUrl = '/abc-10';
  const abc10PageUrlPattern = new RegExp('/abc-10(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const abc10Sample = { name: 'Factors' };

  let abc10: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/abc-10-s+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/abc-10-s').as('postEntityRequest');
    cy.intercept('DELETE', '/api/abc-10-s/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (abc10) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/abc-10-s/${abc10.id}`,
      }).then(() => {
        abc10 = undefined;
      });
    }
  });

  it('Abc10s menu should load Abc10s page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('abc-10');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Abc10').should('exist');
    cy.url().should('match', abc10PageUrlPattern);
  });

  describe('Abc10 page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(abc10PageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Abc10 page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/abc-10/new$'));
        cy.getEntityCreateUpdateHeading('Abc10');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc10PageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/abc-10-s',
          body: abc10Sample,
        }).then(({ body }) => {
          abc10 = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/abc-10-s+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [abc10],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(abc10PageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Abc10 page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('abc10');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc10PageUrlPattern);
      });

      it('edit button click should load edit Abc10 page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Abc10');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc10PageUrlPattern);
      });

      it('last delete button click should delete instance of Abc10', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('abc10').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc10PageUrlPattern);

        abc10 = undefined;
      });
    });
  });

  describe('new Abc10 page', () => {
    beforeEach(() => {
      cy.visit(`${abc10PageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Abc10');
    });

    it('should create an instance of Abc10', () => {
      cy.get(`[data-cy="name"]`).type('Central').should('have.value', 'Central');

      cy.get(`[data-cy="otherField"]`).type('secured Borders Clothing').should('have.value', 'secured Borders Clothing');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        abc10 = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', abc10PageUrlPattern);
    });
  });
});
