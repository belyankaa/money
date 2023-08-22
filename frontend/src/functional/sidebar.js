import {Auth} from "../services/auth.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../config/config.js";

export class Sidebar {

    constructor() {
        this.balanceElement = document.getElementById('balance');
        this.profileElement = document.getElementById('profile');
        this.logOutElement = document.getElementById('logOut');
        this.categoriesElement = null;
        this.categoriesFirstElement = null;
        this.categoriesSecondElement = null;
        this.inOutElement = null;
        this.mainElement = null;
        this.logoElement = null;

        this.buttons();
        this.updateBalance();
        this.showBalance();
        this.logOut();
    }

    buttons() {
        //Категории--------------------------------------------------------------------
        this.logoElement = document.getElementById('logo');
        this.mainElement = document.getElementById('main-page');
        this.inOutElement = document.getElementById('in-out-page');
        this.categoriesElement = document.getElementById('categories-page');
        this.categoriesFirstElement = document.getElementById('categor-item1');
        this.categoriesSecondElement = document.getElementById('categor-item2');

        this.clearButtons();

        let url = location.href.split('/#/')[1].split('?')[0];
        if (url === 'main') {
            this.mainElement.classList.add('main-active');
        } else if (url === 'in-out-comes') {
            this.inOutElement.classList.add('in-out-active');
        } else if (url === 'income') {
            this.categoriesElement.classList.add('open-categories');
            this.categoriesElement.parentElement.nextElementSibling.classList.add('categories-open');
            this.categoriesFirstElement.classList.add('active-categorie-item1');
        } else if (url === 'expense') {
            this.categoriesElement.classList.add('open-categories');
            this.categoriesElement.parentElement.nextElementSibling.classList.add('categories-open');
            this.categoriesSecondElement.classList.add('active-categorie-item2');
        }

        this.categoriesElement.onclick = () => {
            this.categoriesElement.classList.add('open-categories');
            this.categoriesElement.parentElement.nextElementSibling.classList.add('categories-open');
        }

        //1
        this.categoriesFirstElement.onclick = () => {
            window.location.href = '/#/income';
        }

        //2
        this.categoriesSecondElement.onclick = () => {
            window.location.href = '/#/expense';
        }

        //Доходы & расходы---------------------------------------------------------------
        this.inOutElement.onclick = () => {
            window.location.href = '/#/in-out-comes';
        }

        //Главная-------------------------------------------------------------------------
        this.mainElement.onclick = () => {
            window.location.href = '/#/main';
        }

        //Логотип-------------------------------------------------------------------------
        this.logoElement.onclick = () => {
            this.clearButtons();
            this.mainElement.classList.add('main-active');
        }
    }

    clearButtons() {
        this.categoriesElement.classList.remove('open-categories');
        this.categoriesElement.parentElement.nextElementSibling.classList.remove('categories-open');
        this.categoriesFirstElement.classList.remove('active-categorie-item1');
        this.categoriesSecondElement.classList.remove('active-categorie-item2');
        this.inOutElement.classList.remove('in-out-active');
        this.mainElement.classList.remove('main-active');
    }

    async showBalance() {
        await this.updateBalance();
        const result = await CustomHttp.request(config.host + '/balance', 'GET');
        if (result.balance) {
            this.balanceElement.innerText = result.balance + '$';
        }
    }

    async updateBalance() {
        let plus = 0;
        let minus = 0;
        const result = await CustomHttp.request(config.host + '/operations?period=all');
        if (result) {
            result.forEach(item => {
                if (item.type === 'expense') {
                    minus += item.amount;
                } else {
                    plus += item.amount
                }
            })
            await CustomHttp.request(config.host + '/balance', 'put', {
                "newBalance": plus - minus
            });
        }
    }

    logOut() {
        this.logOutElement.onclick = () => {
            Auth.logOut();
            location.href = '/#/'
        }
    }
}