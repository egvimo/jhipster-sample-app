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

describe('Abc18 e2e test', () => {
  const abc18PageUrl = '/abc-18';
  const abc18PageUrlPattern = new RegExp('/abc-18(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const abc18Sample = { name: 'Nordrhein-Westfalen B2B synergy' };

  let abc18: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/abc-18-s+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/abc-18-s').as('postEntityRequest');
    cy.intercept('DELETE', '/api/abc-18-s/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (abc18) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/abc-18-s/${abc18.id}`,
      }).then(() => {
        abc18 = undefined;
      });
    }
  });

  it('Abc18s menu should load Abc18s page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('abc-18');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Abc18').should('exist');
    cy.url().should('match', abc18PageUrlPattern);
  });

  describe('Abc18 page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(abc18PageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Abc18 page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/abc-18/new$'));
        cy.getEntityCreateUpdateHeading('Abc18');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc18PageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/abc-18-s',
          body: abc18Sample,
        }).then(({ body }) => {
          abc18 = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/abc-18-s+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [abc18],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(abc18PageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Abc18 page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('abc18');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc18PageUrlPattern);
      });

      it('edit button click should load edit Abc18 page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Abc18');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc18PageUrlPattern);
      });

      it('last delete button click should delete instance of Abc18', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('abc18').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc18PageUrlPattern);

        abc18 = undefined;
      });
    });
  });

  describe('new Abc18 page', () => {
    beforeEach(() => {
      cy.visit(`${abc18PageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Abc18');
    });

    it('should create an instance of Abc18', () => {
      cy.get(`[data-cy="name"]`).type('Table deposit').should('have.value', 'Table deposit');

      cy.get(`[data-cy="otherField"]`).type('proactive').should('have.value', 'proactive');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        abc18 = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', abc18PageUrlPattern);
    });
  });
});
