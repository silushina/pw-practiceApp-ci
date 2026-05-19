import {test, expect} from '@playwright/test'
import { NavigationPage } from '../page-objects/navigatetonPage.js'

test.describe.configure({mode: 'parallel'})

test.beforeEach(async ({page}) => {
    await page.goto('/')
})

test.describe('Form layouts page @regression', () => {
    test.describe.configure({retries: 0, mode: 'serial'})
    test.beforeEach(async({page}) => {
        await page.getByText('Forms').click()
        await page.getByText('Form Layouts').click()
    })

    test('Input fields', async ({page}, testInfo) => {
        if(testInfo.retry){
            //do something
        }
        const usingTheGridEmailInput = page.locator('nb-card', {hasText: 'Using the Grid'}).getByRole('textbox', {name: 'Email'})

        await usingTheGridEmailInput.fill('test@test.com')
        await usingTheGridEmailInput.clear()
        await usingTheGridEmailInput.pressSequentially('test@test.com')

        //generic assertion
        // const inputValue = await usingTheGridEmailInput.inputValue()
        // expect(inputValue).toEqual('test@test.com')
        
        //locator assertion
        await expect(usingTheGridEmailInput).toHaveValue('test@test.com')
    })

    test.only('radiobuttons', async ({page}) => {
        const usingTheGridForm = page.locator('nb-card', {hasText: 'Using the Grid'})
        //await usingTheGridForm.getByLabel('Option 1').check({force: true})

        await usingTheGridForm.getByRole('radio', {name: 'Option 1'}).check({force: true})
        const radioStatus = await usingTheGridForm.getByRole('radio', {name: 'Option 1'}).isChecked()

        // visual testing. generate screenshot which will be used later for comparison
        await expect(usingTheGridForm).toHaveScreenshot({maxDiffPixels: 150, timeout: 10000})


        // //generic assertion
        // expect(radioStatus).toBeTruthy()

        // //locator assertion
        // const radioLocator = usingTheGridForm.getByRole('radio', {name: 'Option 1'})
        // await expect(radioLocator).toBeChecked()

        // await usingTheGridForm.getByRole('radio', {name: 'Option 2'}).check({force: true})
        // expect(await usingTheGridForm.getByRole('radio', {name: 'Option 1'}).isChecked()).toBeFalsy()
        // expect(await usingTheGridForm.getByRole('radio', {name: 'Option 2'}).isChecked()).toBeTruthy()

    })
})

test('radiobuttons @smoke', async({page}) => {
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Toastr').click()

    await page.getByRole('checkbox', {name: "Hide on click"}).click({force: true})
    await page.getByRole('checkbox', {name: "Hide on click"}).uncheck({force: true})
    await page.getByRole('checkbox', {name: "Prevent arising of duplicate toast"}).check({force: true})

    const allCheckboxes = page.getByRole('checkbox')
    for(let box of await allCheckboxes.all()){
        await box.uncheck({force: true})
        expect(await box.isChecked()).toBeFalsy()
    }
})

test('lists and dropdowns @regression @new', async({page}) => {
    const dropDownMenu = page.locator('ngx-header nb-select')
    await dropDownMenu.click()

    page.getByRole('list') // when list has UL tag
    page.getByRole('listitem') // when list has LI tag

    //const optionList = page.getByRole('list').locator('nb-option')

    const optionList = page.locator('nb-option-list nb-option')
    await expect(optionList).toHaveText(['Light','Dark','Cosmic','Corporate'])
    await optionList.filter({hasText: "Dark"}).click()

    const header = page.locator('nb-layout-header')
    await expect(header).toHaveCSS('background-color', 'rgb(34, 43, 69)')


    const colors = {
        "Light": 'rgb(255, 255, 255)',
        "Dark": 'rgb(34, 43, 69)', 
        "Cosmic": 'rgb(50, 50, 89)',
        "Corporate": 'rgb(255, 255, 255)'
    }
    await dropDownMenu.click()
    for(const color in colors){
        await optionList.filter({hasText: color}).click()
        await expect(header).toHaveCSS('background-color', colors[color as keyof typeof colors])
        if(color != 'Corporate')
            await dropDownMenu.click()
    }
})

test('tooltips', async({page}) => {
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Tooltip').click()

    const tooltipPlacementsCard = page.locator('nb-card', {hasText: 'Tooltip Placements'})
    await tooltipPlacementsCard.getByRole('button', {name: 'Top'}).hover()

    //const topTooltip = await page.locator('nb-tooltip').textContent()
    //expect(topTooltip).toEqual('This is a tooltip')

    page.getByRole('tooltip') // if you have a role Tooltip created

    const topTooltip = page.locator('nb-tooltip')
    await expect(topTooltip).toHaveText('This is a tooltip')
})

test('dialog box', async({page}) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click() 


    page.on('dialog', dialog => {
        expect(dialog.message()).toEqual('Are you sure you want to delete?')
        dialog.accept()
    })


    await page.getByRole('table').locator('tr', {hasText: 'mdo@gmail.com'}).locator('.nb-trash').click()
    await expect(page.locator('table tr').first()).not.toHaveText('mdo@gmail.com')

})

test('dialog box2', async({page}) => {
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Dialog').click()    

    const openDialogCard = page.locator('nb-card', {hasText: 'Open Dialog'})
    await openDialogCard.getByRole('button', {name: 'Open Dialog with component'}).click()

    const dialogBox = page.locator('nb-dialog-container nb-card')
    await expect(dialogBox).toBeVisible()

    await dialogBox.getByRole('button', {name: 'Dismiss Dialog'}).click()
    await expect(dialogBox).toBeHidden()
})

test('tables', async({page}) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()


    //1 get row by any text in this row
    const targetRow = page.getByRole('row', {name: 'twitter@outlook.com'})
    await targetRow.locator('.nb-edit').click()

    await page.locator('input-editor').getByPlaceholder('Age').clear()
    await page.locator('input-editor').getByPlaceholder('Age').fill('25')
    await targetRow.locator('.nb-checkmark').click()

    //2 get row based on the value in the specific column
    await page.locator('.ng2-smart-pagination-nav').getByText('2').click()
    const targetRowByID = page.getByRole('row', {name: '11'}).filter({has: page.locator('td').nth(1).getByText('11')})
    await targetRowByID.locator('.nb-edit').click()
    await page.locator('input-editor').getByPlaceholder('E-mail').clear()
    await page.locator('input-editor').getByPlaceholder('E-mail').fill('25mail@mail.com')
    await page.locator('.nb-checkmark').click()
    await expect(targetRowByID.locator('td').nth(5)).toHaveText('25mail@mail.com')

    //3 test filter of the table
    const ages = ['20', '30', '40', '200']

    for(let age of ages){
        await page.locator('input-filter').getByPlaceholder('Age').clear()
        await page.locator('input-filter').getByPlaceholder('Age').fill(age)
        await page.waitForTimeout(500)
        const ageRows = page.locator('tbody tr')

        for(let row of await ageRows.all()){
            const cellValue = await row.locator('td').last().textContent()
            if(age !== '200'){
                expect(cellValue).toEqual(age)
            }else{
                expect(await page.getByRole('table').textContent()).toContain(' No data found ')
            }
            
        }

    }



})

test('datepicker', async({page}) => {
    const navigateToPicker = new NavigationPage(page)
    await navigateToPicker.datePickerPage()
    
    const calendarInputField = page.getByPlaceholder('Form Picker')
    await calendarInputField.click()
    
    let date = new Date()
    date.setDate(date.getDate() + 20)
    const expectedDate = date.getDate().toString()
    const expectedMonthShort = date.toLocaleString('En-US', {month: 'short'})
    const expectedMonthLong = date.toLocaleString('En-US', {month: 'long'})
    const expectedYear = date.getFullYear()
    const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`

    let calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    const expectedMonthAndYear = ` ${expectedMonthLong} ${expectedYear} `

    while(calendarMonthAndYear && !calendarMonthAndYear.includes(expectedMonthAndYear)){
        await page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
        calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    }

    //all the elements that related to current month
    const currentDay = page.locator('[class="day-cell ng-star-inserted"]')
    await currentDay.getByText(expectedDate,{exact: true}).click()
    await expect(calendarInputField).toHaveValue(dateToAssert)

})

test('slider', async({page}) => {
    //update slider attribute
    // const tempGauge = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle')
    // await tempGauge.evaluate( el => {
    //     el.setAttribute('cx', '228.52');
    //     el.setAttribute('cy', '228.52');
    // })
    // await tempGauge.click()


    //mouse movement
    const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger')
    await tempBox.scrollIntoViewIfNeeded()
    
    const box = await tempBox.boundingBox()

    //boundingBox() может вернуть null. поэтому добавляем проверку
    if (!box) {
    throw new Error('Element is not visible or has no bounding box');
}
    const x = box.x + box.width / 2
    const y = box.y + box.height / 2
    await page.mouse.move(x,y)
    await page.mouse.down()
    await page.mouse.move(x + 100, y)
    await page.mouse.move(x + 100, y + 100)
    await page.mouse.up()

    await expect(tempBox).toContainText('30')
})