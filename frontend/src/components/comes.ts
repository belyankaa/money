import {Sidebar} from "../functional/sidebar";
import {CustomHttp} from "../services/custom-http";
import config from "../config/config";
import {ActionButtons} from "../functional/action-buttons";
import {ComeResultType} from "../types/come-result.type";

export class Comes {

    readonly page: string;
    private response: ComeResultType[];
    readonly cardsBlockElement: HTMLElement | null;
    private cardElement: HTMLElement | null;
    private cardBodyElement: HTMLElement | null;
    private cardTitleElement: HTMLElement | null;
    private buttonCrElement: HTMLElement | null;
    private buttonDelElement: HTMLElement | null;
    private cardsAddElement: HTMLElement | null;
    private svgAddElement: HTMLElement | null;

    constructor(page: string) {
        this.page = page;
        this.response = [];

        this.cardsBlockElement = document.getElementById('card-block');
        this.cardElement = null;
        this.cardBodyElement = null;
        this.cardTitleElement = null;
        this.buttonCrElement = null;
        this.buttonDelElement = null;
        this.cardsAddElement = null;
        this.svgAddElement = null;


        this.init();
        new Sidebar();
    }

    private async init(): Promise<void> {
        if (this.page === 'income') {
            await this.inComes();

        } else {
            await this.outComes();
        }
        this.processComes();
        new ActionButtons(this.page);
    }

    private async inComes(): Promise<void> {
        try {
            this.response = await CustomHttp.request(config.host + '/categories/' + this.page);
        } catch (e) {

        }

    }

    private async outComes(): Promise<void> {
        try {
            this.response = await CustomHttp.request(config.host + '/categories/' + this.page);
        } catch (e) {

        }
    }

    private processComes(): void {
        this.response.forEach(item => {
            this.cardElement = document.createElement('div');
            this.cardElement.setAttribute('data-id', item.id.toString());
            this.cardBodyElement = document.createElement('div');
            this.cardTitleElement = document.createElement('h5');
            this.buttonCrElement = document.createElement('div');
            this.buttonDelElement = document.createElement('div');
            this.cardElement.classList.add('card');
            this.cardBodyElement.classList.add('card-body');
            this.cardTitleElement.innerText = item.title;
            this.cardTitleElement.classList.add('card-title');

            this.cardBodyElement.appendChild(this.cardTitleElement);
            this.cardElement.appendChild(this.cardBodyElement);

            this.processButtons()

            if (this.cardsBlockElement) {
                this.cardsBlockElement.appendChild(this.cardElement);
            }
        })

        this.cardsAddElement = document.createElement('div');
        this.cardsAddElement.classList.add('card')
        this.cardsAddElement.classList.add('card_add')
        this.cardsAddElement.id = 'card-add';

        this.cardBodyElement = document.createElement('div');
        this.cardBodyElement.classList.add('card-body')


        this.svgAddElement = document.createElement('img');
        this.svgAddElement.setAttribute('src', '/images/plus.svg')

        this.cardBodyElement.appendChild(this.svgAddElement);
        this.cardsAddElement.appendChild(this.cardBodyElement);
        if (this.cardsBlockElement) {
            this.cardsBlockElement.appendChild(this.cardsAddElement);
        }
    }

    private processButtons(): void {
        if (!this.buttonCrElement || !this.cardBodyElement || !this.buttonDelElement) {
            return;
        }
        this.buttonCrElement.innerText = 'Редактировать';
        this.buttonCrElement.classList.add('btn');
        this.buttonCrElement.classList.add('btn-primary');
        this.buttonCrElement.classList.add('btn-red');
        this.buttonCrElement.classList.add('change');
        this.buttonDelElement.innerText = 'Удалить';
        this.buttonDelElement.classList.add('btn');
        this.buttonDelElement.classList.add('btn-danger');
        this.buttonDelElement.classList.add('btn-del');
        this.buttonDelElement.classList.add('change');

        this.cardBodyElement.appendChild(this.buttonCrElement);
        this.cardBodyElement.appendChild(this.buttonDelElement);
    }
}