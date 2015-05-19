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
        expectedOperationNames = ["Transfer", "Distribute", "Consolidate", "Mix", "Dispense", "Thermocycle", "Incubate", "Seal", "Unseal", "Cover", "Uncover", "Spin", "Image Plate", "Absorbance", "Fluorescence", "Luminescence", "Gel Separate", "Autoprotocol (JSON)"]

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

    def test_executeScript(self):
        self.page.clickBuild()
        build = self.build

        self.DRIVER.execute_script("angular.element($('.setup-variable')[0]).scope()")
