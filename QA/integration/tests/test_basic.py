
import time
from tests import TestBase

EXPECTED_OPERATION_NAMES = ["Transfer", "Distribute", "Consolidate", "Mix", "Dispense", "Dispense Resource", "Spread", "Autopick", "Thermocycle", "Incubate", "Seal", "Unseal", "Cover", "Uncover", "Spin", "Image Plate", "Absorbance", "Fluorescence", "Luminescence", "Gel Separate", "Arbitrary Autoprotocol"]


class TestBasicInteractions(TestBase):
    """Some tests of basic interactions with the model"""

    def test_basic(self):
        """
        test the main wet lab accelerator page
        """
        # isSplashDisplayed = self.verifyIsDisplayed(self.page.getWelcomeSplashScreen(), "welcome splash screen")
        # if isSplashDisplayed:
        #     self.page.clickReadyToStartLink()

        self.verifyEqual(self.page.getPageTitleText(), "Wet Lab Accelerator\ntech preview", "page title")
        self.verifyIsDisplayed(self.page.getProtocolLink(), "protocol link ")
        self.verifyIsDisplayed(self.page.getResultsLink(), "results link")
        self.verifyIsDisplayed(self.page.getSignInLink(), "sign in link")

        self.signIn()


    def test_content_menu_signed_in(self):
        """
        test content menu after signing in
        """
        self.signIn()

        contentMenu = self.contentMenu
        contentMenu.open()

        self.verifyTrue(contentMenu.isOpen(), "content menu is open")
        contentMenu.addProtocol()

        self.verifyFalse(contentMenu.isOpen(), "content menu is closed")
        build = self.build
        time.sleep(3)

        self.verifyIsDisplayed(build.getSidePanel(), "side column")
        self.verifyEqual(build.getOperationNames(), EXPECTED_OPERATION_NAMES, "verify operation names")
        self.verifyIsDisplayed(build.getMainColumn(), "main column")


        print contentMenu.getProtocolNames()


    def test_setup_section(self):
        """
        test the setup section
        """
        self.signIn()

        self.page.clickProtocol()
        build = self.build
        time.sleep(3)

        self.verifyIsDisplayed(build.getSidePanel(), "side column")
        self.verifyEqual(build.getOperationNames(), EXPECTED_OPERATION_NAMES, "operation names")
        self.verifyIsDisplayed(build.getMainColumn(), "main column")

        protocolSetup = build.getProtocolSetup()

        protocolSetup.expand()
        self.verifyTrue(protocolSetup.isExpanded(), "protocol setup is expanded")
        parameterCount = len(protocolSetup.getParameters())

        #protocolSetup.getAddParameterElements()


        volumeSetupParameter = protocolSetup.addParameter("Volume")
        volumeSetupParameter.setVariableName("volumeOne")

        self.verifyEqual(len(protocolSetup.getParameters()), parameterCount + 1, "parameter count after adding parameter")
        expectedParameterTypeName = "volume, volumeOne"
        actualParameterTypeName = volumeSetupParameter.getParameterType() + ", " + volumeSetupParameter.getVariableName()
        self.verifyEqual(actualParameterTypeName, expectedParameterTypeName, "parameter type and name")
        time.sleep(5)

        protocolSetup.collapse()
        self.verifyFalse(protocolSetup.isExpanded(), "protocol setup is closed")

    def test_add_operation(self):
        """
        test adding an operation and configuring it
        """
        self.signIn()
        instructions = self.protocolInstructions

        contentMenu = self.contentMenu
        contentMenu.openAndAddProtocol()

        build = self.build
        for operationName in EXPECTED_OPERATION_NAMES:
            operationInstruction = build.addOperation2(operationName)
            displayedName = operationInstruction.getName()
            self.verifyIsDisplayed(operationInstruction, "operation instruction: " + displayedName)

            operationInstruction.expand()

            self.verifyTrue(operationInstruction.isExpanded(), "operation instruction: " + displayedName + " is expanded")

            self.verifyTrue(operationInstruction.getDescription() != "", "operation description is not blank")

            operationInstruction.collapse()
            self.verifyFalse(operationInstruction.isExpanded(), "operation instruction: " + displayedName + " is collapsed")

    #
    # def test_executeScript(self):
    #     self.page.clickBuild()
    #     build = self.build
    #
    #     scriptReturn = self.DRIVER.execute_script("return angular.element($('.setup-variable')[0]).scope()")
    #     print(scriptReturn)

    def signIn(self):

        success = self.page.signIn("max.bates@autodesk.com", "yaycyborg!")
        self.verifyTrue(success, "is signed in")
