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

describe('Abc23 e2e test', () => {
  const abc23PageUrl = '/abc-23';
  const abc23PageUrlPattern = new RegExp('/abc-23(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const abc23Sample = { name: 'auxiliary' };

  let abc23: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/abc-23-s+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/abc-23-s').as('postEntityRequest');
    cy.intercept('DELETE', '/api/abc-23-s/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (abc23) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/abc-23-s/${abc23.id}`,
      }).then(() => {
        abc23 = undefined;
      });
    }
  });

  it('Abc23s menu should load Abc23s page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('abc-23');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Abc23').should('exist');
    cy.url().should('match', abc23PageUrlPattern);
  });

  describe('Abc23 page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(abc23PageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Abc23 page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/abc-23/new$'));
        cy.getEntityCreateUpdateHeading('Abc23');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc23PageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/abc-23-s',
          body: abc23Sample,
        }).then(({ body }) => {
          abc23 = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/abc-23-s+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [abc23],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(abc23PageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Abc23 page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('abc23');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc23PageUrlPattern);
      });

      it('edit button click should load edit Abc23 page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Abc23');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc23PageUrlPattern);
      });

      it('last delete button click should delete instance of Abc23', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('abc23').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc23PageUrlPattern);

        abc23 = undefined;
      });
    });
  });

  describe('new Abc23 page', () => {
    beforeEach(() => {
      cy.visit(`${abc23PageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Abc23');
    });

    it('should create an instance of Abc23', () => {
      cy.get(`[data-cy="name"]`).type('New').should('have.value', 'New');

      cy.get(`[data-cy="otherField"]`).type('Granite Rustic Keyboard').should('have.value', 'Granite Rustic Keyboard');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        abc23 = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', abc23PageUrlPattern);
    });
  });
});
