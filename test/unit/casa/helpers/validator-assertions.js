import { expect } from "chai";
import { JourneyContext } from "@dwp/govuk-casa";

/**
 * Expect a validator to fail.
 *
 * @param {Array} fields All fields.
 * @param {string} waypoint Waypoint of page being validated.
 * @param {string} fieldName Name of field to vextract from page data context.
 * @param {string} validatorName Validator expected to have failed in errors.
 * @param {JourneyContext} journeyContext Value to pass into processor to trigger validation fail.
 * @param {object} errorObj Expected partial error object to be returned.
 * @returns {void}
 * @throws {Error}
 */

export function expectValidatorToFailWithJourney(
  fields,
  waypoint,
  fieldName,
  validatorName,
  journeyContext = new JourneyContext({}),
  errorObj = {},
) {
  const fieldToTest = fields.find((f) => f.name === fieldName);
  const fieldValue =
    journeyContext.getDataForPage(waypoint)?.[fieldName] ?? undefined;
  const errors = fieldToTest.runValidators({
    fieldValue,
    journeyContext,
    fieldName,
    waypoint,
  });

  if (!errors.length) {
    throw new Error("UNEXPECTED_PASS");
  }

  const foundError = errors.find(
    (e) => e.validator.toLowerCase() === validatorName.toLowerCase(),
  );

  expect(foundError).to.not.be.undefined;
  expect(foundError).to.deep.include(errorObj);
}

/**
 * Expect a validator to fail.
 *
 * @param {Array} fields List of validators to test.
 * @param {string} fieldName Name of field to vextract from page data context.
 * @param {string} validatorName Validator expected to have failed in errors.
 * @param {object} pageDataContext Value to pass into processor to trigger validation fail.
 * @param {object} errorObj Expected partial error object to be returned.
 * @returns {void}
 */
export function expectValidatorToFail(
  fields,
  fieldName,
  validatorName,
  pageDataContext = {},
  errorObj = {},
) {
  const fakeWaypoint = "test";
  const journeyContext = new JourneyContext({
    [fakeWaypoint]: pageDataContext,
  });

  expectValidatorToFailWithJourney(
    fields,
    fakeWaypoint,
    fieldName,
    validatorName,
    journeyContext,
    errorObj,
  );
}

/**
 * Expect a validator to pass.
 *
 * @param {Array} fields List of validators to test.
 * @param {string} waypoint Waypoint of page being validated.
 * @param {string} fieldName Name of field to vextract from page data context.
 * @param {string} validatorName Validator expected to not to be present.
 * @param {object} journeyContext Value to pass into processor.
 * @returns {Promise} Pending processor.
 */
export async function expectValidatorToPassWithJourney(
  fields,
  waypoint,
  fieldName,
  validatorName,
  journeyContext = new JourneyContext({}),
) {
  const fieldToTest = fields.find((f) => f.name === fieldName);
  const fieldValue =
    journeyContext.getDataForPage(waypoint)?.[fieldName] ?? undefined;
  const errors = fieldToTest.runValidators({
    fieldValue,
    journeyContext,
    fieldName,
    waypoint,
  });

  expect(errors[0]).to.be.undefined;
}

/**
 * Expect a validator to fail.
 *
 * @param {Array} fieldValidators List of validators to test.
 * @param {string} fieldName Name of field to vextract from page data context.
 * @param {string} validatorName Validator expected to have failed in errors.
 * @param {object} pageDataContext Value to pass into processor to trigger validation fail.
 * @returns {Promise} Pending processor.
 */
export async function expectValidatorToPass(
  fieldValidators,
  fieldName,
  validatorName,
  pageDataContext = {},
) {
  const fakeWaypoint = "test";
  const journeyContext = new JourneyContext({
    [fakeWaypoint]: pageDataContext,
  });
  await expectValidatorToPassWithJourney(
    fieldValidators,
    fakeWaypoint,
    fieldName,
    validatorName,
    journeyContext,
  );
}
