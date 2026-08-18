@delete
Feature: Delete a Release Note
  As a user of the Release Notes Dashboard
  I want to delete release notes
  So that I can remove records that are no longer relevant

  Background:
    Given the Release Notes Dashboard is open
    And at least one release card is visible in the release list

  @REQ-1 @AC-1
  Scenario: User deletes a release note and the card is removed immediately
    When the user clicks the delete button on a release card
    Then that card is removed from the release list without a page reload
    And no other cards are removed

  @REQ-2 @AC-1 @AC-8
  Scenario: Deleted release note does not reappear after page reload
    When the user clicks the delete button on a release card
    And the user reloads the page
    Then the deleted card is not present in the release list

  @REQ-3 @AC-6
  Scenario: User deletes a card visible in a filtered view
    Given the release list is filtered by product name
    And the filtered results include at least one card
    When the user clicks the delete button on one of the visible filtered cards
    Then only that card is removed from the filtered view
    And the remaining filtered results are unaffected

  @REQ-4 @AC-6
  Scenario: User deletes a card visible under the breaking-change filter
    Given the release list is filtered to show breaking changes only
    And the filtered results include at least one card
    When the user clicks the delete button on one of the visible filtered cards
    Then only that card is removed from the list

  @REQ-5
  Scenario: Delete controls are visible on seeded example cards
    Given the page is opened for the first time with no stored data
    Then each seeded release card displays a delete button

  @REQ-6 @FR-10
  Scenario: Delete controls are visible on user-created cards
    Given the user has submitted a new release note via the form
    Then the newly created card displays a delete button
