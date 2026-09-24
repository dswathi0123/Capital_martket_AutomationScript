Feature: Order entry and validation
  As a trader on the equities desk
  I want orders to be validated when I submit them
  So that only compliant orders reach the market

  Background:
    Given I am on the order blotter

  Scenario: Submit a valid buy order
    When I submit a "BUY" order for "RELIANCE" with quantity "1000" at price "2500"
    Then the order should appear in the blotter for "RELIANCE"
    And the order should eventually reach a status of "VALIDATED" or later

  Scenario: Submit a valid sell order
    When I submit a "SELL" order for "TCS" with quantity "500" at price "3800"
    Then the order should appear in the blotter for "TCS"
    And the order should eventually reach a status of "VALIDATED" or later

  Scenario: Order exceeding the size limit is rejected
    When I submit a "BUY" order for "INFY" with quantity "75000" at price "1500"
    Then the order should appear in the blotter for "INFY"
    And the order should eventually have status "REJECTED"

  Scenario: Order from an unrecognized account is rejected
    When I submit an order for account "GUEST-1" symbol "HDFCBANK" quantity "100" price "1650"
    Then the order should appear in the blotter for "HDFCBANK"
    And the order should eventually have status "REJECTED"
