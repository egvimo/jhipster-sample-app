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

describe('Abc9 e2e test', () => {
  const abc9PageUrl = '/abc-9';
  const abc9PageUrlPattern = new RegExp('/abc-9(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const abc9Sample = { name: 'Stand-alone azure' };

  let abc9: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/abc-9-s+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/abc-9-s').as('postEntityRequest');
    cy.intercept('DELETE', '/api/abc-9-s/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (abc9) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/abc-9-s/${abc9.id}`,
      }).then(() => {
        abc9 = undefined;
      });
    }
  });

  it('Abc9s menu should load Abc9s page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('abc-9');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Abc9').should('exist');
    cy.url().should('match', abc9PageUrlPattern);
  });

  describe('Abc9 page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(abc9PageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Abc9 page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/abc-9/new$'));
        cy.getEntityCreateUpdateHeading('Abc9');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc9PageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/abc-9-s',
          body: abc9Sample,
        }).then(({ body }) => {
          abc9 = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/abc-9-s+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [abc9],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(abc9PageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Abc9 page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('abc9');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc9PageUrlPattern);
      });

      it('edit button click should load edit Abc9 page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Abc9');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc9PageUrlPattern);
      });

      it('last delete button click should delete instance of Abc9', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('abc9').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc9PageUrlPattern);

        abc9 = undefined;
      });
    });
  });

  describe('new Abc9 page', () => {
    beforeEach(() => {
      cy.visit(`${abc9PageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Abc9');
    });

    it('should create an instance of Abc9', () => {
      cy.get(`[data-cy="name"]`).type('deposit Chips').should('have.value', 'deposit Chips');

      cy.get(`[data-cy="otherField"]`).type('Gorgeous').should('have.value', 'Gorgeous');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        abc9 = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', abc9PageUrlPattern);
    });
  });
});
