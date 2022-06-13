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

describe('Abc27 e2e test', () => {
  const abc27PageUrl = '/abc-27';
  const abc27PageUrlPattern = new RegExp('/abc-27(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const abc27Sample = { name: 'Research Upgradable Pine' };

  let abc27: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/abc-27-s+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/abc-27-s').as('postEntityRequest');
    cy.intercept('DELETE', '/api/abc-27-s/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (abc27) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/abc-27-s/${abc27.id}`,
      }).then(() => {
        abc27 = undefined;
      });
    }
  });

  it('Abc27s menu should load Abc27s page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('abc-27');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Abc27').should('exist');
    cy.url().should('match', abc27PageUrlPattern);
  });

  describe('Abc27 page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(abc27PageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Abc27 page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/abc-27/new$'));
        cy.getEntityCreateUpdateHeading('Abc27');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc27PageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/abc-27-s',
          body: abc27Sample,
        }).then(({ body }) => {
          abc27 = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/abc-27-s+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [abc27],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(abc27PageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Abc27 page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('abc27');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc27PageUrlPattern);
      });

      it('edit button click should load edit Abc27 page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Abc27');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc27PageUrlPattern);
      });

      it('last delete button click should delete instance of Abc27', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('abc27').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc27PageUrlPattern);

        abc27 = undefined;
      });
    });
  });

  describe('new Abc27 page', () => {
    beforeEach(() => {
      cy.visit(`${abc27PageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Abc27');
    });

    it('should create an instance of Abc27', () => {
      cy.get(`[data-cy="name"]`).type('Enterprise-wide indigo').should('have.value', 'Enterprise-wide indigo');

      cy.get(`[data-cy="otherField"]`).type('ivory Account').should('have.value', 'ivory Account');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        abc27 = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', abc27PageUrlPattern);
    });
  });
});
