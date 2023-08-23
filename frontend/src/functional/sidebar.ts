import {Auth} from "../services/auth";
import {CustomHttp} from "../services/custom-http";
import config from "../config/config";
import {OperationType} from "../types/operation.type";

export class Sidebar {

    readonly balanceElement: HTMLElement | null;
    readonly profileElement: HTMLElement | null;
    readonly logOutElement: HTMLElement | null;
    private categoriesElement: HTMLElement | null;
    private categoriesFirstElement: HTMLElement | null;
    private categoriesSecondElement: HTMLElement | null;
    private inOutElement: HTMLElement | null;
    private mainElement: HTMLElement | null;
    private logoElement: HTMLElement | null;

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

    private buttons(): void {
        //Категории--------------------------------------------------------------------
        this.logoElement = document.getElementById('logo');
        this.mainElement = document.getElementById('main-page');
        this.inOutElement = document.getElementById('in-out-page');
        this.categoriesElement = document.getElementById('categories-page');
        this.categoriesFirstElement = document.getElementById('categor-item1');
        this.categoriesSecondElement = document.getElementById('categor-item2');

        this.clearButtons();

        let url = location.href.split('/#/')[1].split('?')[0];
        if (url === 'main' && this.mainElement) {
            this.mainElement.classList.add('main-active');
        } else if (url === 'in-out-comes' && this.inOutElement) {
            this.inOutElement.classList.add('in-out-active');
        } else if (url === 'income' && this.categoriesElement && this.categoriesFirstElement) {
            this.categoriesElement.classList.add('open-categories');
            this.categoriesElement.parentElement!.nextElementSibling!.classList.add('categories-open');
            this.categoriesFirstElement.classList.add('active-categorie-item1');
        } else if (url === 'expense' && this.categoriesElement && this.categoriesSecondElement) {
            this.categoriesElement.classList.add('open-categories');
            this.categoriesElement.parentElement!.nextElementSibling!.classList.add('categories-open');
            this.categoriesSecondElement.classList.add('active-categorie-item2');
        }


        (this.categoriesElement as HTMLElement).onclick = () => {
            if (this.categoriesElement) {
                this.categoriesElement.classList.add('open-categories');
                this.categoriesElement.parentElement?.nextElementSibling?.classList.add('categories-open');
            }
        }

        //1
        (this.categoriesFirstElement as HTMLElement).onclick = () => {
            window.location.href = '/#/income';
        }

        //2
        (this.categoriesSecondElement as HTMLElement).onclick = () => {
            window.location.href = '/#/expense';
        }

        //Доходы & расходы---------------------------------------------------------------
        (this.inOutElement as HTMLElement).onclick = (): void => {
            window.location.href = '/#/in-out-comes';
        }

        //Главная-------------------------------------------------------------------------
        (this.mainElement as HTMLElement).onclick = (): void => {
            window.location.href = '/#/main';
        }

        //Логотип-------------------------------------------------------------------------
        (this.logoElement as HTMLElement).onclick = (): void => {
            this.clearButtons();
            if (this.mainElement) {
                this.mainElement.classList.add('main-active');
            }
        }
    }

    private clearButtons(): void {
        if (!this.categoriesElement || !this.categoriesFirstElement || !this.categoriesSecondElement || !this.inOutElement
        || !this.mainElement) {
            return
        }
        this.categoriesElement.classList.remove('open-categories');
        this.categoriesElement.parentElement!.nextElementSibling!.classList.remove('categories-open');
        this.categoriesFirstElement.classList.remove('active-categorie-item1');
        this.categoriesSecondElement.classList.remove('active-categorie-item2');
        this.inOutElement.classList.remove('in-out-active');
        this.mainElement.classList.remove('main-active');
    }

    private async showBalance(): Promise<void> {
        await this.updateBalance();
        const result = await CustomHttp.request(config.host + '/balance', 'GET');
        if (result.balance && this.balanceElement) {
            this.balanceElement.innerText = result.balance + '$';
        }
    }

    private async updateBalance() {
        let plus = 0;
        let minus = 0;
        const result: OperationType[] = await CustomHttp.request(config.host + '/operations?period=all');
        if (result) {
            result.forEach((item: OperationType): void => {
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

    private logOut(): void {
        if (!this.logOutElement) {
            return;
        }
        this.logOutElement.onclick = () => {
            Auth.logOut();
            location.href = '/#/'
        }
    }
}