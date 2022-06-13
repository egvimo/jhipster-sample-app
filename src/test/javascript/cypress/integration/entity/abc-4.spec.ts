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

describe('Abc4 e2e test', () => {
  const abc4PageUrl = '/abc-4';
  const abc4PageUrlPattern = new RegExp('/abc-4(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const abc4Sample = { name: 'Health Account cross-platform' };

  let abc4: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/abc-4-s+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/abc-4-s').as('postEntityRequest');
    cy.intercept('DELETE', '/api/abc-4-s/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (abc4) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/abc-4-s/${abc4.id}`,
      }).then(() => {
        abc4 = undefined;
      });
    }
  });

  it('Abc4s menu should load Abc4s page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('abc-4');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Abc4').should('exist');
    cy.url().should('match', abc4PageUrlPattern);
  });

  describe('Abc4 page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(abc4PageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Abc4 page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/abc-4/new$'));
        cy.getEntityCreateUpdateHeading('Abc4');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc4PageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/abc-4-s',
          body: abc4Sample,
        }).then(({ body }) => {
          abc4 = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/abc-4-s+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [abc4],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(abc4PageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Abc4 page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('abc4');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc4PageUrlPattern);
      });

      it('edit button click should load edit Abc4 page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Abc4');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc4PageUrlPattern);
      });

      it('last delete button click should delete instance of Abc4', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('abc4').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc4PageUrlPattern);

        abc4 = undefined;
      });
    });
  });

  describe('new Abc4 page', () => {
    beforeEach(() => {
      cy.visit(`${abc4PageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Abc4');
    });

    it('should create an instance of Abc4', () => {
      cy.get(`[data-cy="name"]`).type('service-desk District').should('have.value', 'service-desk District');

      cy.get(`[data-cy="otherField"]`).type('Zealand withdrawal').should('have.value', 'Zealand withdrawal');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        abc4 = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', abc4PageUrlPattern);
    });
  });
});
