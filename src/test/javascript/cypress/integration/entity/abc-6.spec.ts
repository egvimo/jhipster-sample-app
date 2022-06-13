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

describe('Abc6 e2e test', () => {
  const abc6PageUrl = '/abc-6';
  const abc6PageUrlPattern = new RegExp('/abc-6(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const abc6Sample = { name: 'redundant Account' };

  let abc6: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/abc-6-s+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/abc-6-s').as('postEntityRequest');
    cy.intercept('DELETE', '/api/abc-6-s/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (abc6) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/abc-6-s/${abc6.id}`,
      }).then(() => {
        abc6 = undefined;
      });
    }
  });

  it('Abc6s menu should load Abc6s page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('abc-6');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Abc6').should('exist');
    cy.url().should('match', abc6PageUrlPattern);
  });

  describe('Abc6 page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(abc6PageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Abc6 page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/abc-6/new$'));
        cy.getEntityCreateUpdateHeading('Abc6');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc6PageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/abc-6-s',
          body: abc6Sample,
        }).then(({ body }) => {
          abc6 = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/abc-6-s+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [abc6],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(abc6PageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Abc6 page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('abc6');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc6PageUrlPattern);
      });

      it('edit button click should load edit Abc6 page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Abc6');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc6PageUrlPattern);
      });

      it('last delete button click should delete instance of Abc6', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('abc6').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc6PageUrlPattern);

        abc6 = undefined;
      });
    });
  });

  describe('new Abc6 page', () => {
    beforeEach(() => {
      cy.visit(`${abc6PageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Abc6');
    });

    it('should create an instance of Abc6', () => {
      cy.get(`[data-cy="name"]`).type('Hessen panel').should('have.value', 'Hessen panel');

      cy.get(`[data-cy="otherField"]`).type('grey Rubber Awesome').should('have.value', 'grey Rubber Awesome');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        abc6 = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', abc6PageUrlPattern);
    });
  });
});
