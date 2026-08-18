Feature: Full-Text Search on Release Notes
  As a product manager
  I want to search release notes by title and description
  So that I can quickly find relevant releases

  Background:
    Given I am on the Release Notes Dashboard with seed data

  Scenario: Search by a word found in a title returns matching cards
    When I type "invoice" in the search filter
    Then only cards with "invoice" in the title or description should be visible

  Scenario: Search by a word found only in a description returns matching cards
    When I type "claims object" in the search filter
    Then at least one card should be visible

  Scenario: Search is case-insensitive
    When I type "INVOICE" in the search filter
    Then at least one card should be visible

  Scenario: Search with no matching text shows the empty state
    When I type "zzznomatch9999" in the search filter
    Then the release list should be empty
    And an empty-state message should be visible

  Scenario: Search is AND-combined with the product filter
    Given I type "Billing" in the product filter
    When I type "invoice" in the search filter
    Then only cards matching both filters should be visible

  Scenario: Clearing the search restores all filtered results
    Given I type "invoice" in the search filter
    And the release list has fewer cards than the total
    When I clear the search filter
    Then the release list should show all unfiltered cards
