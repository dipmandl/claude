Feature: Delete Release Note with Inline Confirmation
  As a product manager
  I want to delete a release note with a confirmation step
  So that I do not accidentally remove important release records

  Background:
    Given I am on the Release Notes Dashboard with seed data

  Scenario: Clicking Delete shows the inline confirmation row
    When I click the Delete button on the first release card
    Then the inline delete confirmation row should be visible on the first card
    And the card action buttons row should be hidden on the first card

  Scenario: Confirming delete removes the card from the list
    Given the dashboard has 2 release cards
    When I click the Delete button on the first release card
    And I click the Confirm delete button
    Then the release list should have 1 card

  Scenario: Cancelling delete restores the card to normal state
    When I click the Delete button on the first release card
    And I click the Cancel delete button
    Then the inline delete confirmation row should be hidden on the first card
    And the card action buttons row should be visible on the first card

  Scenario: No window.confirm is used during delete
    When I click the Delete button on the first release card
    Then the browser dialog should not have appeared
