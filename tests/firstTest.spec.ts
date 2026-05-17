import {test, expect} from '@playwright/test'

test.beforeEach(async ({page}) => {
    await page.goto('/')
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()
})

test.skip('Locator syntax rules', async ({page}) => {
    //by tag name
    await page.locator('input').click()

    //by ID
    page.locator('#inputEmail1')

    //by Class value
    page.locator('.shape-rectangle')

    //by attribute
    page.locator('[placeholder="Email"]')

    //by Class value (full)
    page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]')
    
    //combine different selectors
    page.locator('input[placeholder="Email"][nbinput]')

    //by XPath(NOT RECOMMENDED)
    page.locator('//*[@id="inputEmail1"]')
    
    //by partial text match
    page.locator(':text("Using")')

    //by exact text match
    page.locator(':text-is("Using the Grid")')

})

test('User facing locators', async ({page}) => {
    await page.getByRole('textbox', {name: 'Email'}).first().click()
    await page.getByRole('button', {name: 'Sign in'}).first().click()

    await page.getByLabel('Email').first().fill('Anna')

    await page.getByPlaceholder('Jane Doe').click()

    await page.getByText('Using the Grid').click()

    //await page.getByTitle('IoT Dashboard').click()

    await page.getByTestId('SignIn').click()

})

test('Locating child elements', async ({page}) => {
    await page.locator('nb-card nb-radio :text-is("Option 1")').click()
    await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 1")').click()

    await page.locator('nb-card').getByRole('button', {name: 'Sign in'}).first().click()

    await page.locator('nb-card').nth(3).getByRole('button').click()
})

test('Locatina parent element', async({page}) => {
    await page.locator('nb-card', {hasText: 'Using the Grid'}).getByRole('button', {name: 'Sign in'}).click()

    await page.locator('nb-card', {has: page.locator('#inputEmail1')}).getByRole('button', {name: 'Sign in'}).click()

    await page.locator('nb-card').filter({hasText: 'Basic form'}).getByRole('textbox', {name: 'Email'}).click()
    await page.locator('nb-card').filter({has: page.locator('#exampleInputEmail1')}).getByRole('button', {name: 'Submit'}).click()


    await page.locator('nb-card').filter({has: page.locator('nb-checkbox')}).filter({hasText: 'Sign in'})
        .getByRole('textbox', {name: 'Email'}).click()

    await page.locator(':text-is("Using the Grid")').locator('..').getByRole('textbox', {name: 'Email'}).click()
})

test('Reusing the locators', async({page}) => {
    const basicForm = page.locator('nb-card').filter({hasText: 'Basic form'})
    const emailInput = basicForm.getByRole('textbox', {name: 'Email'})

    await emailInput.fill('test@test.com')
    await basicForm.getByRole('textbox', {name: 'Password'}).fill('Welcome123')
    await basicForm.locator('nb-checkbox').click()
    await basicForm.getByRole('button', {name: 'Submit'}).click()

    await expect(emailInput).toHaveValue('test@test.com')
})

test('Extracting values', async ({page}) => {
    //single text value
    const basicForm = page.locator('nb-card').filter({hasText: 'Basic form'})
    const buttonText = await basicForm.locator('button').textContent()
    expect(buttonText).toEqual('Submit')

    //all text values
    const radioButtons = await page.locator('nb-radio').allTextContents()
    expect(radioButtons).toContain('Option 1')

    //value of input field
    const emailField = basicForm.getByRole('textbox', {name: 'Email'})
    await emailField.fill('test@test.com')
    const emailInputValue = await emailField.inputValue()
    expect(emailInputValue).toEqual('test@test.com')

    //value of attribute
    const placeholderValue = await emailField.getAttribute('placeholder')
    expect(placeholderValue).toEqual('Email')
})

test('Assertions', async({page}) => {
    //General Assertions
    const value = 5
    expect(value).toEqual(5)

    const basicFormButton = page.locator('nb-card').filter({hasText: 'Basic form'}).locator('button')
    const basicFormButtonText = await basicFormButton.textContent()
    expect(basicFormButtonText).toEqual('Submit')

    //Locator Assertions
    await expect(basicFormButton).toHaveText('Submit')

    //Soft assertion
    await expect.soft(basicFormButton).toHaveText('Submit')
    await basicFormButton.click()

})