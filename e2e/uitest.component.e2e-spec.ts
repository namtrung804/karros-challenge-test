import {browser, by, element} from 'protractor';

describe('UI Test', function () {
    // Login test
    describe('Search ', function () {
        describe('Default Value', function () {
            main();
        });
        describe('Search Place and Filter', function () {
            searchPlaceAndNear();
        });
    });
});

function main() {
    beforeEach(function () {
        browser.get('/');
    });
    it('should load search page with value default', function () {
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/#/search');
    });
}

function searchPlaceAndNear() {
    let placeInput = element(by.css('.place-input'));
    let nearInput = element(by.css('.near-input'));
    let searchBtn = element(by.id('header-search-submit'));
    let business = element.all(by.css('.biz-name')).get(0);
    it('should search', function () {
        placeInput.clear();
        placeInput.sendKeys(browser.params.place);
        nearInput.clear();
        nearInput.sendKeys(browser.params.near);
        searchBtn.click();
        expect(business.getText()).toBe('Joon Shabu Shabu');
    });

    it('should return business with pagination page 2', function () {
        element.all(by.css('.ui-paginator-page')).get(1).click();
        expect(business.getText()).toBe('Fu House');
    });

    it('should show all filter', function () {
        element(by.css('.filter-all')).click();
        expect(element(by.css('.all-filter-show')).getText()).toBe('Sort By');
    });


    let filterPrice = element.all(by.css('.filter-price'));
    it('should return business with $ price filter', function () {
        filterPrice.get(0).click();
        expect(business.getText()).toBe('Sanamluang Cafe');
    });
    it('should return business with $$ price filter', function () {
        filterPrice.get(1).click();
        expect(business.getText()).toBe('Joon Shabu Shabu');
    });

    it('should return business with cash back filter', function () {
        element(by.css('.filter-cashback')).click();
        expect(business.getText()).toBe('Tokyo Shabu Shabu');
    });


}
