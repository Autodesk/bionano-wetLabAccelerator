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
        return self.containsClass(self.element, "open")

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

    def getOperationFieldOld(self, fieldName):
        locator = (By.XPATH, ".//tx-protocol-field/div[contains(@class, 'field-label') and text()='" + fieldName + "']/..")
        return OperationField(self.findElement(locator, self.element))

    def getOperationField(self, fieldName):
        locator = (By.XPATH, ".//tx-protocol-field/div[contains(@class, 'field-label') and text()='" + fieldName + "']/..")
        return self.findElement(locator, self.element)

    def setOperationFieldInputField(self, fieldName, value):
        #self.getOperationField(fieldName).find_element(By.TAG_NAME, "input").send_keys(value)
        self.getOperationFieldOld(fieldName).setInputField(value)

    def getOperationFieldInputFieldValue(self, fieldName):
        return self.getOperationFieldOld(fieldName).getValue()
        #return self.getOperationField(fieldName).find_element(By.TAG_NAME, "input").get_attribute("value")

    def setOperationField(self, fieldName, value, optionalValue = None):
        self.getOperationField(fieldName).set(value, optionalValue)

    def getOperationFieldValue(self, fieldName):
        self.getOperationField(fieldName).getValue()

    def getOperationFieldsAsJson(self):
        fieldsJson = []
        fields = self.getOperationFields()
        for field in fields:
            fieldsJson.append(field.asHash())
        return fieldsJson


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

    def set(self, value, optionalValue = None):
        if self.hasInputField() and self.hasDropdown() == False:
            self.setInputField(value)
        elif self.hasDropdown() and self.hasInputField() == False:
            self.setDropdown(value)
        elif self.hasInputField() and self.hasDropdown():
            self.setInputField(value)
            if optionalValue != None:
                self.setDropdown(optionalValue)
        elif self.hasTrueFalseButton():
            self.setTrueFalseButton(value)


    def getValue(self):
        values = []
        if self.hasInputField():
            values.append(self.getInputFieldValue())
        if self.hasDropdown():
            values.append(self.getDropdownSelectedValue())

        if self.hasTrueFalseButton():
            values.append(self.getTrueFalseState())
        if len(values) == 0:
            values.append(self.findElement(OPERATION_FIELD_VALUE, self.fieldElement).text)
        return " ".join(values)

    def asHash(self):
        hash = {}
        hash["fieldName"] = self.getName()
        settings = []
        if self.hasInputField():
            inputFieldHash = {}
            inputFieldHash["inputType"] = "inputField"
            inputFieldHash["value"] = self.getInputFieldValue()
            inputFieldHash["placeholderValue"] = self.getInputFieldPlaceholderValue()
            settings.append(inputFieldHash)
        if self.hasDropdown():
            dropdownHash = {}
            dropdownHash["inputType"] = "dropdown"
            dropdownHash["selectedValue"] = self.getDropdownSelectedValue()
            dropdownHash["options"] = self.getDropdownOptions()
            settings.append(dropdownHash)
        if self.hasTrueFalseButton():
            settings.append({"inputType": "trueFalse", "trueFalse": self.getTrueFalseState()})
        hash["settings"] = settings
        return hash

    def toString(self):
        return self.getName() + ": " + self.getValue()

    def hasDropdown(self):
        return self.elementExists(DROPDOWN3, self.innerField)

    def getDropdown(self):
        return self.findElement(DROPDOWN3, self.innerField)

    def setDropdown(self, value):
        dropdown = self.getDropdown()
        dropdown.click()
        optionLocator = (By.XPATH, ".//*[text()='" + value + "']")
        self.click(self.findElement(optionLocator, self.getDropdown()), self.getName() + " dropdown " + value)

    def getDropdownOptions(self):
        dropdown = self.getDropdown()
        ##dropdown.click()
        optionsElements = self.findElements((By.XPATH, ".//li/a"), dropdown)
        options = []
        for optionElement in optionsElements:
            options.append(optionElement.text)
        ##dropdown.click()
        return options

    def getDropdownSelectedValue(self):
        if self.hasDropdown():
            self.dropdown = self.findElement(DROPDOWN3, self.innerField)
            return self.dropdown.text
        else:
            return None


    def hasInputField(self):
        return self.elementExists(INPUT_FIELD, self.innerField)

    def getInputField(self):
        return self.findElement(INPUT_FIELD, self.innerField)

    def setInputField(self, value):
        print(self.getElementAttributes(self.getInputField()))
        self.setField(self.getInputField(), value, self.getName() + " input field")

    def getInputFieldValue(self):

        if self.hasInputField():
            return self.getInputField().get_attribute("value")
        else:
            return ""

    def getInputFieldPlaceholderValue(self):
        if self.hasInputField():
            self.findElement(INPUT_FIELD, self.innerField).get_attribute("placeholder")
        else:
            return ""

    def hasTrueFalseButton(self):
        return self.elementExists(TRUE_FALSE_BUTTON, self.innerField)

    def getTrueFalseButton(self):
        return self.findElement(TRUE_FALSE_BUTTON, self.innerField)

    def setTrueFalseButton(self, boolean):
        if self.getTrueFalseState() != boolean:
            self.click(self.getTrueFalseButton(), self.getName() +  " to " + str(boolean))

    def getTrueFalseState(self):
        if self.hasTrueFalseButton():
            return self.getTrueFalseButton().find_element(By.TAG_NAME, "input").get_attribute("aria-checked") == "true"