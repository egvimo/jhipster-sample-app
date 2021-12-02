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

describe('Xyz e2e test', () => {
  const xyzPageUrl = '/xyz';
  const xyzPageUrlPattern = new RegExp('/xyz(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'admin';
  const password = Cypress.env('E2E_PASSWORD') ?? 'admin';
  const xyzSample = { uniqueField: 'Rubber Fantastic Cotton' };

  let xyz: any;

  beforeEach(() => {
    cy.getOauth2Data();
    cy.get('@oauth2Data').then(oauth2Data => {
      cy.oauthLogin(oauth2Data, username, password);
    });
    cy.intercept('GET', '/api/xyzs').as('entitiesRequest');
    cy.visit('');
    cy.get(entityItemSelector).should('exist');
  });

  beforeEach(() => {
    Cypress.Cookies.preserveOnce('XSRF-TOKEN', 'JSESSIONID');
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/xyzs+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/xyzs').as('postEntityRequest');
    cy.intercept('DELETE', '/api/xyzs/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (xyz) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/xyzs/${xyz.id}`,
      }).then(() => {
        xyz = undefined;
      });
    }
  });

  afterEach(() => {
    cy.oauthLogout();
    cy.clearCache();
  });

  it('Xyzs menu should load Xyzs page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('xyz');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Xyz').should('exist');
    cy.url().should('match', xyzPageUrlPattern);
  });

  describe('Xyz page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(xyzPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Xyz page', () => {
        cy.get(entityCreateButtonSelector).click({ force: true });
        cy.url().should('match', new RegExp('/xyz/new$'));
        cy.getEntityCreateUpdateHeading('Xyz');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click({ force: true });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', xyzPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/xyzs',
          body: xyzSample,
        }).then(({ body }) => {
          xyz = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/xyzs+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [xyz],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(xyzPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Xyz page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('xyz');
        cy.get(entityDetailsBackButtonSelector).click({ force: true });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', xyzPageUrlPattern);
      });

      it('edit button click should load edit Xyz page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Xyz');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click({ force: true });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', xyzPageUrlPattern);
      });

      it('last delete button click should delete instance of Xyz', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('xyz').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click({ force: true });
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', xyzPageUrlPattern);

        xyz = undefined;
      });
    });
  });

  describe('new Xyz page', () => {
    beforeEach(() => {
      cy.visit(`${xyzPageUrl}`);
      cy.get(entityCreateButtonSelector).click({ force: true });
      cy.getEntityCreateUpdateHeading('Xyz');
    });

    it('should create an instance of Xyz', () => {
      cy.get(`[data-cy="uniqueField"]`).type('multi-byte Zambia Principal').should('have.value', 'multi-byte Zambia Principal');

      cy.get(`[data-cy="anotherField"]`).type('Books Bedfordshire De-engineered').should('have.value', 'Books Bedfordshire De-engineered');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        xyz = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', xyzPageUrlPattern);
    });
  });
});
