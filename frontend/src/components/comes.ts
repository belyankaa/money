import {Sidebar} from "../functional/sidebar.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../config/config.js";
import {ActionButtons} from "../functional/action-buttons.js";

export class Comes {

    constructor(page) {
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

    async init() {
        if (this.page === 'income') {
            await this.inComes();

        } else {
            await this.outComes();
        }
        this.processComes();
        new ActionButtons(this.page);
    }

    async inComes() {
        try {
            this.response = await CustomHttp.request(config.host + '/categories/' + this.page);
        } catch (e) {
            console.log(e.message)
        }

    }

    async outComes() {
        try {
            this.response = await CustomHttp.request(config.host + '/categories/' + this.page);
        } catch (e) {
            console.log(e.message)
        }
    }

    processComes() {
        this.response.forEach(item => {
            this.cardElement = document.createElement('div');
            this.cardElement.setAttribute('data-id', item.id);
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

            this.cardsBlockElement.appendChild(this.cardElement);
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
        this.cardsBlockElement.appendChild(this.cardsAddElement);
    }

    processButtons() {
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