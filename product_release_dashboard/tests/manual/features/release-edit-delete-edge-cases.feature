@edge-cases
Feature: Edit and Delete Edge Cases
  As a user of the Release Notes Dashboard
  I want the edit and delete operations to handle edge cases gracefully
  So that the application state remains consistent under unusual sequences of actions

  Background:
    Given the Release Notes Dashboard is open
    And at least one release card is visible in the release list

  @REQ-6 @REQ-1
  Scenario: User deletes a card that is currently being edited
    When the user clicks the edit button on a release card
    And the user clicks the delete button on the same card without saving
    Then the form resets to create mode with heading "Create a Release Note"
    And the cancel button is hidden
    And the deleted card is no longer in the release list

  @REQ-6 @REQ-4
  Scenario: User starts editing one card then clicks Edit on another card
    Given there are at least two release cards visible
    When the user clicks the edit button on the first card
    And the user clicks the edit button on the second card without saving
    Then the form is populated with the second card's values
    And the first card remains unchanged in the release list

  @AC-10 @NFR-4
  Scenario: Edit and delete controls are tappable on a 360px mobile viewport
    Given the browser viewport is set to 360px wide
    Then each release card displays its edit and delete buttons without horizontal overflow
    And each button has a minimum tap target size of 36px height

  @NFR-1
  Scenario: Page has no external script or stylesheet dependencies
    Given the page source is examined
    Then there are no script tags with external src attributes
    And there are no link tags referencing external CDN stylesheets

  @NFR-3
  Scenario: localStorage is accessed only via the releaseNotesDashboard.releases key
    Given the user performs a delete operation
    Then only the key "releaseNotesDashboard.releases" is written to localStorage
    Given the user performs an edit and save operation
    Then only the key "releaseNotesDashboard.releases" is written to localStorage
