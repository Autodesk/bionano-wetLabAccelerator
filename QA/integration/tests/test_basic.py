from selenium.webdriver import ActionChains
from selenium.webdriver.common.keys import Keys
import time
from tests import TestBase

class TestBasicInteractions(TestBase):
    """Some tests of basic interactions with the model"""

    def test_basic(self):
        """
        test the main cx1 page
        """
        self.verifyIsDisplayed(self.page.getDesignLink(), "design link")
        self.verifyIsDisplayed(self.page.getBuildLink(), "build link ")
        self.verifyIsDisplayed(self.page.getTestLink(), "test link")
        self.verifyIsDisplayed(self.page.getSignInLink(), "sign in link")


    def test_build_ui(self):
        self.page.clickBuild()
        build = self.build
        expectedOperationNames = ["Transfer", "Distribute", "Consolidate", "Mix", "Dispense", "Thermocycle", "Incubate", "Seal", "Unseal", "Cover", "Uncover", "Spin", "Absorbance", "Fluorescence", "Luminescence", "Gel_separate", "Autoprotocol"]

        self.verifyIsDisplayed(build.getSidePanel(), "side column")
        self.assertEqual(build.getOperationNames(), expectedOperationNames, "verify operation names")
        self.verifyIsDisplayed(build.getMainColumn(), "main column")
        self.assertFalse(build.isProtocolSetupExpanded(), "verify protocol setup is closed")

        build.expandProtocolSetup()
        time.sleep(5)
        self.assertTrue(build.isProtocolSetupExpanded(), "verify protocol setup is expanded")
        build.getProtocolSetup().click()
        # self.verifyIsDisplayed(build.getClearProtocolButton(), "clear protocol button")
        # self.verifyIsDisplayed(build.getToggleStepVisibilityButton(), "toggle step visibility button")
        # self.verifyIsDisplayed(build.getSaveProtocolButton(), "clear protocol button")

    def verifyIsDisplayed(self, element, description):
        verifyString =  "verify " + description + " is displayed"
        print(verifyString)
        self.assertTrue(element.is_displayed(), verifyString)
