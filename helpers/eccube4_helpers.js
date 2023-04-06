const formHelpers = require("./form_helpers");
const assertHelpers = require("./assert_helpers");

module.exports.adminLogin = (configLabel) => {
    let config = Cypress.config(configLabel);
    let options = {};
    // check and config basic auth
    if (config.basicAuthPassword !== undefined) {
        options.auth = {
            username: config.basicAuthUsername,
            password: config.basicAuthPassword,
        };
    }

    // open login page
    cy.visit(config.baseUrl + config.loginUri, options);

    formHelpers.fillTextField("input#login_id", "Username", config.admin.username);
    formHelpers.fillTextField("input#password", "Password", config.admin.password);
    formHelpers.clickButton("button[type='submit']", "login");
    assertHelpers.textVisible("ホーム", "Should be redirected to dashboard");
};

module.exports.adminFillProductForm = (data) => {
    // choose product sale type 商品種別
    formHelpers.selectField("#admin_product_class_sale_type", "商品種別", data.sale_type);

    // product name 商品名
    formHelpers.fillTextField("#admin_product_name", "商品コード", data.name);

    // product code 商品コード
    formHelpers.fillTextField("#admin_product_class_code", "商品コード", data.product_code);

    // product image 商品画像
    formHelpers.attachFileField("#admin_product_product_image", "商品画像", data.product_images);

    // product description detail 商品説明
    formHelpers.fillTextareaField("#admin_product_description_detail", "商品説明", data.description_detail);

    // price 販売価格
    formHelpers.fillTextField("#admin_product_class_price02", "販売価格", data.price02);
    // price 通常価格
    formHelpers.fillTextField("#admin_product_class_price01", "通常価格", data.price01);

    // categories カテゴリ
    formHelpers.checkboxField("input[name='admin_product[Category][]']", "カテゴリ", data.categories);

    // status
    formHelpers.selectField("#admin_product_Status", "STATUS", data.status);
};
