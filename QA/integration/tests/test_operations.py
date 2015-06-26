
import time
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

        self.indexPage.dismissWelcomeSplashScreen()

        instructions = self.protocolInstructions

        contentMenu = self.contentMenu
        contentMenu.openAndAddProtocol()

        build = self.build
        operationNames = build.getOperationNames()
        for operationName in operationNames:

            operationInstruction = build.addOperation(operationName)
            displayedName = operationInstruction.getName()
            self.verifyIsDisplayed(operationInstruction, "operation instruction: " + displayedName)
            operationInstruction.expand()

            operationFields = operationInstruction.getOperationFields()
            #self.DRIVER.find_element(By.XPATH, )

            for operationField in operationFields:
                print(operationField.toString())



