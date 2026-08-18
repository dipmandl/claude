Feature: Edit Release Note
  As a product manager
  I want to edit an existing release note in-place
  So that I can correct or update release information without leaving the page

  Background:
    Given I am on the Release Notes Dashboard with seed data

  Scenario: Clicking Edit populates the form with release data
    When I click the Edit button on the first release card
    Then the form title input should contain the first release title
    And the submit button label should be "Save Changes"
    And the Cancel button should be visible

  Scenario: Saving an edit updates the card title in the list
    When I click the Edit button on the first release card
    And I clear the title field and type "Updated Release Title"
    And I click the submit button
    Then a card with title "Updated Release Title" should appear in the list
    And the submit button label should be "Add Release Note"
    And the Cancel button should be hidden

  Scenario: Cancelling an edit discards changes
    When I click the Edit button on the first release card
    And I clear the title field and type "Unsaved Title Change"
    And I click the Cancel button
    Then no card with title "Unsaved Title Change" should exist in the list
    And the submit button label should be "Add Release Note"
    And the Cancel button should be hidden

  Scenario: Editing while another card is being deleted exits edit mode
    When I click the Edit button on the first release card
    And I click the Delete button on the first release card
    And I click the Confirm delete button
    Then the submit button label should be "Add Release Note"
