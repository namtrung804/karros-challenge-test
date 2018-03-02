describe('UI Test', function () {
  // Login test
  describe('Login ', function () {
    describe('Landing Page', function () {
      landingPage();
    });
    describe('Intro Page', function () {
      introPage();
    });
    describe('Login Page', function () {
      loginPage();
    });
  });

  // Topup test
  describe('Topup Popup', function () {
    describe('Dashboard Sidebar Page', function () {
      sideBar('Mua cước', 'recharge');
    });
    describe('Show popup Topup', function () {
      topupPopup();
    });
  });


  // Charge Create test
  describe('Charge Create Page', function () {
    describe('Dashboard Sidebar Page', function () {
      sideBar('Mua cước', 'recharge');
    });
    describe('should redirect to Charge Create Page', function () {
      sideBar('Tự tạo gói cước', 'charge-create');
    });
    describe('should success to create Packages', function () {
      chargeCreate();
    });
  });

  // View Histories Page test
  describe('Histories Package', function () {
    describe('Dashboard Sidebar Page', function () {
      sideBar('Lịch sử', 'histories');
    });
    describe('View minus packages', function () {
      minusPackages();
    });
  });

  // Buy more Package test
  describe('Buy More Package', function () {
    describe('Dashboard Sidebar Page', function () {
      sideBar('Lịch sử', 'histories');
    });
    describe('should redirect to Charge Create Page', function () {
      sideBar('Mua thêm', 'charge-create?buynew=1');
    });
    describe('should success to buy more Package', function () {
      buymorePackage();
    });
  });

  // Cancel Package test
  describe('Cancel Package', function () {
    describe('Dashboard Sidebar Page', function () {
      sideBar('Lịch sử', 'histories');
    });
    describe('should success to cancel Package', function () {
      cancelPackage();
    });
  });

  // Buy promotions Packages test
  describe('Buy promotions Packages', function () {
    describe('Dashboard Sidebar Page', function () {
      sideBar('Mua cước', 'recharge');
    });
    describe('should success to buy promotions Packages Month', function () {
      promotionsPackage('radio3');
    });
    describe('should success to buy promotions Packages Week', function () {
      promotionsPackage('radio2');
    });
    describe('should success to buy promotions Packages Day', function () {
      promotionsPackage('radio1');
    });
  });

  // Edit account info test
  describe('Edit account info', function () {
    describe('Dashboard Sidebar Page', function () {
      sideBar('Thông tin người dùng', 'account');
    });
    describe('should success to edit account info', function () {
      accountInfo();
    });
  });

  // View faq page test
  describe('View promotions page', function () {
    describe('Dashboard Sidebar Page', function () {
      sideBar('Câu hỏi thường gặp', 'faq');
    });
    describe('open first collapse', function () {
      faq();
    });
  });

  // View promotions page test
  describe('View promotions page', function () {
    describe('Dashboard Sidebar Page', function () {
      sideBar('Thông tin khuyến mãi', 'promotions');
    });
    describe('open first collapse', function () {
      faq();
    });
  });

  // View store page test
  describe('View promotions page', function () {
    describe('Dashboard Sidebar Page', function () {
      sideBar('Cửa hàng Mobifone', 'stores');
    });
    describe('search and chose first store', function () {
      store();
    });
  });

  // View promotions page test
  describe('Logout', function () {
    describe('Logout', function () {
      let textButton = element(by.partialLinkText('Đăng xuất'));
      it("should Logout sidebar button", function () {
        browser.sleep(browser.timeStep);
        textButton.click();
        browser.sleep(5000);
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + 'intro');
      });
    });
  });
});

function landingPage() {
  let introButton = element(by.partialLinkText('ĐĂNG NHẬP'));
  beforeEach(function () {
    browser.get('/');
  });
  it("should redirect to Intro Page", function () {
    browser.sleep(browser.timeStep);
    introButton.click();
    expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + 'intro');
  });
}

function introPage() {
  let msisdnInput = element(by.css('.phone-number-introduce'));
  let loginBtn = element(by.css('.btn-login'));
  it("should check Phone number", function () {
    browser.sleep(browser.params.timeStep);
    msisdnInput.sendKeys(browser.params.msisdn);
    browser.sleep(browser.params.timeStep);
    loginBtn.click();
    browser.sleep(browser.params.timeStep);
    expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + 'login');
  });
}

function loginPage() {
  let passwordInput = element(by.css('.input-password'));
  let loginBtn = element(by.css('.btn-login'));

  it("should check Password", function () {
    browser.sleep(browser.params.timeStep);
    passwordInput.sendKeys(browser.params.password);
    browser.sleep(browser.params.timeStep);
    loginBtn.click();
    browser.sleep(3000);
    expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + 'dashboard');
  });
}

function sideBar(textBtn, expectUrl) {
  let textButton = element(by.partialLinkText(textBtn));
  it("should " + textBtn + " sidebar button", function () {
    browser.sleep(3000);
    textButton.click();
    browser.sleep(browser.timeStep);
    expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + expectUrl);
  });
}

function topupPopup() {
  let passwordInput = element(by.css("input[formControlName=cardNumber]"));
  let showPopupBtn = element(by.css('.btn-topup-hp'));
  let topupBtn = element(by.css('.btn-topup-popup'));
  it("should success Topup ", function () {
    browser.sleep(browser.params.timeStep);
    showPopupBtn.click();
    browser.sleep(browser.params.timeStep);
    passwordInput.sendKeys(browser.params.serialNumber);
    browser.sleep(browser.params.timeStep);
    topupBtn.click();
    browser.sleep(5000);
    expect(element(by.css('.alert-message')).getText()).toBe("Nạp thẻ thành công. Cảm ơn Quý khách đã sử dụng dịch vụ của MobiFone.");
    element(by.css('.btn-close-popup')).click();
  });
}

function chargeCreate() {
  let daySelect = element(by.id('radio1'));
  let showPopupBtn = element.all(by.css('.btn-register-plan')).get(0);
  let buyPackageBtn = element(by.css('.btn-buy-package'));
  it("should success Topup ", function () {
    browser.sleep(browser.params.timeStep);
    daySelect.click();
    browser.sleep(browser.params.timeStep);
    // Chose Voice NM
    chosePackage(0, 0);
    browser.sleep(browser.params.timeStep);
    // Chose SMS NM
    chosePackage(1, 1);
    browser.sleep(browser.params.timeStep);
    // Chose Voice LM
    chosePackage(2, 0);
    browser.sleep(browser.params.timeStep);
    // Chose SMS LM
    chosePackage(3, 1);
    browser.sleep(browser.params.timeStep);
    // Chose DATA
    chosePackage(4, 0);
    browser.sleep(browser.params.timeStep);
    // Show Popup confirm
    showPopupBtn.click();
    browser.sleep(browser.params.timeStep);
    buyPackageBtn.click();
    browser.sleep(5000);
    expect(element(by.css('.alert-message')).getText()).toBe("Chúc mừng quý khách đã mua thành công gói cước của m090.");
    browser.sleep(browser.params.timeStep);
    element(by.css('.btn-close-popup-buy-plan')).click();
  });
}

function chosePackage(step, chosePackage) {
  let package = element(by.id('step-' + step)).all(by.tagName('.box-plan-charge-create'));
  package.each(function (element, index) {
    if (index == chosePackage) {
      element.click();
    }
  });
}

function buymorePackage() {
  let showPopupBtn = element(by.css('.btn-register-plan'));
  let buyPackageBtn = element(by.css('.btn-buy-package'));
  it("should success Topup ", function () {
    browser.sleep(browser.params.timeStep);
    // Chose SMS NM
    chosePackage(0, 1);
    browser.sleep(browser.params.timeStep);
    // Chose SMS LM
    chosePackage(1, 0);
    browser.sleep(browser.params.timeStep);
    // Show Popup confirm
    showPopupBtn.click();
    browser.sleep(browser.params.timeStep);
    buyPackageBtn.click();
    browser.sleep(5000);
    expect(element(by.css('.alert-message')).getText()).toBe("Chúc mừng quý khách đã mua thành công gói cước của m090.");
    browser.sleep(browser.params.timeStep);
    element(by.css('.btn-close-popup-buy-plan')).click();
  });
}

function minusPackages() {
  let minusButton = element(by.partialLinkText('Trừ cước'));
  it("View minus packages", function () {
    browser.sleep(browser.timeStep);
    minusButton.click();
    browser.sleep(browser.timeStep);
    expect(element(by.id('minus-tab')).getAttribute('class')).toEqual('active');
  });
}

function cancelPackage() {
  let cancelBtn = element(by.css('.btn-cancel-plan'));
  it("should success Cancel package ", function () {
    browser.sleep(browser.params.timeStep);
    cancelBtn.click();
    browser.sleep(browser.params.timeStep);
    element(by.css('.btn-confirm-cancel')).click();
    browser.sleep(5000);
    expect(element(by.css('.alert-message')).getText()).toBe("Quý khách đã hủy thành công gói đang sử dụng. Quý khách sẽ tiếp tục được sử dụng dung lượng đã mua đến hết chu kì. Xin cảm ơn quý khách!");
  });
}

function promotionsPackage(cycle) {
  let cycleBtn = element(by.id(cycle));
  let package = element.all(by.css('.box-plan-wrapper-hp')).get(0);
  it("should success buy promotions packages ", function () {
    browser.sleep(browser.params.timeStep);
    cycleBtn.click();
    browser.sleep(browser.params.timeStep);
    package.click();
    browser.sleep(browser.params.timeStep);
    element(by.css('.btn-buy-package')).click();
    browser.sleep(5000);
    expect(element(by.css('.alert-message')).getText()).toBe("Chúc mừng quý khách đã mua thành công gói cước của m090.");
    browser.sleep(browser.params.timeStep);
    element(by.css('.btn-close-popup-buy-plan')).click();
  });
}

function accountInfo() {
  let fullName = element(by.css("input[formControlName=fullName]"));
  let email = element(by.css("input[formControlName=email]"));
  let address = element(by.css("input[formControlName=address]"));
  let birthDay = element(by.css("input[formControlName=birthDay]")); // 1991-04-09
  let sex = element(by.css("select[formControlName=sex]"));
  let editBtn = element(by.css('.btn-edit-info'));
  it("should success edit info ", function () {
    browser.sleep(browser.params.timeStep);
    fullName.clear();
    fullName.sendKeys('Trần Trung Nam');
    browser.sleep(browser.params.timeStep);
    email.clear();
    email.sendKeys('trung.trannam@dwork.vn');
    browser.sleep(browser.params.timeStep);
    address.clear();
    address.sendKeys('232 võ thị sáu');
    browser.sleep(browser.params.timeStep);
    sex.$('[value="false"]').click();
    browser.sleep(browser.params.timeStep);
    editBtn.click();
    browser.sleep(5000);
    expect(element(by.css('.alert-message')).getText()).toBe("Thông tin của bạn đã cập nhật thành công");
  });
}

function faq() {
  let first = element.all(by.css('.panel-heading'));
  it("should success open first collapse  ", function () {
    browser.sleep(browser.params.timeStep);
    first.first().click();
    browser.sleep(browser.params.timeStep);
  });
}

function store() {
  let searchInput = element(by.css('.input-search'));
  let store = element.all(by.css('.box-info-store')).first();
  it("should success search and chose first store ", function () {
    browser.sleep(browser.params.timeStep);
    searchInput.sendKeys('CH 97 Nguyễn Chí Thanh');
    browser.sleep(browser.params.timeStep);
    store.click();
    browser.sleep(browser.params.timeStep);
  });

}
