const path = require('path');
const fs = require('fs-extra');
const Scripts = require('../../../scripts');
const { waitForPort } = require('../../../utils');

const scripts = Scripts.setupProjectFromTemplate({
  templateDir: __dirname,
  projectType: Scripts.projectType.JS,
});

const clientFilePath = path.join(scripts.testDirectory, 'src/component.js');

const serverFilePath = path.join(scripts.testDirectory, 'src/server.js');

// const workerFilePath = path.join(process.env.TEST_DIRECTORY, 'src/worker.js');

const originalServerContent = fs.readFileSync(serverFilePath, 'utf-8');

describe.each(['dev'])('hmr [%s]', mode => {
  describe('client side', () => {
    it('integration', async () => {
      await scripts[mode](async () => {
        await page.goto(`http://localhost:3000`);
        await page.$eval('#css-inclusion', elm => elm.getAttribute('class'));

        expect(await page.$eval('#css-inclusion', elm => elm.textContent)).toBe(
          'CSS Modules are working!',
        );

        const originalContent = fs.readFileSync(clientFilePath, 'utf-8');

        const editedContent = originalContent.replace(
          'CSS Modules are working!',
          'Overridden content!',
        );

        fs.writeFileSync(clientFilePath, editedContent);

        await page.waitForNavigation();

        expect(await page.$eval('#css-inclusion', elm => elm.textContent)).toBe(
          'Overridden content!',
        );

        fs.writeFileSync(clientFilePath, originalContent);

        await page.waitForNavigation();

        expect(await page.$eval('#css-inclusion', elm => elm.textContent)).toBe(
          'CSS Modules are working!',
        );
      });
    });
  });
  describe('server side', () => {
    it('reloads server on changes and reloads the browser', async () => {
      await scripts[mode](async () => {
        await page.goto(`http://localhost:3000`);

        expect(await page.title()).toBe('Some title');

        fs.writeFileSync(
          serverFilePath,
          originalServerContent.replace('Some title', 'Overridden title!'),
        );

        await page.waitForNavigation();

        expect(await page.title()).toBe('Overridden title!');

        fs.writeFileSync(serverFilePath, originalServerContent);

        await waitForPort(3000);

        await page.waitForNavigation();

        expect(await page.title()).toBe('Some title');
      });
    });
  });
});
