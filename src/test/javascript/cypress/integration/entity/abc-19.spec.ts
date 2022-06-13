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

describe('Abc19 e2e test', () => {
  const abc19PageUrl = '/abc-19';
  const abc19PageUrlPattern = new RegExp('/abc-19(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const abc19Sample = { name: 'Frozen Sausages Supervisor' };

  let abc19: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/abc-19-s+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/abc-19-s').as('postEntityRequest');
    cy.intercept('DELETE', '/api/abc-19-s/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (abc19) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/abc-19-s/${abc19.id}`,
      }).then(() => {
        abc19 = undefined;
      });
    }
  });

  it('Abc19s menu should load Abc19s page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('abc-19');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Abc19').should('exist');
    cy.url().should('match', abc19PageUrlPattern);
  });

  describe('Abc19 page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(abc19PageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Abc19 page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/abc-19/new$'));
        cy.getEntityCreateUpdateHeading('Abc19');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc19PageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/abc-19-s',
          body: abc19Sample,
        }).then(({ body }) => {
          abc19 = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/abc-19-s+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [abc19],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(abc19PageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Abc19 page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('abc19');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc19PageUrlPattern);
      });

      it('edit button click should load edit Abc19 page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Abc19');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc19PageUrlPattern);
      });

      it('last delete button click should delete instance of Abc19', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('abc19').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc19PageUrlPattern);

        abc19 = undefined;
      });
    });
  });

  describe('new Abc19 page', () => {
    beforeEach(() => {
      cy.visit(`${abc19PageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Abc19');
    });

    it('should create an instance of Abc19', () => {
      cy.get(`[data-cy="name"]`).type('Awesome').should('have.value', 'Awesome');

      cy.get(`[data-cy="otherField"]`).type('reboot orchestrate').should('have.value', 'reboot orchestrate');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        abc19 = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', abc19PageUrlPattern);
    });
  });
});
