import {expect} from '@playwright/test';
import {test} from '../test-options.js'

test('drag and drop with iframe', async({page, globalsQAURL}) => {
    await page.goto(globalsQAURL)

    const frame = page.frameLocator('[rel-title="Photo Manager"] iframe')
    await frame.locator('li', {hasText: 'High Tatras 2'}).dragTo(frame.locator('#trash'))

    //more precise control
    await frame.locator('li', {hasText: 'High Tatras 4'}).hover() //item to drag and drop
    await page.mouse.down()
    await frame.locator('#trash').hover() //where to drop item
    await page.mouse.up()

    await expect(frame.locator('#trash li h5')).toHaveText(["High Tatras 2", "High Tatras 4"])
})