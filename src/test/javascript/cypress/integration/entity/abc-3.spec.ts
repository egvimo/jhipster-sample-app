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

describe('Abc3 e2e test', () => {
  const abc3PageUrl = '/abc-3';
  const abc3PageUrlPattern = new RegExp('/abc-3(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const abc3Sample = { name: 'e-commerce' };

  let abc3: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/abc-3-s+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/abc-3-s').as('postEntityRequest');
    cy.intercept('DELETE', '/api/abc-3-s/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (abc3) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/abc-3-s/${abc3.id}`,
      }).then(() => {
        abc3 = undefined;
      });
    }
  });

  it('Abc3s menu should load Abc3s page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('abc-3');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Abc3').should('exist');
    cy.url().should('match', abc3PageUrlPattern);
  });

  describe('Abc3 page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(abc3PageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Abc3 page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/abc-3/new$'));
        cy.getEntityCreateUpdateHeading('Abc3');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc3PageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/abc-3-s',
          body: abc3Sample,
        }).then(({ body }) => {
          abc3 = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/abc-3-s+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [abc3],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(abc3PageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Abc3 page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('abc3');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc3PageUrlPattern);
      });

      it('edit button click should load edit Abc3 page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Abc3');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc3PageUrlPattern);
      });

      it('last delete button click should delete instance of Abc3', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('abc3').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc3PageUrlPattern);

        abc3 = undefined;
      });
    });
  });

  describe('new Abc3 page', () => {
    beforeEach(() => {
      cy.visit(`${abc3PageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Abc3');
    });

    it('should create an instance of Abc3', () => {
      cy.get(`[data-cy="name"]`).type('Lead Chips').should('have.value', 'Lead Chips');

      cy.get(`[data-cy="otherField"]`).type('ADP Madagaskar').should('have.value', 'ADP Madagaskar');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        abc3 = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', abc3PageUrlPattern);
    });
  });
});
