Feature: Trade lifecycle progression
  As an operations analyst
  I want a valid order to move automatically through the trade lifecycle
  So that it reaches settlement without manual intervention

  Background:
    Given I am on the order blotter

  Scenario: A valid order progresses from entry to a terminal state
    When I submit a "BUY" order for "ICICIBANK" with quantity "2000" at price "1200"
    Then the order should appear in the blotter for "ICICIBANK"
    And the order should eventually reach a terminal status

  Scenario: A settled order shows a full audit history
    When I submit a "BUY" order for "WIPRO" with quantity "1500" at price "450"
    And the order eventually reaches a terminal status
    Then the order history should include the stage "VALIDATED"
    And the order history should include the stage "ROUTED"
