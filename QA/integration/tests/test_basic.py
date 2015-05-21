from selenium.webdriver import ActionChains
from selenium.webdriver.common.keys import Keys
import time
from tests import TestBase

class TestBasicInteractions(TestBase):
    """Some tests of basic interactions with the model"""

    def test_basic(self):
        """
        test the main wet lab accelerator page
        """
        print("welcome text: " + str(self.page.getPageTitleText()))

        self.verifyEqual(self.page.getPageTitleText(), "Wet Lab Accelerator", "page title")
        self.verifyIsDisplayed(self.page.getProtocolLink(), "protocol link ")
        self.verifyIsDisplayed(self.page.getResultsLink(), "results link")
        self.verifyIsDisplayed(self.page.getSignInLink(), "sign in link")

        #self.page.signIn("max.bates@autodesk.com", "yaycyborg!")


    def test_build_ui(self):
        self.page.clickBuild()
        build = self.build
        time.sleep(10)
        expectedOperationNames = ["Transfer", "Distribute", "Consolidate", "Mix", "Dispense", "Thermocycle", "Incubate", "Seal", "Unseal", "Cover", "Uncover", "Spin", "Image Plate", "Absorbance", "Fluorescence", "Luminescence", "Gel Separate", "Autoprotocol (JSON)"]

        self.verifyIsDisplayed(build.getSidePanel(), "side column")
        self.verifyEqual(build.getOperationNames(), expectedOperationNames, "verify operation names")
        self.verifyIsDisplayed(build.getMainColumn(), "main column")

        protocolSetup = build.getProtocolSetup()

        protocolSetup.expand()
        self.verifyTrue(protocolSetup.isExpanded(), "verify protocol setup is expanded")
        protocolSetup.listParameters()

        protocolSetup.getAddParameterElements()


        volumeSetupParameter = protocolSetup.addParameter("Volume")
        protocolSetup.listParameters()
        self.verifyTrue(volumeSetupParameter.getParameterType() == "volume", "verify parameter type is volume")

        time.sleep(10)

        protocolSetup.collapse()
        self.assertFalse(protocolSetup.isExpanded(), "verify protocol setup is closed")
        # self.verifyIsDisplayed(build.getClearProtocolButton(), "clear protocol button")
        # self.verifyIsDisplayed(build.getToggleStepVisibilityButton(), "toggle step visibility button")
        # self.verifyIsDisplayed(build.getSaveProtocolButton(), "clear protocol button")

    def test_executeScript(self):
        self.page.clickBuild()
        build = self.build

        scriptReturn = self.DRIVER.execute_script("return angular.element($('.setup-variable')[0]).scope()")
        print(scriptReturn)