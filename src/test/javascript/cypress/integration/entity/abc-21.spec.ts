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

describe('Abc21 e2e test', () => {
  const abc21PageUrl = '/abc-21';
  const abc21PageUrlPattern = new RegExp('/abc-21(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const abc21Sample = { name: 'Niedersachsen' };

  let abc21: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/abc-21-s+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/abc-21-s').as('postEntityRequest');
    cy.intercept('DELETE', '/api/abc-21-s/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (abc21) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/abc-21-s/${abc21.id}`,
      }).then(() => {
        abc21 = undefined;
      });
    }
  });

  it('Abc21s menu should load Abc21s page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('abc-21');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Abc21').should('exist');
    cy.url().should('match', abc21PageUrlPattern);
  });

  describe('Abc21 page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(abc21PageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Abc21 page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/abc-21/new$'));
        cy.getEntityCreateUpdateHeading('Abc21');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc21PageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/abc-21-s',
          body: abc21Sample,
        }).then(({ body }) => {
          abc21 = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/abc-21-s+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [abc21],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(abc21PageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Abc21 page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('abc21');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc21PageUrlPattern);
      });

      it('edit button click should load edit Abc21 page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Abc21');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc21PageUrlPattern);
      });

      it('last delete button click should delete instance of Abc21', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('abc21').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc21PageUrlPattern);

        abc21 = undefined;
      });
    });
  });

  describe('new Abc21 page', () => {
    beforeEach(() => {
      cy.visit(`${abc21PageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Abc21');
    });

    it('should create an instance of Abc21', () => {
      cy.get(`[data-cy="name"]`).type('Granite web-enabled').should('have.value', 'Granite web-enabled');

      cy.get(`[data-cy="otherField"]`).type('Fantastic').should('have.value', 'Fantastic');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        abc21 = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', abc21PageUrlPattern);
    });
  });
});
