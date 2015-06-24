
import time
from tests import TestBase

EXPECTED_OPERATION_NAMES = ["Transfer", "Distribute", "Consolidate", "Mix", "Dispense", "Provision", "Spread", "Autopick", "Thermocycle", "Incubate", "Seal", "Unseal", "Cover", "Uncover", "Spin", "Image Plate", "Absorbance", "Fluorescence", "Luminescence", "Gel Separate", "Autoprotocol"]
EXPECTED_PARAMETERS = ['Container', 'Duration', 'Temperature', 'Length', 'Volume', 'Speed', 'Acceleration', 'Boolean', 'String', 'Integer', 'Decimal', 'Resource', 'Mixwrap', 'Column Volumes', 'Thermocycle', 'Melting', 'Dyes']


class TestBasicInteractions(TestBase):
    """Some tests of basic interactions with the model"""

    def test_basic(self):
        """
        test the main wet lab accelerator page and sign in with facebook
        """
        self.verifyIsDisplayed(self.indexPage.getWelcomeSplashScreen(), "welcome splash screen")

        self.indexPage.dismissWelcomeSplashScreen()
        self.indexPage.clickLoginDropdown()
        self.indexPage.clickLoginWithFacebookButton()
        self.indexPage.facebookLogin("yann.bertaud@autodesk.com", "foobar123")

        self.verifyEqual(self.indexPage.getPageTitleText(), "Wet Lab Accelerator tech preview", "page title")
        self.verifyIsDisplayed(self.indexPage.getProtocolLink(), "protocol link")
        self.verifyIsDisplayed(self.indexPage.getResultsLink(), "results link")






    def test_content_menu_signed_in(self):
        """
        test content menu after signing in
        """
        self.indexPage.signInWithFacebook("yann.bertaud@autodesk.com", "foobar123")

        contentMenu = self.contentMenu
        contentMenu.open()

        self.verifyTrue(contentMenu.isOpen(), "content menu is open")
        contentMenu.addProtocol()

        self.verifyFalse(contentMenu.isOpen(), "content menu is closed after adding protocol")
        build = self.build
        time.sleep(3)

        self.verifyIsDisplayed(build.getSidePanel(), "side column")
        self.verifyEqual(build.getOperationNames(), EXPECTED_OPERATION_NAMES, "verify operation names")
        self.verifyIsDisplayed(build.getMainColumn(), "main column")
    #
    #
    #     print contentMenu.getProtocolNames()


    def test_setup_section(self):
        """
        test the setup section
        """
        self.indexPage.signInWithFacebook("yann.bertaud@autodesk.com", "foobar123")

        self.indexPage.clickProtocol()
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

        parameterOptions = protocolSetup.getAddParameterOptions()
        self.verifyEqual(parameterOptions, EXPECTED_PARAMETERS, "add parameter options")

        expectedParameters = []
        for parameterOption in parameterOptions:
            setupParam = protocolSetup.addParameter(parameterOption)
            if parameterOption == "Column Volumes":
                expectedParameterTypeName = "Column Volumes, columnVolumes 1"
            elif parameterOption == "Thermocycle":
                expectedParameterTypeName = "Thermocycle, thermocycleGroup 1"
            elif parameterOption == "Melting":
                expectedParameterTypeName = "Melting, thermocycleMelting 1"
            elif parameterOption == "Dyes":
                expectedParameterTypeName = "Dyes, thermocycleDyes 1"
            else:
                expectedParameterTypeName = parameterOption.lower() + ", " + parameterOption.lower() + " 1"

            actualParameterTypeName = setupParam.getParameterType() + ", " + setupParam.getVariableName()
            self.verifyEqual(actualParameterTypeName, expectedParameterTypeName, "parameter type and name")
            newName = parameterOption + "One"
            setupParam.setVariableName(newName)
            self.verifyEqual(setupParam.getVariableName(), newName, "new parameter name")
            expectedParameters.append(setupParam.getParameterType() + ", " + newName)

        self.verifyEqual(len(protocolSetup.getParameters()), len(parameterOptions), "count of added parameters")

        # volumeSetupParameter = protocolSetup.addParameter("Volume")
        # volumeSetupParameter.setVariableName("volumeOne")
        #
        # self.verifyEqual(len(protocolSetup.getParameters()), parameterCount + 1, "parameter count after adding parameter")
        # expectedParameterTypeName = "volume, volumeOne"
        # actualParameterTypeName = volumeSetupParameter.getParameterType() + ", " + volumeSetupParameter.getVariableName()
        # self.verifyEqual(actualParameterTypeName, expectedParameterTypeName, "parameter type and name")
        # time.sleep(5)

        protocolSetup.collapse()
        self.verifyFalse(protocolSetup.isExpanded(), "protocol setup is closed")

        protocolSetup.expand()
        setupParameters = protocolSetup.getParameters()
        self.verifyEqual(len(setupParameters), len(parameterOptions), "count of added parameters")
        actualParameters = []
        for setupParameter in setupParameters:
            actualParameters.append(setupParameter.getParameterType() + ", " + setupParameter.getVariableName())

        self.verifyEqual(actualParameters, expectedParameters, "all parameters that were added are in setup section")
    #
    # def test_add_operation(self):
    #     """
    #     test adding an operation and configuring it
    #     """
    #     self.signIn()
    #     instructions = self.protocolInstructions
    #
    #     contentMenu = self.contentMenu
    #     contentMenu.openAndAddProtocol()
    #
    #     build = self.build
    #     for operationName in EXPECTED_OPERATION_NAMES:
    #         operationInstruction = build.addOperation2(operationName)
    #         displayedName = operationInstruction.getName()
    #         self.verifyIsDisplayed(operationInstruction, "operation instruction: " + displayedName)
    #
    #         operationInstruction.expand()
    #
    #         self.verifyTrue(operationInstruction.isExpanded(), "operation instruction: " + displayedName + " is expanded")
    #
    #         self.verifyTrue(operationInstruction.getDescription() != "", "operation description is not blank")
    #
    #         operationInstruction.collapse()
    #         self.verifyFalse(operationInstruction.isExpanded(), "operation instruction: " + displayedName + " is collapsed")

    #
    # def test_executeScript(self):
    #     self.indexPage.clickBuild()
    #     build = self.build
    #
    #     scriptReturn = self.DRIVER.execute_script("return angular.element($('.setup-variable')[0]).scope()")
    #     print(scriptReturn)


    def toCamelCase(self, inputString):
        inputString = inputString.replace(" ", "")
        inputString = inputString[0].lower() + inputString[1:]
        return inputString