Feature: Sort Release Notes
  As a product manager
  I want to sort release notes by different criteria
  So that I can view them in my preferred order

  Background:
    Given I am on the Release Notes Dashboard with seed data

  Scenario: Default sort is newest first
    Then the first card product should contain "Auth Service"
    And the second card product should contain "Billing API"

  Scenario: Sort by oldest first shows the oldest release at the top
    When I select "Oldest first" from the sort dropdown
    Then the first card product should contain "Billing API"

  Scenario: Sort by Product A-Z shows products in alphabetical order
    When I select "Product A-Z" from the sort dropdown
    Then the first card product should contain "Auth Service"

  Scenario: Sort by Product Z-A shows products in reverse alphabetical order
    When I select "Product Z-A" from the sort dropdown
    Then the first card product should contain "Billing API"

  Scenario: Sort operates on the filtered result set, not the full list
    Given I type "Billing" in the product filter
    When I select "Oldest first" from the sort dropdown
    Then only cards from "Billing API" should be visible
