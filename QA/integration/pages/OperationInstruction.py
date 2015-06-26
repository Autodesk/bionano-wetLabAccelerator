import helpers
import time
from selenium.webdriver.common.by import By

from pages import Page
from ProtocolSetup import ProtocolSetup


DESCRIPTION_FIELD = (By.XPATH, ".//tx-protocol-field[@ng-model='opCtrl.op.description']//div[@class='field-value']//input")
OPERATION = (By.XPATH, ".//span[contains(@class, 'operation-name')]")
PROTOCOL_FIELD = (By.TAG_NAME, "tx-protocol-field")
class OperationInstruction(Page):
    def __init__(self, element):
        elemString = "<" + element.tag_name + " class='" + element.get_attribute('class') + "'>"
        # print(elemString)

        self.element = element
        self.DRIVER = element.parent

    def getDescription(self):
        return self.findElement(DESCRIPTION_FIELD, self.element).get_attribute("value")

    def setDescription(self, descriptionString):
        self.setField(self.findElement(DESCRIPTION_FIELD, self.element), descriptionString, "operation description")
    def getName(self):
        return self.getOperation().text

    def expand(self):
        self.action("expand '" + self.getName() + "' operation")
        if self.isExpanded():
            print("operation '" + self.getName() + "' is already expanded")
        else:
            self.click()
        time.sleep(1)

    def collapse(self):
        self.action("collapse '" + self.getName() + "' operation")
        if self.isExpanded():
            self.click()
        else:
            print("operation '" + self.getName() + "' is already collapsed")


    def isExpanded(self):
        return "open" in self.element.get_attribute("class").split(" ")

    def is_displayed(self):
        return self.element.is_displayed()

    def click(self):
        self.getOperation().click()

    def getOperation(self):
        return self.findElement(OPERATION, self.element)

    def getOperationFields(self):
        fieldElements = self.findElements(PROTOCOL_FIELD, self.element)
        operationFields = []
        for fieldElement in fieldElements:
            if fieldElement.is_displayed():
                operationFields.append(OperationField(fieldElement))
        return operationFields



OPERATION_FIELD_LABEL = (By.CLASS_NAME, "field-label")
OPERATION_FIELD_VALUE = (By.CLASS_NAME, "field-value")
OPERATION_INNER_FIELD = (By.TAG_NAME, "tx-protocol-field-inner")
DROPDOWN = (By.CLASS_NAME, "option-button")
DROPDOWN3 = (By.XPATH, ".//*[contains(@class, 'option-button') or @dropdown]")
DROPDOWN2 = (By.XPATH, ".//div[@dropdown]")
INPUT_FIELD = (By.XPATH, ".//input[@type='text' or @type='number']")
TRUE_FALSE_BUTTON = (By.CLASS_NAME, "true-false-button")

class OperationField(Page):
    def __init__(self, fieldElement):
        self.fieldElement = fieldElement
        self.DRIVER = self.fieldElement.parent
        self.innerField = self.findElement(OPERATION_INNER_FIELD, self.fieldElement)

    def getName(self):
        return self.findElement(OPERATION_FIELD_LABEL, self.fieldElement).text

    def getValue(self):
        values = []
        if self.hasInputField():
            values.append("inputField: " + self.getInputFieldValue())
        if self.hasDropdown():
            values.append("dropdown: " + self.getDropdownSelectedValue() + ", values: " + ", ".join(self.getDropdownValues()))

        if self.hasTrueFalseButton():
            values.append("checked: " + self.getTrueFalseState())
        if len(values) == 0:
            values.append(self.findElement(OPERATION_FIELD_VALUE, self.fieldElement).text)
        return ", ".join(values)

    def toString(self):
        return self.getName() + ": " + self.getValue()

    def hasDropdown(self):
        return self.elementExists(DROPDOWN3, self.innerField)

    def getDropdownValues(self):
        dropdown = self.findElement(DROPDOWN3, self.innerField)
        dropdown.click()
        optionsElements = self.findElements((By.CLASS_NAME, "ng-binding"), dropdown)
        options = []
        for optionElement in optionsElements:
            options.append(optionElement.text)
        dropdown.click()
        return options

    def getDropdownSelectedValue(self):
        if self.hasDropdown():
            self.dropdown = self.findElement(DROPDOWN3, self.innerField)
            return self.dropdown.text
        else:
            return None


    def hasInputField(self):
        return self.elementExists(INPUT_FIELD, self.innerField)

    def getInputFieldValue(self):

        if self.hasInputField():
            self.inputField = self.findElement(INPUT_FIELD, self.innerField)
            inputValue = self.inputField.get_attribute("value")
            placeholderValue = self.inputField.get_attribute("placeholder")
            if inputValue == "" and placeholderValue == "":
                return None
            elif inputValue != "":
                return inputValue
            else:
                return placeholderValue
        else:
            return None

    def hasTrueFalseButton(self):
        return self.elementExists(TRUE_FALSE_BUTTON, self.innerField)

    def getTrueFalseState(self):
        if self.hasTrueFalseButton():
            return self.findElement(TRUE_FALSE_BUTTON, self.innerField).find_element(By.TAG_NAME, "input").get_attribute("aria-checked")