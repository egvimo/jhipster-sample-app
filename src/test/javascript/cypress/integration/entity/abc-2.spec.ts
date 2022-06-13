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

describe('Abc2 e2e test', () => {
  const abc2PageUrl = '/abc-2';
  const abc2PageUrlPattern = new RegExp('/abc-2(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const abc2Sample = { name: 'payment Mauritius transparent' };

  let abc2: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/abc-2-s+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/abc-2-s').as('postEntityRequest');
    cy.intercept('DELETE', '/api/abc-2-s/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (abc2) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/abc-2-s/${abc2.id}`,
      }).then(() => {
        abc2 = undefined;
      });
    }
  });

  it('Abc2s menu should load Abc2s page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('abc-2');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Abc2').should('exist');
    cy.url().should('match', abc2PageUrlPattern);
  });

  describe('Abc2 page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(abc2PageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Abc2 page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/abc-2/new$'));
        cy.getEntityCreateUpdateHeading('Abc2');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc2PageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/abc-2-s',
          body: abc2Sample,
        }).then(({ body }) => {
          abc2 = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/abc-2-s+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [abc2],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(abc2PageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Abc2 page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('abc2');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc2PageUrlPattern);
      });

      it('edit button click should load edit Abc2 page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Abc2');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc2PageUrlPattern);
      });

      it('last delete button click should delete instance of Abc2', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('abc2').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc2PageUrlPattern);

        abc2 = undefined;
      });
    });
  });

  describe('new Abc2 page', () => {
    beforeEach(() => {
      cy.visit(`${abc2PageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Abc2');
    });

    it('should create an instance of Abc2', () => {
      cy.get(`[data-cy="name"]`).type('maximized Granite').should('have.value', 'maximized Granite');

      cy.get(`[data-cy="otherField"]`).type('Beauty').should('have.value', 'Beauty');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        abc2 = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', abc2PageUrlPattern);
    });
  });
});
