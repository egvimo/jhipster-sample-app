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

describe('Abc17 e2e test', () => {
  const abc17PageUrl = '/abc-17';
  const abc17PageUrlPattern = new RegExp('/abc-17(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const abc17Sample = { name: 'Balboa upward-trending' };

  let abc17: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/abc-17-s+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/abc-17-s').as('postEntityRequest');
    cy.intercept('DELETE', '/api/abc-17-s/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (abc17) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/abc-17-s/${abc17.id}`,
      }).then(() => {
        abc17 = undefined;
      });
    }
  });

  it('Abc17s menu should load Abc17s page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('abc-17');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Abc17').should('exist');
    cy.url().should('match', abc17PageUrlPattern);
  });

  describe('Abc17 page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(abc17PageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Abc17 page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/abc-17/new$'));
        cy.getEntityCreateUpdateHeading('Abc17');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc17PageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/abc-17-s',
          body: abc17Sample,
        }).then(({ body }) => {
          abc17 = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/abc-17-s+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [abc17],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(abc17PageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Abc17 page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('abc17');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc17PageUrlPattern);
      });

      it('edit button click should load edit Abc17 page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Abc17');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc17PageUrlPattern);
      });

      it('last delete button click should delete instance of Abc17', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('abc17').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc17PageUrlPattern);

        abc17 = undefined;
      });
    });
  });

  describe('new Abc17 page', () => {
    beforeEach(() => {
      cy.visit(`${abc17PageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Abc17');
    });

    it('should create an instance of Abc17', () => {
      cy.get(`[data-cy="name"]`).type('Thüringen').should('have.value', 'Thüringen');

      cy.get(`[data-cy="otherField"]`).type('Account Investment Point').should('have.value', 'Account Investment Point');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        abc17 = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', abc17PageUrlPattern);
    });
  });
});
