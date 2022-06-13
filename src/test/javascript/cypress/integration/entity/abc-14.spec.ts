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

describe('Abc14 e2e test', () => {
  const abc14PageUrl = '/abc-14';
  const abc14PageUrlPattern = new RegExp('/abc-14(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const abc14Sample = { name: 'Unbranded Granite connecting' };

  let abc14: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/abc-14-s+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/abc-14-s').as('postEntityRequest');
    cy.intercept('DELETE', '/api/abc-14-s/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (abc14) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/abc-14-s/${abc14.id}`,
      }).then(() => {
        abc14 = undefined;
      });
    }
  });

  it('Abc14s menu should load Abc14s page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('abc-14');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Abc14').should('exist');
    cy.url().should('match', abc14PageUrlPattern);
  });

  describe('Abc14 page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(abc14PageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Abc14 page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/abc-14/new$'));
        cy.getEntityCreateUpdateHeading('Abc14');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc14PageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/abc-14-s',
          body: abc14Sample,
        }).then(({ body }) => {
          abc14 = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/abc-14-s+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [abc14],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(abc14PageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Abc14 page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('abc14');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc14PageUrlPattern);
      });

      it('edit button click should load edit Abc14 page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Abc14');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc14PageUrlPattern);
      });

      it('last delete button click should delete instance of Abc14', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('abc14').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc14PageUrlPattern);

        abc14 = undefined;
      });
    });
  });

  describe('new Abc14 page', () => {
    beforeEach(() => {
      cy.visit(`${abc14PageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Abc14');
    });

    it('should create an instance of Abc14', () => {
      cy.get(`[data-cy="name"]`).type('Buckinghamshire upward-trending').should('have.value', 'Buckinghamshire upward-trending');

      cy.get(`[data-cy="otherField"]`).type('quantify').should('have.value', 'quantify');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        abc14 = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', abc14PageUrlPattern);
    });
  });
});
