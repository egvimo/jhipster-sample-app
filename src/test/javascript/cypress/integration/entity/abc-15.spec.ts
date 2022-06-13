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

describe('Abc15 e2e test', () => {
  const abc15PageUrl = '/abc-15';
  const abc15PageUrlPattern = new RegExp('/abc-15(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const abc15Sample = { name: 'Fresh global Metal' };

  let abc15: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/abc-15-s+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/abc-15-s').as('postEntityRequest');
    cy.intercept('DELETE', '/api/abc-15-s/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (abc15) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/abc-15-s/${abc15.id}`,
      }).then(() => {
        abc15 = undefined;
      });
    }
  });

  it('Abc15s menu should load Abc15s page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('abc-15');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Abc15').should('exist');
    cy.url().should('match', abc15PageUrlPattern);
  });

  describe('Abc15 page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(abc15PageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Abc15 page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/abc-15/new$'));
        cy.getEntityCreateUpdateHeading('Abc15');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc15PageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/abc-15-s',
          body: abc15Sample,
        }).then(({ body }) => {
          abc15 = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/abc-15-s+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [abc15],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(abc15PageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Abc15 page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('abc15');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc15PageUrlPattern);
      });

      it('edit button click should load edit Abc15 page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Abc15');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc15PageUrlPattern);
      });

      it('last delete button click should delete instance of Abc15', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('abc15').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc15PageUrlPattern);

        abc15 = undefined;
      });
    });
  });

  describe('new Abc15 page', () => {
    beforeEach(() => {
      cy.visit(`${abc15PageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Abc15');
    });

    it('should create an instance of Abc15', () => {
      cy.get(`[data-cy="name"]`).type('payment').should('have.value', 'payment');

      cy.get(`[data-cy="otherField"]`)
        .type('International interface synthesize')
        .should('have.value', 'International interface synthesize');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        abc15 = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', abc15PageUrlPattern);
    });
  });
});
