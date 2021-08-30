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

describe('Calendar e2e test', () => {
  let startingEntitiesCount = 0;

  before(() => {
    cy.window().then(win => {
      win.sessionStorage.clear();
    });

    cy.clearCookies();
    cy.intercept('GET', '/api/calendars*').as('entitiesRequest');
    cy.visit('');
    cy.login('admin', 'admin');
    cy.clickOnEntityMenuItem('calendar');
    cy.wait('@entitiesRequest').then(({ request, response }) => (startingEntitiesCount = response.body.length));
    cy.visit('/');
  });

  it('should load Calendars', () => {
    cy.intercept('GET', '/api/calendars*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('calendar');
    cy.wait('@entitiesRequest');
    cy.getEntityHeading('Calendar').should('exist');
    if (startingEntitiesCount === 0) {
      cy.get(entityTableSelector).should('not.exist');
    } else {
      cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount);
    }
    cy.visit('/');
  });

  it('should load details Calendar page', () => {
    cy.intercept('GET', '/api/calendars*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('calendar');
    cy.wait('@entitiesRequest');
    if (startingEntitiesCount > 0) {
      cy.get(entityDetailsButtonSelector).first().click({ force: true });
      cy.getEntityDetailsHeading('calendar');
      cy.get(entityDetailsBackButtonSelector).should('exist');
    }
    cy.visit('/');
  });

  it('should load create Calendar page', () => {
    cy.intercept('GET', '/api/calendars*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('calendar');
    cy.wait('@entitiesRequest');
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('Calendar');
    cy.get(entityCreateSaveButtonSelector).should('exist');
    cy.visit('/');
  });

  it('should load edit Calendar page', () => {
    cy.intercept('GET', '/api/calendars*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('calendar');
    cy.wait('@entitiesRequest');
    if (startingEntitiesCount > 0) {
      cy.get(entityEditButtonSelector).first().click({ force: true });
      cy.getEntityCreateUpdateHeading('Calendar');
      cy.get(entityCreateSaveButtonSelector).should('exist');
    }
    cy.visit('/');
  });

  it('should create an instance of Calendar', () => {
    cy.intercept('GET', '/api/calendars*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('calendar');
    cy.wait('@entitiesRequest').then(({ request, response }) => (startingEntitiesCount = response.body.length));
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('Calendar');

    cy.get(`[data-cy="name"]`)
      .type('multiestado matrix productize', { force: true })
      .invoke('val')
      .should('match', new RegExp('multiestado matrix productize'));

    cy.get(`[data-cy="holidays"]`).type('26472').should('have.value', '26472');

    cy.setFieldSelectToLastOfEntity('sprint');

    cy.get(entityCreateSaveButtonSelector).click({ force: true });
    cy.scrollTo('top', { ensureScrollable: false });
    cy.get(entityCreateSaveButtonSelector).should('not.exist');
    cy.intercept('GET', '/api/calendars*').as('entitiesRequestAfterCreate');
    cy.visit('/');
    cy.clickOnEntityMenuItem('calendar');
    cy.wait('@entitiesRequestAfterCreate');
    cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount + 1);
    cy.visit('/');
  });

  it('should delete last instance of Calendar', () => {
    cy.intercept('GET', '/api/calendars*').as('entitiesRequest');
    cy.intercept('DELETE', '/api/calendars/*').as('deleteEntityRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('calendar');
    cy.wait('@entitiesRequest').then(({ request, response }) => {
      startingEntitiesCount = response.body.length;
      if (startingEntitiesCount > 0) {
        cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount);
        cy.get(entityDeleteButtonSelector).last().click({ force: true });
        cy.getEntityDeleteDialogHeading('calendar').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click({ force: true });
        cy.wait('@deleteEntityRequest');
        cy.intercept('GET', '/api/calendars*').as('entitiesRequestAfterDelete');
        cy.visit('/');
        cy.clickOnEntityMenuItem('calendar');
        cy.wait('@entitiesRequestAfterDelete');
        cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount - 1);
      }
      cy.visit('/');
    });
  });
});
