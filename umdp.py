from os import getcwd, system
from time import sleep
from threading import Thread

# RPLCD (original code by Danilo Bargen)
import RPi.GPIO as GPIO
from RPLCD import CharLCD
# Selenium
from selenium import webdriver
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities


def getDriver():
    capabilities = DesiredCapabilities.CHROME
    capabilities['loggingPrefs'] = { 'browser':'ALL' }
    options = webdriver.ChromeOptions()
    options.add_argument('--autoplay-policy=no-user-gesture-required')

    return webdriver.Chrome(
        desired_capabilities=capabilities,
#         executable_path='{}/async/chromedriver'.format(getcwd()),
        options = options
    )

def init():
    clear()
    title = True
    lines = ['Une matiere du', 'present']
    write_to_screen(lines)
    lines = ['', '']

def animate(lines):
    row = ' ' * 14 + lines[1]
    text = [lines[0], '']
    for i in range(len(row) + 1):
        if stop:
            break
        text[1] = row[i:i+15]
        write_to_screen(text)
        sleep(0.15)


# python
# def clear():
#     system('clear')
# 
# def write_to_screen(lines):
#     clear()
#     for row in lines:
#         print(row)
 
# lcd
def clear():
    lcd.clear()

def write_to_screen(lines, num_cols=16):
    lcd.home()
    for row in lines:
        lcd.write_string((" " + row).ljust(num_cols)[:num_cols])
        lcd.write_string('\r\n')


lcd = CharLCD(cols=16, rows=2, pin_rs=7, pin_e=8, pins_data=[25, 24, 23, 18], numbering_mode=GPIO.BCM, charmap='A02')
driver = getDriver()
driver.get('localhost:8000')

title = True
lines = ['', '']
stop = False
current_thread = None

init()


while True:
    for entry in driver.get_log('browser'):
        if entry['level'] == 'INFO':
            msg = entry['message'].split('"')[1]
            if msg in ['reset', 'reverse']:
                stop = True
                current_thread.join()
                stop = False
                if msg == 'reset':
                    init()
                else:
                    lines[1] = ''
                    write_to_screen(lines)
                continue
            if title:
                clear()
                title = None
            if len(msg) < 15:
                lines[0] = msg
                write_to_screen(lines)
            elif len(msg) > 15:
                lines[1] = msg
                current_thread = Thread(target=animate, args=[lines])
                current_thread.start()


lcd.close(clear=True)
