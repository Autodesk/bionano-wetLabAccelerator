import helpers
import time
from selenium.webdriver.common.by import By

from pages import Page


EDIT_METADATA_BUTTON_XPATH = (By.XPATH, "//div[@class='glyphicon-ellipse']")
OPERATION_LIST_CLASS_NAME = (By.CLASS_NAME, "operation-list-item")
SIDE_PANEL_CLASS_NAME = (By.CLASS_NAME, "sidepanel")
MAIN_COLUMN_CLASS_NAME = (By.CLASS_NAME, "maincolumn")

ADD_PARAMETER_BUTTON = (By.CLASS_NAME, "add-parameter")
PROTOCOL_INSTRUCTIONS_CLASS_NAME = (By.CLASS_NAME, "protocol-instructions")
EDITOR_BOTTOM_CLASS_NAME = (By.CLASS_NAME, "editor-bottom-space")

OPERATION_DESCRIPTION_FIELD = (By.XPATH, ".//tx-protocol-field[@ng-model='opCtrl.op.description']//div[@class='field-value']//input")

class Build(Page):
    def __init__(self, driver):
        self.DRIVER = driver
        # self.protocolSetup = ProtocolSetup(self.DRIVER)

    def getOperationNames(self):
        operationNames = []
        operationsList = self.getOperationsList()
        for operation in operationsList:
            operationNames.append(operation.text)

        return operationNames

    def getOperationByName(self, operationName):
        xpath = "//a[@select-title='op.name' and text()='" + operationName + "']"
        self.waitForElementByXpath(xpath)
        return self.findElementByXpath(xpath)

    def getOperationsListOld(self):
        return self.DRIVER.find_elements_by_class_name("operation-list-item")

    def getOperationsList(self):
        return self.findElements(OPERATION_LIST_CLASS_NAME)

    def getSidePanel(self):
        return self.findElement(SIDE_PANEL_CLASS_NAME)

    def getMainColumn(self):
        return self.findElement(MAIN_COLUMN_CLASS_NAME)

    def getProtocolSetup(self):
        return ProtocolSetup(self.DRIVER)

    def getProtocolInstructions(self):
        return self.getMainColumn().find_element_by_class_name("protocol-instructions")

    def addOperation2(self, operationName):
        self.dragAndDrop(self.getOperationByName(operationName), self.findElement(EDITOR_BOTTOM_CLASS_NAME), "operation " + operationName, "protocol editor")
        self.waitForElement(self.getInstructionLocator(operationName))
        newOperationInstructionElement = self.getOperationInstructionsByName(operationName)[-1]
        return OperationInstruction2(newOperationInstructionElement)


    def getOperationInstructions(self):
        opInstructions = self.findElements((By.XPATH, "//div[contains(@class,'operation-name')]/../.."))
        return opInstructions

    def getOperationInstructionsByName(self, operationName):
        if operationName.startswith("Autoprotocol"):
            operationName = "Autoprotocol"
        opInstructions = self.findElements((By.XPATH, "//div[contains(@class,'operation-name')]/span[text()='" + operationName.lower().replace(" ", "_") + "']/../../.."))
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
        if operationName.startswith("Autoprotocol"):
            operationName = "Autoprotocol"
        return (By.XPATH, "//div[contains(@class,'operation-name')]/span[text()='" + operationName.lower().replace(" ", "_") + "']/..")

    def getInstruction(self, operationName):
        return OperationInstruction(self.DRIVER, self.findElement(self.getInstructionLocator(operationName)))

    def getProtocolInstructionsElement(self):
        return self.findElement(PROTOCOL_INSTRUCTIONS_CLASS_NAME)


class ProtocolSetup(Page):
    def __init__(self, driver):
        self.DRIVER = driver

    def getParameters(self):
        parameterElements = self.DRIVER.find_elements_by_class_name("setup-variable")
        parameters = []
        for parameterElement in parameterElements:
            if self.containsClass(parameterElement, "ng-scope"):
                setupParameter = SetupParameter(parameterElement)
                parameters.append(setupParameter)

        return parameters

    def isExpanded(self):
        return self.containsClass(self.getSetupHeaderElement().find_element_by_xpath('..'), "open")

    def collapse(self):
        self.action("collapse protocol setup")
        if self.isExpanded():
            self.getSetupHeaderElement().click()

    def expand(self):
        self.action("expand protocol setup")
        if self.isExpanded() == False:
            self.getSetupHeaderElement().click()

    def getSetupHeaderElement(self):
        return self.DRIVER.find_element_by_class_name("protocol-setup-header")


    def addParameter(self, parameterType):
        self.action("add parameter: " + parameterType)
        self.getAddParameterElement().click()
        self.getAddParameterElement().find_element_by_xpath(".//a[text()='" + parameterType + "']").click()
        newParam = self.getParameters()[-1]
        print(newParam.getParameterType())
        return newParam

    def getAddParameterElements(self):
        self.getAddParameterElement().click()
        parameters = self.getAddParameterElement().find_elements_by_xpath(".//a")
        for parameter in parameters:
            print(parameter.text)

    def getAddParameterElement(self):
        return self.findElement(ADD_PARAMETER_BUTTON)

    def listParameters(self):
        for parameter in self.getParameters():
            print(parameter.getParameterType() + ": " + parameter.getVariableName())



class SetupParameter(Page):
    def __init__(self, parameterElement):
        self.parameterElement = parameterElement

    def getParameterType(self):
        return self.parameterElement.find_element_by_class_name("parameter-type").text

    def getVariableName(self):
        return self.getVariableNameInputField().get_attribute("value")

    def setVariableName(self, variableName):
        self.getVariableNameInputField().click()
        self.setField(self.getVariableNameInputField(), variableName)
        # self.getVariableNameInputField().send_keys(variableName)
        # self.getVariableNameInputField().send_keys(Keys.ENTER)

    def getVariableNameInputField(self):
        return self.parameterElement.find_element_by_xpath("./input[@ng-model='param.name']")


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


class OperationInstruction2(Page):
    def __init__(self, element):
        self.element = element

    def getDescription(self):
        return self.element.find_element(By.XPATH, ".//tx-protocol-field[@ng-model='opCtrl.op.description']//div[@class='field-value']//input").get_attribute("value")

    def getName(self):
        return self.element.find_element(By.XPATH, ".//span[@class='ng-binding']").text

    def expand(self):
        self.action("expanding operation: " + self.getName())
        if self.isExpanded():
            print("operation " + self.getName() + " is already expanded")
        else:
            self.click()
        time.sleep(1)

    def collapse(self):
        self.action("collapsing operation: " + self.getName())
        if self.isExpanded():
            self.click()
        else:
            print("operation " + self.getName() + " is already collapsed")


    def isExpanded(self):
        return "open" in self.element.get_attribute("class").split(" ")

    def is_displayed(self):
        return self.element.is_displayed()

    def click(self):
        self.element.find_element(By.XPATH, ".//div[contains(@class, 'operation-name')]").click()