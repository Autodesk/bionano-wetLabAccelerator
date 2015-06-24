
import time
from tests import TestBase

class TestOperations(TestBase):
    """
    testing and validation of each operation type
    """

    def test_transfer(self):

        operationName = "Transfer"

        self.signIn()
        instructions = self.protocolInstructions

        contentMenu = self.contentMenu
        contentMenu.openAndAddProtocol()

        build = self.build

        operationInstruction = build.addOperation2(operationName)
        displayedName = operationInstruction.getName()
        self.verifyIsDisplayed(operationInstruction, "operation instruction: " + displayedName)
        operationInstruction.expand()

        fields = operationInstruction.getFields()
        #self.DRIVER.find_element(By.XPATH, )

        for field in fields:
            print(field.toString())


