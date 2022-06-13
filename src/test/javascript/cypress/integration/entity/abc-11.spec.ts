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

describe('Abc11 e2e test', () => {
  const abc11PageUrl = '/abc-11';
  const abc11PageUrlPattern = new RegExp('/abc-11(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const abc11Sample = { name: 'Representative Rupee' };

  let abc11: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/abc-11-s+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/abc-11-s').as('postEntityRequest');
    cy.intercept('DELETE', '/api/abc-11-s/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (abc11) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/abc-11-s/${abc11.id}`,
      }).then(() => {
        abc11 = undefined;
      });
    }
  });

  it('Abc11s menu should load Abc11s page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('abc-11');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Abc11').should('exist');
    cy.url().should('match', abc11PageUrlPattern);
  });

  describe('Abc11 page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(abc11PageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Abc11 page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/abc-11/new$'));
        cy.getEntityCreateUpdateHeading('Abc11');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc11PageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/abc-11-s',
          body: abc11Sample,
        }).then(({ body }) => {
          abc11 = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/abc-11-s+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [abc11],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(abc11PageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Abc11 page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('abc11');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc11PageUrlPattern);
      });

      it('edit button click should load edit Abc11 page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Abc11');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc11PageUrlPattern);
      });

      it('last delete button click should delete instance of Abc11', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('abc11').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc11PageUrlPattern);

        abc11 = undefined;
      });
    });
  });

  describe('new Abc11 page', () => {
    beforeEach(() => {
      cy.visit(`${abc11PageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Abc11');
    });

    it('should create an instance of Abc11', () => {
      cy.get(`[data-cy="name"]`).type('technologies').should('have.value', 'technologies');

      cy.get(`[data-cy="otherField"]`).type('Brandenburg Account').should('have.value', 'Brandenburg Account');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        abc11 = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', abc11PageUrlPattern);
    });
  });
});
