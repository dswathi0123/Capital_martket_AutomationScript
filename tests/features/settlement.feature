Feature: Clearing and settlement view
  As an operations analyst
  I want to see orders once they reach clearing
  So that I can track them through to settlement

  Background:
    Given I am on the order blotter

  Scenario: A cleared order appears in the settlement queue
    When I submit a "BUY" order for "SBIN" with quantity "3000" at price "600"
    And the order eventually reaches a terminal status
    And I switch to the "Clearing & settlement" view
    Then the settlement queue should contain an entry for "SBIN"
    And that entry's counterparty should be "NSCC"

  Scenario: A settled order shows full progress in the settlement queue
    When I submit a "BUY" order for "AXISBANK" with quantity "1000" at price "1100"
    And the order eventually reaches status "SETTLED"
    And I switch to the "Clearing & settlement" view
    Then that entry's progress bar for "AXISBANK" should be full
