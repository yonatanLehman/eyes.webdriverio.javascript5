'use strict';

const {GetAccessibilityRegion, Location, CoordinatesType, AccessibilityMatchSettings} = require('@applitools/eyes-sdk-core');

class AccessibilityRegionBySelector extends GetAccessibilityRegion {

  /**
   * @param {By} regionSelector
   * @param {AccessibilityRegionType} regionType
   */
  constructor(regionSelector, regionType) {
    super();
    this._selector = regionSelector;
    this._regionType = regionType;
  }

  // noinspection JSCheckFunctionSignatures
  /**
   * @inheritDoc
   * @param {Eyes} eyes
   * @param {EyesScreenshot} screenshot
   * @return {Promise<AccessibilityMatchSettings[]>}
   */
  async getRegion(eyes, screenshot) {
    const elements = await eyes.getDriver().findElements(this._selector);

    const values = [];
    if (elements && elements.length > 0) {
      for (let i = 0; i < elements.length; i += 1) {
        const point = await elements[i].getLocation();
        const size = await elements[i].getSize();
        const lTag = screenshot.convertLocation(
            new Location(point),
            CoordinatesType.CONTEXT_RELATIVE,
            CoordinatesType.SCREENSHOT_AS_IS
        );
        const accessibilityRegion = new AccessibilityMatchSettings({
          left: lTag.getX(),
          top: lTag.getY(),
          width: size.getWidth(),
          height: size.getHeight(),
          type: this._regionType,
        });
        values.push(accessibilityRegion);
      }
    }

    return values;
  }
}

module.exports = AccessibilityRegionBySelector;
