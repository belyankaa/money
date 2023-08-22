import {Auth} from "./services/auth";
import {Form} from "./components/form";
import {Main} from "./components/main";
import {Comes} from "./components/comes";
import {CreatComes} from "./components/creat-comes";
import {ChangeComes} from "./components/change-comes";
import {InOutComes} from "./components/in-out-comes";
import {CreatInOutComes} from "./components/create-in-out-comes";
import {RouterType} from "./types/router.type";
import {UserInfoType} from "./types/user-info.type";


export class Router {
    readonly contentElement: HTMLElement | null;
    readonly stylesElement: HTMLElement | null;
    readonly titleElement: HTMLElement | null;
    readonly profileFullNameElement: HTMLElement | null;

    private routs: RouterType[];

    constructor() {
        this.contentElement = document.getElementById('content');
        this.stylesElement = document.getElementById('styles');
        this.titleElement = document.getElementById('mainTitle');
        this.profileFullNameElement = document.getElementById('profile-full-name');

        this.routs = [
            {
                route: '#/',
                title: 'Войти',
                template: 'templates/login.html',
                styles: 'styles/index.css',
                load: () => {
                    new Form('login');
                }
            },
            {
                route: '#/signup',
                title: 'Зарегистрироваться',
                template: 'templates/signup.html',
                styles: 'styles/index.css',
                load: () => {
                    new Form('signup');
                }
            },
            {
                route: '#/main',
                title: 'Главная',
                template: 'templates/main.html',
                styles: 'styles/main.css',
                load: () => {
                    new Main();
                }
            },
            {
                route: '#/in-out-comes',
                title: 'Доходы & Расходы',
                template: 'templates/in-out-comes.html',
                styles: 'styles/in-out-comes.css',
                load: () => {
                    new InOutComes();
                }
            },
            {
                route: '#/creat-in-out-comes',
                title: 'Добавить доход',
                template: 'templates/create-in-out-come.html',
                styles: 'styles/in-out-comes.css',
                load: () => {
                    new CreatInOutComes();
                }
            },
            {
                route: '#/redact-in-out-comes',
                title: 'Редкатировать',
                template: 'templates/create-in-out-come.html',
                styles: 'styles/in-out-comes.css',
                load: () => {
                    new CreatInOutComes('access');
                }
            },
            {
                route: '#/income',//-------------------------------------
                title: 'Доходы',
                template: 'templates/incomes.html',
                styles: 'styles/comes.css',
                load: () => {
                    new Comes('income');
                }
            },
            {
                route: '#/expense',//----------------------------------------------
                title: 'Расходы',
                template: 'templates/expense.html',
                styles: 'styles/comes.css',
                load: () => {
                    new Comes('expense');
                }
            },
            {
                route: '#/create-income',//---------------------------------------
                title: 'Создать доход',
                template: 'templates/create-income.html',
                styles: 'styles/change-incomes.css',
                load: () => {
                    new CreatComes('income');
                }
            },
            {
                route: '#/create-expense',
                title: 'Создать расход',
                template: 'templates/create-expense.html',
                styles: 'styles/change-incomes.css',
                load: () => {
                    new CreatComes('expense');
                }
            },
            {
                route: '#/red-income',
                title: 'Создать расход',
                template: 'templates/red-income.html',
                styles: 'styles/change-incomes.css',
                load: () => {
                    new ChangeComes('income');
                }
            },
            {
                route: '#/red-expense',
                title: 'Создать расход',
                template: 'templates/red-expense.html',
                styles: 'styles/change-incomes.css',
                load: () => {
                    new ChangeComes('expense');
                }
            },
        ]
    }

    public async openRout(): Promise<void> {
        const urlRout: string = window.location.hash.split('?')[0];
        if (urlRout === '#/logout') {
            await Auth.logOut();
            window.location.href = '#/';
            return;
        }

        const newRout: RouterType | undefined = this.routs.find((item: RouterType) => {
            return item.route === urlRout;
        });

        if (!newRout) {
            window.location.href = '#/';
            return;
        }

        if (this.contentElement) {
            this.contentElement.innerHTML =
                await fetch(newRout.template).then((response: Response) => response.text());
        }
        if (this.stylesElement) {
            this.stylesElement.setAttribute('href', newRout.styles);
        }
        if (this.titleElement) {
            this.titleElement.innerText = newRout.title;
        }

        const userInfo: UserInfoType = Auth.getUserInfo();
        const accessToken: string | null = localStorage.getItem(Auth.accessTokenKey)

        if (userInfo && accessToken && this.profileFullNameElement) {
            this.profileFullNameElement.innerText = userInfo.name + ' ' + userInfo.lastName;
        }



        newRout.load();
    }
}