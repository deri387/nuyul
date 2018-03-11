# -*- coding: utf-8 -*-
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import NoAlertPresentException
import unittest, time, re
import os
from PIL import Image

from tesserocr import PyTessBaseAPI

driver = webdriver.Chrome()   
driver.maximize_window()
driver.get('https://freebitco.in/')
driver.find_element_by_xpath("html/body/div[1]/div/nav/section/ul/li[10]/a").click()
Select(driver.find_element_by_id("signup_page_captcha_types")).select_by_visible_text("Solve Media")
time.sleep(2)
scheight = .1
while scheight < 9.9:
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight/%s);" % scheight)
    scheight += .01         
def execute():   
    driver.execute_script("javascript:ACPuzzle.reload('')")
    time.sleep(9)
    driver.save_screenshot('driver.png')
    image_file = Image.open("driver.png") # open colour image
    image_file= image_file.convert('L') # convert image to monochrome - this works
    image_file.save('result.png')

    images = ['result.png' ]
    with PyTessBaseAPI() as api:
        for img in images:
            api.SetImageFile(img)
            pignore = (api.GetUTF8Text())
            ignore=  (api.AllWordConfidences())
            pignore = str(pignore)
            
    matchObj = re.search( r'Please Enter (.*)', pignore, re.M|re.I)
    if matchObj:
        game = matchObj.group(1)

        driver.execute_script("document.getElementById('login_form_btc_address').value+='example@email.com'")
        driver.find_element_by_id("login_form_password").send_keys("password")
        driver.find_element_by_id("adcopy_response").send_keys(game)
        driver.find_element_by_id("login_button").click()
        time.sleep (5)
    else:
        execute()

execute()

def brutal():
    driver.get('https://freebitco.in/?op=home')
    Select(driver.find_element_by_id("free_play_captcha_types")).select_by_visible_text("Solve Media")
    time.sleep(10)

    scheight = .1
    while scheight < 2:
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight/%s);" % scheight)
        scheight += .01
brutal()

def execute2():
    driver.save_screenshot('driver.png')
    image_file = Image.open("driver.png") # open colour image
    image_file= image_file.convert('L') # convert image to monochrome - this works
    #image_file= image_file.convert('1') # convert image to black and white
    image_file.save('result.png')
    
    images = ['result.png' ]
    with PyTessBaseAPI() as api:
        for img in images:
            api.SetImageFile(img)
            pignore = (api.GetUTF8Text())
            ignore=  (api.AllWordConfidences())
            pignore = str(pignore)
    matchObj1 = re.search( r'Please Enter. (.*)', pignore, re.M|re.I)
    if matchObj1:
        game = matchObj1.group(1)
        driver.find_element_by_id("adcopy_response").send_keys(game)
        frame1 = driver.find_element_by_id("free_play_form_button")
        driver.execute_script("$(arguments[0]).click();", frame1)
        print ("Waiting 60 minutes for next claim")
        time.sleep(3600)
        brutal()
    else:
        matchObj2 = re.search( r'Please Enter, (.*)', pignore, re.M|re.I)
        if matchObj2:
            game2 = matchObj2.group(1)
            driver.find_element_by_id("adcopy_response").send_keys(game2)
            frame2 = driver.find_element_by_id("free_play_form_button")
            driver.execute_script("$(arguments[0]).click();", frame2)
            ("Waiting 60 minutes for next claim")
            time.sleep(3600)
            brutal()
        else:
            matchObj3 = re.search( r'Ple ase Enter, (.*)', pignore, re.M|re.I)
            if matchObj3:
                game3 = matchObj3.group(1)
                driver.find_element_by_id("adcopy_response").send_keys(game3)
                frame3 = driver.find_element_by_id("free_play_form_button")
                driver.execute_script("$(arguments[0]).click();", frame3)
                ("Waiting 60 minutes for next claim")
                time.sleep(3600)
                brutal()
            else:
                driver.execute_script("javascript:ACPuzzle.reload('')")
                time.sleep(10)
                execute2()

execute2()
