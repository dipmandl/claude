Feature: Results Summary Line
  As a product manager
  I want to see a summary of how many releases are visible
  So that I can understand the effect of my current filters at a glance

  Background:
    Given I am on the Release Notes Dashboard with seed data

  Scenario: Summary shows correct total count on page load
    Then the results summary should show "2 of 2 releases"

  Scenario: Summary updates when a filter reduces the result set
    When I type "Billing" in the product filter
    Then the results summary should show "1 of 2 releases"

  Scenario: Summary shows breaking change count
    Then the results summary should contain "1 breaking"

  Scenario: Summary shows zero breaking when only non-breaking releases are visible
    When I select "Non-breaking only" from the change type filter
    Then the results summary should contain "0 breaking"

  Scenario: Summary updates after a new release is added
    When I add a new non-breaking release note
    Then the results summary should show "3 of 3 releases"

  Scenario: Summary reflects filtered count after search
    When I type "zzznomatch9999" in the search filter
    Then the results summary should show "0 of 2 releases"
