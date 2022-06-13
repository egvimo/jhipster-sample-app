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

describe('Abc12 e2e test', () => {
  const abc12PageUrl = '/abc-12';
  const abc12PageUrlPattern = new RegExp('/abc-12(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const abc12Sample = { name: 'real-time Nepalese' };

  let abc12: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/abc-12-s+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/abc-12-s').as('postEntityRequest');
    cy.intercept('DELETE', '/api/abc-12-s/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (abc12) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/abc-12-s/${abc12.id}`,
      }).then(() => {
        abc12 = undefined;
      });
    }
  });

  it('Abc12s menu should load Abc12s page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('abc-12');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Abc12').should('exist');
    cy.url().should('match', abc12PageUrlPattern);
  });

  describe('Abc12 page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(abc12PageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Abc12 page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/abc-12/new$'));
        cy.getEntityCreateUpdateHeading('Abc12');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc12PageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/abc-12-s',
          body: abc12Sample,
        }).then(({ body }) => {
          abc12 = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/abc-12-s+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [abc12],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(abc12PageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Abc12 page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('abc12');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc12PageUrlPattern);
      });

      it('edit button click should load edit Abc12 page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Abc12');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc12PageUrlPattern);
      });

      it('last delete button click should delete instance of Abc12', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('abc12').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc12PageUrlPattern);

        abc12 = undefined;
      });
    });
  });

  describe('new Abc12 page', () => {
    beforeEach(() => {
      cy.visit(`${abc12PageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Abc12');
    });

    it('should create an instance of Abc12', () => {
      cy.get(`[data-cy="name"]`).type('Orchestrator Awesome THX').should('have.value', 'Orchestrator Awesome THX');

      cy.get(`[data-cy="otherField"]`).type('Bedfordshire payment driver').should('have.value', 'Bedfordshire payment driver');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        abc12 = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', abc12PageUrlPattern);
    });
  });
});
