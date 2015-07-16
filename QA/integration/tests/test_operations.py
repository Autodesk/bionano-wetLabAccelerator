
import time
import json

from tests import TestBase
from selenium.common.exceptions import WebDriverException

class TestOperations(TestBase):
    """
    testing and validation of each operation type
    """

    def test_transfer(self):
        """
        add a transfer operation to protocol and configure it
        :return:
        """
        operationName = "Transfer"

        self.indexPage.signInWithFacebook("yann.bertaud@autodesk.com", "foobar123")

        contentMenu = self.contentMenu

        contentMenu.openAndAddProtocol()

        protocolName = self.getTimeStamp() + " simple transfer protocol"
        self.indexPage.setProtocolMetadata(protocolName, "test setup section", "test")

        build = self.build
        protocolSetup = build.getProtocolSetup()

        self.verifyEqual(protocolSetup.getParameterCount(), 0, "parameter count before setting containers")

        operationInstruction = build.addOperation(operationName)
        displayedName = operationInstruction.getName()
        self.verifyIsDisplayed(operationInstruction, "operation instruction: " + displayedName)
        operationInstruction.expand()


        operationInstruction.setVolumeValue(12, "microliter")
        operationInstruction.setFromContainerType("1-well flat-bottom plate")
        operationInstruction.setToContainerType("1-well flat-bottom plate")
        operationInstruction.setDispenseSpeed(40)
        operationInstruction.setAspirateSpeed(30)
        operationInstruction.setMixBefore(10, 'nanoliter', 4, 'microliter/second', 4)
        operationInstruction.setMixAfter(12, 'nanoliter', 6, 'microliter/second', 2)

        # collapse the operation then expand and verify that all values are still set
        operationInstruction.collapse()

        operationInstruction.expand()

        self.verifyEqual(operationInstruction.getVolumeValue(), "12 microliter", "volume value")
        self.verifyEqual(operationInstruction.getFromContainerType(), "container 1", "from container")
        self.verifyEqual(operationInstruction.getToContainerType(), "container 2", "from container")
        self.verifyEqual(operationInstruction.getDispenseSpeed(), "40 microliter/second", "dispense speed")
        self.verifyEqual(operationInstruction.getAspirateSpeed(), "30 microliter/second", "aspirate speed")
        self.verifyEqual(operationInstruction.getMixBeforeValues(), ['10 nanoliter', '4 microliter/second', '4 '], "mix before values")
        self.verifyEqual(operationInstruction.getMixAfterValues(), ['12 nanoliter', '6 microliter/second', '2 '], "mix after values")

        #
        self.verifyEqual(protocolSetup.getParameterCount(), 2, "parameter count after setting containers")

        self.indexPage.saveProtocol()
        self.verifyTrue(self.indexPage.isProtocolSaved(), "protocol saved message")

        # contentMenu.openProtocol("Transformation Test of Zymo10B with PVIB Default")
        # self.verifyEqual(self.indexPage.getProtocolName(), "Transformation Test of Zymo10B with PVIB Default", "protocol name")
        #
        # contentMenu.openProtocol(protocolName)
        # self.verifyEqual(self.indexPage.getProtocolName(), protocolName, "protocol name")

    # def test_getOperationFields(self):
    #     """
    #     get the operation fields for each operation
    #     :return:
    #     """
    #
    #     self.indexPage.dismissWelcomeSplashScreen()
    #
    #     instructions = self.protocolInstructions
    #
    #     contentMenu = self.contentMenu
    #     contentMenu.openAndAddProtocol()
    #
    #     build = self.build
    #     protocolSetup = build.getProtocolSetup()
    #
    #     operationNames = build.getOperationNames()
    #     for operationName in operationNames:
    #
    #         operationInstruction = build.addOperation(operationName)
    #         operationInstruction.expand()
    #         operationFields = operationInstruction.getOperationFields()
    #         # self.DRIVER.find_element(By.XPATH, )
    #         print(json.dumps(operationInstruction.getOperationFieldsAsJson(), indent=2))
    #         for operationField in operationFields:
    #             print(operationField.asHash())
    #

