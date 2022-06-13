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

describe('Abc26 e2e test', () => {
  const abc26PageUrl = '/abc-26';
  const abc26PageUrlPattern = new RegExp('/abc-26(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const abc26Sample = { name: 'Program Neck' };

  let abc26: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/abc-26-s+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/abc-26-s').as('postEntityRequest');
    cy.intercept('DELETE', '/api/abc-26-s/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (abc26) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/abc-26-s/${abc26.id}`,
      }).then(() => {
        abc26 = undefined;
      });
    }
  });

  it('Abc26s menu should load Abc26s page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('abc-26');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Abc26').should('exist');
    cy.url().should('match', abc26PageUrlPattern);
  });

  describe('Abc26 page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(abc26PageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Abc26 page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/abc-26/new$'));
        cy.getEntityCreateUpdateHeading('Abc26');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc26PageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/abc-26-s',
          body: abc26Sample,
        }).then(({ body }) => {
          abc26 = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/abc-26-s+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [abc26],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(abc26PageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Abc26 page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('abc26');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc26PageUrlPattern);
      });

      it('edit button click should load edit Abc26 page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Abc26');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc26PageUrlPattern);
      });

      it('last delete button click should delete instance of Abc26', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('abc26').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc26PageUrlPattern);

        abc26 = undefined;
      });
    });
  });

  describe('new Abc26 page', () => {
    beforeEach(() => {
      cy.visit(`${abc26PageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Abc26');
    });

    it('should create an instance of Abc26', () => {
      cy.get(`[data-cy="name"]`).type('connecting optical Central').should('have.value', 'connecting optical Central');

      cy.get(`[data-cy="otherField"]`).type('Senior').should('have.value', 'Senior');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        abc26 = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', abc26PageUrlPattern);
    });
  });
});
