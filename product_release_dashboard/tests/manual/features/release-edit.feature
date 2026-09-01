@edit
Feature: Edit a Release Note
  As a user of the Release Notes Dashboard
  I want to edit existing release notes
  So that I can correct errors or update information after submission

  Background:
    Given the Release Notes Dashboard is open
    And at least one release card is visible in the release list

  @REQ-4 @REQ-5 @AC-2
  Scenario: User clicks Edit and form is populated with all six field values
    When the user clicks the edit button on a release card
    Then the form heading changes to "Edit Release Note"
    And the submit button label changes to "Save Changes"
    And the cancel button becomes visible
    And the product field contains the card's product value
    And the version field contains the card's version value
    And the title field contains the card's title value
    And the description field contains the card's description value
    And the release date field contains the card's release date value
    And the breaking change checkbox reflects the card's isBreaking value

  @REQ-4 @REQ-6 @AC-3
  Scenario: User edits a release note and saves successfully
    When the user clicks the edit button on a release card
    And the user changes the title field to "Updated Title"
    And the user clicks Save Changes
    Then the release list shows the updated title for that record
    And the form returns to create mode with heading "Create a Release Note"
    And the cancel button is hidden
    And localStorage contains the updated record

  @REQ-7 @AC-3 @AC-9
  Scenario: Edited release note persists the updated values after page reload
    When the user clicks the edit button on a release card
    And the user changes the title field to "Persisted Edit Title"
    And the user clicks Save Changes
    And the user reloads the page
    Then the release list shows "Persisted Edit Title" for that record

  @REQ-9 @AC-4
  Scenario: User cancels an in-progress edit and form is cleared
    When the user clicks the edit button on a release card
    And the user changes the title field to "Draft Value"
    And the user clicks the cancel button
    Then the form is cleared and shows no values
    And the form heading changes back to "Create a Release Note"
    And the cancel button is hidden
    And no record in the release list has the title "Draft Value"

  @REQ-8 @AC-5
  Scenario: User clears a required field and attempts to save the edit
    When the user clicks the edit button on a release card
    And the user clears the product field
    And the user clicks Save Changes
    Then the form does not submit
    And the product field shows a browser validation indicator
    And the release record is not modified

  @REQ-7 @AC-7
  Scenario: Edited record disappears from filtered view when it no longer matches the filter
    Given the release list is filtered to show breaking changes only
    And the filtered results include at least one breaking-change card
    When the user clicks the edit button on a breaking-change card
    And the user unchecks the breaking change checkbox
    And the user clicks Save Changes
    Then the edited card disappears from the breaking-change filtered view
    And the record is still present in localStorage with isBreaking set to false

  @REQ-10 @FR-10
  Scenario: Edit controls are visible on seeded example cards
    Given the page is opened for the first time with no stored data
    Then each seeded release card displays an edit button

  @REQ-10 @FR-10
  Scenario: Edit controls are visible on user-created cards
    Given the user has submitted a new release note via the form
    Then the newly created card displays an edit button

  @REQ-5 @NFR-5
  Scenario: Edit button is keyboard accessible on a release card
    When the user tabs to the edit button on a release card
    And the user presses Enter
    Then the form is populated with that card's values

  @REQ-9 @AC-4
  Scenario: Cancelling edit leaves the release list unchanged
    When the user clicks the edit button on a release card
    And the user clicks the cancel button
    Then the release list contains the same records as before the edit was started
