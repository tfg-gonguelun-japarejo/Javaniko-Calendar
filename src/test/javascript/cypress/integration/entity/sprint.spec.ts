import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('Sprint e2e test', () => {
  let startingEntitiesCount = 0;

  before(() => {
    cy.window().then(win => {
      win.sessionStorage.clear();
    });

    cy.clearCookies();
    cy.intercept('GET', '/api/sprints*').as('entitiesRequest');
    cy.visit('');
    cy.login('admin', 'admin');
    cy.clickOnEntityMenuItem('sprint');
    cy.wait('@entitiesRequest').then(({ request, response }) => (startingEntitiesCount = response.body.length));
    cy.visit('/');
  });

  it('should load Sprints', () => {
    cy.intercept('GET', '/api/sprints*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('sprint');
    cy.wait('@entitiesRequest');
    cy.getEntityHeading('Sprint').should('exist');
    if (startingEntitiesCount === 0) {
      cy.get(entityTableSelector).should('not.exist');
    } else {
      cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount);
    }
    cy.visit('/');
  });

  it('should load details Sprint page', () => {
    cy.intercept('GET', '/api/sprints*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('sprint');
    cy.wait('@entitiesRequest');
    if (startingEntitiesCount > 0) {
      cy.get(entityDetailsButtonSelector).first().click({ force: true });
      cy.getEntityDetailsHeading('sprint');
      cy.get(entityDetailsBackButtonSelector).should('exist');
    }
    cy.visit('/');
  });

  it('should load create Sprint page', () => {
    cy.intercept('GET', '/api/sprints*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('sprint');
    cy.wait('@entitiesRequest');
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('Sprint');
    cy.get(entityCreateSaveButtonSelector).should('exist');
    cy.visit('/');
  });

  it('should load edit Sprint page', () => {
    cy.intercept('GET', '/api/sprints*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('sprint');
    cy.wait('@entitiesRequest');
    if (startingEntitiesCount > 0) {
      cy.get(entityEditButtonSelector).first().click({ force: true });
      cy.getEntityCreateUpdateHeading('Sprint');
      cy.get(entityCreateSaveButtonSelector).should('exist');
    }
    cy.visit('/');
  });

  it('should create an instance of Sprint', () => {
    cy.intercept('GET', '/api/sprints*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('sprint');
    cy.wait('@entitiesRequest').then(({ request, response }) => (startingEntitiesCount = response.body.length));
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('Sprint');

    cy.get(`[data-cy="sprint"]`).type('6571').should('have.value', '6571');

    cy.get(`[data-cy="startDate"]`).type('2021-08-30').should('have.value', '2021-08-30');

    cy.get(`[data-cy="endDate"]`).type('2021-08-30').should('have.value', '2021-08-30');

    cy.get(`[data-cy="status"]`).select('ON_GOING');

    cy.get(`[data-cy="goal"]`).type('Región', { force: true }).invoke('val').should('match', new RegExp('Región'));

    cy.setFieldSelectToLastOfEntity('proyect');

    cy.get(entityCreateSaveButtonSelector).click({ force: true });
    cy.scrollTo('top', { ensureScrollable: false });
    cy.get(entityCreateSaveButtonSelector).should('not.exist');
    cy.intercept('GET', '/api/sprints*').as('entitiesRequestAfterCreate');
    cy.visit('/');
    cy.clickOnEntityMenuItem('sprint');
    cy.wait('@entitiesRequestAfterCreate');
    cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount + 1);
    cy.visit('/');
  });

  it('should delete last instance of Sprint', () => {
    cy.intercept('GET', '/api/sprints*').as('entitiesRequest');
    cy.intercept('DELETE', '/api/sprints/*').as('deleteEntityRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('sprint');
    cy.wait('@entitiesRequest').then(({ request, response }) => {
      startingEntitiesCount = response.body.length;
      if (startingEntitiesCount > 0) {
        cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount);
        cy.get(entityDeleteButtonSelector).last().click({ force: true });
        cy.getEntityDeleteDialogHeading('sprint').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click({ force: true });
        cy.wait('@deleteEntityRequest');
        cy.intercept('GET', '/api/sprints*').as('entitiesRequestAfterDelete');
        cy.visit('/');
        cy.clickOnEntityMenuItem('sprint');
        cy.wait('@entitiesRequestAfterDelete');
        cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount - 1);
      }
      cy.visit('/');
    });
  });
});
