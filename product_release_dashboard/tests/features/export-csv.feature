Feature: Export Visible Releases as CSV
  As a product manager
  I want to export the currently visible release notes to CSV
  So that I can share or analyse them in a spreadsheet tool

  Background:
    Given I am on the Release Notes Dashboard with seed data

  Scenario: Export button is enabled when releases are visible
    Then the Export CSV button should be enabled

  Scenario: Export button is disabled when no releases match the filters
    When I type "zzznomatch9999" in the search filter
    Then the Export CSV button should be disabled

  Scenario: Clicking Export CSV triggers a file download
    When I click the Export CSV button
    Then a file named "release-notes-export.csv" should be downloaded

  Scenario: Exported CSV contains a header row
    When I click the Export CSV button
    Then the downloaded CSV should contain the header "id,product,version,title,description,releaseDate,isBreaking"

  Scenario: Export only includes the currently filtered releases
    Given I type "Billing" in the product filter
    When I click the Export CSV button
    Then the downloaded CSV should contain "Billing API"
    And the downloaded CSV should not contain "Auth Service"
