Feature: Inline Form Validation
  As a product manager
  I want to see clear inline error messages when I submit an incomplete form
  So that I know exactly which fields need to be filled in

  Background:
    Given I am on the Release Notes Dashboard with seed data

  Scenario: Submitting an empty form shows error messages for all required fields
    When I click the submit button without filling any fields
    Then an error message should be visible for the product field
    And an error message should be visible for the version field
    And an error message should be visible for the title field
    And an error message should be visible for the description field
    And an error message should be visible for the release date field

  Scenario: Typing in a field clears its error message
    Given I click the submit button without filling any fields
    When I type "My Product" in the product input
    Then no error message should be visible for the product field

  Scenario: Invalid submit does not reset the form
    Given I fill in only the product field with "Partial Product"
    When I click the submit button without filling all required fields
    Then the product field should still contain "Partial Product"

  Scenario: A fully valid form can be submitted successfully
    When I fill in all required fields with valid data
    And I click the submit button
    Then a new release card should appear in the list
    And the form should be cleared after successful submission
