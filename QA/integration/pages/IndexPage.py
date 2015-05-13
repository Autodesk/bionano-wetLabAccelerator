import time

import helpers
from pages import Page


class IndexPage(Page):
    """A page object for the index page - the main viewer"""

    def __init__(self, driver, token):
        self.DRIVER = driver
        self.TOKEN = token


        Page.__init__(self, driver)

    def open(self):
        """Load the page"""
        uri = self.BASE_URL #+ "?document=%s&accessToken=%s&env=%s" % (self.DOCUMENT, self.TOKEN, helpers.environment().capitalize())
        print("opening url: " + uri)
        self.DRIVER.get(uri)
        time.sleep(10)

    def clickDesign(self):
        self.click(self.getDesignLink(), "design link")

    def clickBuild(self):
        self.click(self.getBuildLink(), "build link")

    def clickTest(self):
        self.click(self.getTestLink(), "test link")

    def getDesignLink(self):
        return self.DRIVER.find_element_by_xpath("//a[text()='DESIGN']")

    def getBuildLink(self):
        return self.DRIVER.find_element_by_xpath("//a[text()='BUILD']")

    def getTestLink(self):
        return self.DRIVER.find_element_by_xpath("//a[text()='TEST']")

    def getSignInLink(self):
        return self.DRIVER.find_element_by_xpath("//a[@href='#/auth']")




    def click(self, element, description):
        print("click on " + description)
        element.click()









    def getCanvas(self):
        canvas = self.DRIVER.find_elements_by_tag_name('canvas')
        for i in canvas:
            if i.get_attribute('tabindex'):
                return i

    def getPanToolTip(self):
        return self.DRIVER.find_element_by_id('toolbar-panToolTip')

    def getPanTool(self):
        return self.DRIVER.find_element_by_id('toolbar-panTool')

    def getZoomToolTip(self):
        return self.DRIVER.find_element_by_id('toolbar-zoomToolTip')

    def getZoomTool(self):
        return self.DRIVER.find_element_by_id('toolbar-zoomTool')

    def getOrbitTool(self):
        return self.DRIVER.find_element_by_id('toolbar-orbitTool')

    def getResetTool(self):
        return self.DRIVER.find_element_by_id('toolbar-resetTool')

    def getOrbitToolTip(self):
        return self.DRIVER.find_element_by_id('toolbar-orbitToolTip')

    def getWalkTool(self):
        return self.DRIVER.find_element_by_id('toolbar-beelineTool')

    def getWalkToolTip(self):
        return self.DRIVER.find_element_by_id('toolbar-beelineToolTip')

    def getCameraMenu(self):
        return self.DRIVER.find_element_by_id('toolbar-cameraSubmenuTool')

    def getCameraMenuTip(self):
        return self.DRIVER.find_element_by_id('toolbar-cameraSubmenuToolTip')

    def getFitToViewTool(self):
        return self.DRIVER.find_element_by_id('toolbar-fitToViewTool')

    def getRollTool(self):
        return self.DRIVER.find_element_by_id('toolbar-rollTool')

    def getFocalLengthTool(self):
        return self.DRIVER.find_element_by_id('toolbar-focalLengthTool')

    def getModelStructureTool(self):
        return self.DRIVER.find_element_by_id('toolbar-modelStructureTool')

    def getInspectMenu(self):
        return self.DRIVER.find_element_by_id('toolbar-inspectTools')

    def getMeasureTool(self):
        return self.DRIVER.find_element_by_id('toolbar-measureTool')

    def getExplodeTool(self):
        return self.DRIVER.find_element_by_id('toolbar-explodeTool')

    def getPropertyTool(self):
        return self.DRIVER.find_element_by_id('toolbar-propertiesTool')

    def getSettingsTool(self):
        return self.DRIVER.find_element_by_id('toolbar-settingsTool')

    def getSettingsMenu(self):
        return self.DRIVER.find_element_by_id('toolbar-settingsToolSubmenu')

    def getRenderOptionsTool(self):
        return self.DRIVER.find_element_by_id('toolbar-renderOptionsTool')

    def getFullscreenTool(self):
        return self.DRIVER.find_element_by_id('toolbar-fullscreenTool')

    def getBackgroundandLightingMenu(self):
            return self.DRIVER.find_element_by_id('selectMenu_Background and lighting')