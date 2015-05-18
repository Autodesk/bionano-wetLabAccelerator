from selenium.webdriver import ActionChains
from selenium.webdriver.common.keys import Keys
import time
from tests import TestBase

class TestBasicInteractions(TestBase):
    """Some tests of basic interactions with the model"""

    # def test_basic(self):
    #     """
    #     test the main cx1 page
    #     """
    #     self.verifyIsDisplayed(self.page.getDesignLink(), "design link")
    #     self.verifyIsDisplayed(self.page.getBuildLink(), "build link ")
    #     self.verifyIsDisplayed(self.page.getTestLink(), "test link")
    #     self.verifyIsDisplayed(self.page.getSignInLink(), "sign in link")


    def test_build_ui(self):
        self.page.clickBuild()
        build = self.build
        time.sleep(10)
        expectedOperationNames = [u"Transfer", u"Distribute", u"Consolidate", u"Mix", u"Dispense", u"Thermocycle", u"Incubate", u"Seal", u"Unseal", u"Cover", u"Uncover", u"Spin", u"Image Plate", u"Absorbance", u"Fluorescence", u"Luminescence", u"Gel Separate", u"Autoprotocol (JSON)"]

        self.verifyIsDisplayed(build.getSidePanel(), "side column")
        self.verifyEqual(build.getOperationNames(), expectedOperationNames, "verify operation names")
        self.verifyIsDisplayed(build.getMainColumn(), "main column")

        protocolSetup = build.getProtocolSetup()

        protocolSetup.expand()
        self.verifyTrue(protocolSetup.isExpanded(), "verify protocol setup is expanded")
        parameters = protocolSetup.getParameters()
        print("getting setup parameters")
        #print(parameters)
        for parameter in parameters:
            print(parameter.getParameterType() + ": " + parameter.getVariableName())


        volumeSetupParameter = protocolSetup.addParameter("Volume")

        self.verifyTrue(volumeSetupParameter.getParameterType() == "volume", "verify parameter type is volume")

        time.sleep(10)

        # protocolSetup.collapse()
        # self.assertFalse(protocolSetup.isExpanded(), "verify protocol setup is closed")
        # self.verifyIsDisplayed(build.getClearProtocolButton(), "clear protocol button")
        # self.verifyIsDisplayed(build.getToggleStepVisibilityButton(), "toggle step visibility button")
        # self.verifyIsDisplayed(build.getSaveProtocolButton(), "clear protocol button")

    def verifyIsDisplayed(self, element, description):
        verifyString =  "verify " + description + " is displayed"
        self.verifyTrue(element.is_displayed(), verifyString)

    def verifyTrue(self, actual, description):
        self.verifyString(actual, True, description)
        self.assertTrue(actual, description)

    def verifyFalse(self, actual, description):
        self.verifyString(actual, False, description)
        self.assertFalse(actual, description)

    def verifyEqual(self, actual, expected, description):
        verifyString = "verify " + description + " is equal"
        self.verifyString(actual, expected, verifyString)
        self.assertEqual(actual, expected, verifyString)

    def verifyString(self, actual, expect, verifyString):
        passFail = "FAIL"
        if actual == expect:
            passFail = "PASS"
        print("  " + passFail + " - " + verifyString)
        if actual != expect:
            print("expect: " + str(expect))
            print("actual: " + str(actual))