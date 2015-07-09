import helpers
import time
from selenium.webdriver.common.by import By

from pages import Page
from ProtocolSetup import ProtocolSetup
from OperationInstruction import OperationInstruction

OPERATION_INSTRUCTIONS = (By.XPATH, "//span[contains(@class,'operation-name')]/../..")

DRIVER = None
EDIT_METADATA_BUTTON_XPATH = (By.XPATH, "//div[@class='glyphicon-ellipse']")
OPERATION_LIST_CLASS_NAME = (By.CLASS_NAME, "operation-list-item")
SIDE_PANEL_CLASS_NAME = (By.CLASS_NAME, "sidepanel")
MAIN_COLUMN_CLASS_NAME = (By.CLASS_NAME, "maincolumn")

PROTOCOL_INSTRUCTIONS_CLASS_NAME = (By.CLASS_NAME, "protocol-instructions")
EDITOR_BOTTOM_CLASS_NAME = (By.CLASS_NAME, "editor-bottom-space")

OPERATION_DESCRIPTION_FIELD = (By.XPATH, ".//tx-protocol-field[@ng-model='opCtrl.op.description']//div[@class='field-value']//input")

class Build(Page):
    def __init__(self, driver):
        self.DRIVER = driver
        DRIVER = driver
        # self.protocolSetup = ProtocolSetup(self.DRIVER)

    def getOperationNames(self):
        operationNames = []
        operationsList = self.getOperationsList()
        for operation in operationsList:
            operationNames.append(operation.text)

        return operationNames

    def getOperationByName(self, operationName):
        locator = (By.XPATH, "//a[@ng-bind='op.name' and text()='" + operationName + "']")
        self.waitForElement(locator)
        return self.findElement(locator)

    def getOperationsList(self):
        return self.findElements(OPERATION_LIST_CLASS_NAME)

    def getSidePanel(self):
        return self.findElement(SIDE_PANEL_CLASS_NAME)

    def getMainColumn(self):
        return self.findElement(MAIN_COLUMN_CLASS_NAME)

    def getProtocolSetup(self):
        return ProtocolSetup(self.DRIVER)

    def getProtocolInstructions(self):
        return self.findElement(PROTOCOL_INSTRUCTIONS_CLASS_NAME, self.getMainColumn())

    def addOperation(self, operationName):
        self.dragAndDrop(self.getOperationByName(operationName), self.findElement(EDITOR_BOTTOM_CLASS_NAME), "operation " + operationName, "protocol editor")
        self.waitForElement(self.getInstructionLocator(operationName))
        operationInstructions = self.getOperationInstructionsByName(operationName)
        try:
            newOperationInstructionElement = operationInstructions[-1]
            return OperationInstruction(newOperationInstructionElement)
        except Exception as e:
            message = "operation instruction named: " + operationName + " could not be found"
            self.raiseException(message)
            #raise Exception(message)

        # if len(operationInstructions) > 0:
        #     newOperationInstructionElement = operationInstructions[-1]
        #     return OperationInstruction2(newOperationInstructionElement)
        # else:
        #     self.exception("operation instruction named: " + operationName + " could not be found")
        #     return None


    def getOperationInstructions(self):
        opInstructions = self.findElements(OPERATION_INSTRUCTIONS)
        return opInstructions

    def getOperationInstructionsByName(self, operationName):
        if operationName.startswith("Arbitrary"):
            operationName = "Autoprotocol"

        operationInstructionByName = (By.XPATH, "//span[contains(@class,'operation-name') and text()='" + operationName.lower().replace(" ", "_") + "']/../../..")
        opInstructions = self.findElements(operationInstructionByName)
        return opInstructions

    def getClearProtocolButton(self):
        return self.getButtonByTooltip("Clear Protocol")

    def getToggleStepVisibilityButton(self):
        return self.getButtonByTooltip("Toggle step visiblity")

    def getInstructions(self):
        elements = self.findElements((By.CLASS_NAME, "operation-name"))
        for element in elements:
            print(element.text)

    def getInstructionLocator(self, operationName):
        if operationName.startswith("Arbitrary"):
            operationName = "Autoprotocol"
        return (By.XPATH, "//span[contains(@class,'operation-name') and text()='" + operationName.lower().replace(" ", "_") + "']/..")

    def getInstruction(self, operationName):
        return OperationInstruction(self.DRIVER, self.findElement(self.getInstructionLocator(operationName)))

    def getProtocolInstructionsElement(self):
        return self.findElement(PROTOCOL_INSTRUCTIONS_CLASS_NAME)



class ProtocolInstructions(Page):
    def __init__(self, driver):
        self.DRIVER = driver

    def getInstructions(self):
        elements = self.findElements((By.CLASS_NAME, "operation-name"))
        for element in elements:
            print(element.text)

    def getInstruction(self, operationName):
        return self.findElement((By.XPATH, "//div[contains(@class,'operation-name')]/span[text()='" + operationName.lower().replace(" ", "_") + "']"))

    def getProtocolInstructionsElement(self):
        return self.findElement(PROTOCOL_INSTRUCTIONS_CLASS_NAME)


