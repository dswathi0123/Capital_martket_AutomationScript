Feature: Reporting dashboard
  As a desk manager
  I want a summary of the day's trading activity
  So that I can monitor throughput and exceptions at a glance

  Background:
    Given I am on the order blotter

  Scenario: The reports view reflects submitted orders
    When I submit a "BUY" order for "LT" with quantity "800" at price "3600"
    And I switch to the "Reports" view
    Then the "Total orders" stat should be at least "1"

  Scenario: A settled order is reflected in settled-today count
    When I submit a "BUY" order for "MARUTI" with quantity "200" at price "11000"
    And the order eventually reaches status "SETTLED"
    And I switch to the "Reports" view
    Then the "Settled today" stat should be at least "1"
