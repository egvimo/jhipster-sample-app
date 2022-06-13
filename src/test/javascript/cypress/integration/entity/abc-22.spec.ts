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

describe('Abc22 e2e test', () => {
  const abc22PageUrl = '/abc-22';
  const abc22PageUrlPattern = new RegExp('/abc-22(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const abc22Sample = { name: 'redundant invoice Tools' };

  let abc22: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/abc-22-s+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/abc-22-s').as('postEntityRequest');
    cy.intercept('DELETE', '/api/abc-22-s/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (abc22) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/abc-22-s/${abc22.id}`,
      }).then(() => {
        abc22 = undefined;
      });
    }
  });

  it('Abc22s menu should load Abc22s page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('abc-22');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Abc22').should('exist');
    cy.url().should('match', abc22PageUrlPattern);
  });

  describe('Abc22 page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(abc22PageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Abc22 page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/abc-22/new$'));
        cy.getEntityCreateUpdateHeading('Abc22');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc22PageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/abc-22-s',
          body: abc22Sample,
        }).then(({ body }) => {
          abc22 = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/abc-22-s+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [abc22],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(abc22PageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Abc22 page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('abc22');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc22PageUrlPattern);
      });

      it('edit button click should load edit Abc22 page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Abc22');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc22PageUrlPattern);
      });

      it('last delete button click should delete instance of Abc22', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('abc22').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc22PageUrlPattern);

        abc22 = undefined;
      });
    });
  });

  describe('new Abc22 page', () => {
    beforeEach(() => {
      cy.visit(`${abc22PageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Abc22');
    });

    it('should create an instance of Abc22', () => {
      cy.get(`[data-cy="name"]`).type('users').should('have.value', 'users');

      cy.get(`[data-cy="otherField"]`).type('innovative intranet').should('have.value', 'innovative intranet');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        abc22 = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', abc22PageUrlPattern);
    });
  });
});
