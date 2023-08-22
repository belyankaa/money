import {Sidebar} from "../functional/sidebar.js";
import {Period} from "../functional/period.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../config/config.js";

export class InOutComes {

    constructor() {
        this.page = location.href
        this.operId = null;

        this.sureElement = document.getElementById('sure');
        this.sureBgElement = document.getElementById('sure-bg');

        this.sureYes = document.getElementById('yes-shur');
        this.sureNo = document.getElementById('no-shur');

        this.creatIncomeButton = document.getElementById('creatIn');
        this.creatOutcomeButton = document.getElementById('creatOut');
        this.period = location.href.split('period=')[1];
        this.tabletBodyElement = document.getElementById('body');
        this.tabletItemElement = null;
        this.tabletCountElement = null;
        this.tabletTypeElement = null;
        this.tableCategoryElement = null;
        this.tableAmountElement = null;
        this.tableDataElement = null;
        this.tableCommentElement = null;
        this.tableActionsElement = null;
        this.tableActionsRedElement = null;
        this.tableActionsDelElement = null;

        this.buttonsPeriod = document.getElementsByClassName('gray-btn');

        this.delButtons = document.getElementsByClassName('delete');
        this.redButtons = document.getElementsByClassName('redact');


        new Sidebar();
        this.processOperations();
        this.buttons();
        this.popUp();
        new Period('in-out-comes');
    }

    async processOperations() {
        const result = await CustomHttp.request(config.host + '/operations?period=' + this.period);

        if (result.length > 0) {
            let type = null;
            result.forEach((item, index) => {
                //Строка таблицы---------
                this.tabletItemElement = document.createElement('tr');
                this.tabletItemElement.classList.add('tablet__item');
                this.tabletItemElement.setAttribute('data-id', item.id);

                //Порядковый номер---------
                this.tabletCountElement = document.createElement('th');
                this.tabletCountElement.innerText = index + 1;

                //Тип операции---------
                this.tabletTypeElement = document.createElement('td');
                if (item.type === 'expense') {
                    this.tabletTypeElement.innerText = 'Расход';
                    this.tabletTypeElement.classList.add('out');
                } else {
                    this.tabletTypeElement.innerText = 'Доход';
                    this.tabletTypeElement.classList.add('in');
                }

                //Категория---------
                this.tableCategoryElement = document.createElement('td');
                this.tableCategoryElement.innerText = item.category;

                //Сумма---------
                this.tableAmountElement = document.createElement('td');
                this.tableAmountElement.innerText = item.amount;

                //Дата---------
                const date = item.date.split('-')[0] + '.' + item.date.split('-')[1] + '.' + item.date.split('-')[2];
                this.tableDataElement = document.createElement('td');
                this.tableDataElement.innerText = date;

                //Комментарий---------
                this.tableCommentElement = document.createElement('td');
                this.tableCommentElement.innerText = item.comment;

                //Действия
                this.tableActionsElement = document.createElement('td');
                this.tableActionsElement.classList.add('operation__actions');

                //Кнопка удалить
                this.tableActionsDelElement = document.createElement('div');
                this.tableActionsDelElement.classList.add('delete');
                this.tableActionsDelElement.innerHTML = '<img src="/images/delete.svg" alt="Удалить">';

                //Кнопка редактировать
                this.tableActionsRedElement = document.createElement('div');
                this.tableActionsRedElement.classList.add('redact');
                this.tableActionsRedElement.innerHTML = '<img src="/images/redact.svg" alt="Редактировать">';


                this.tableActionsElement.appendChild(this.tableActionsDelElement);
                this.tableActionsElement.appendChild(this.tableActionsRedElement);


                this.tabletItemElement.appendChild(this.tabletCountElement);
                this.tabletItemElement.appendChild(this.tabletTypeElement);
                this.tabletItemElement.appendChild(this.tableCategoryElement);
                this.tabletItemElement.appendChild(this.tableAmountElement);
                this.tabletItemElement.appendChild(this.tableDataElement);
                this.tabletItemElement.appendChild(this.tableCommentElement);
                this.tabletItemElement.appendChild(this.tableActionsElement);


                this.tabletBodyElement.appendChild(this.tabletItemElement);
            })
            this.redDelButtons()
        } else {
            this.tabletItemElement = document.createElement('div');
            this.tabletItemElement.classList.add('empty')
            this.tabletItemElement.innerText = 'Нет операций';

            this.tabletBodyElement.appendChild(this.tabletItemElement);
        }
    }

    buttons() {
        this.creatIncomeButton.onclick = () => {
            location.href = '/#/creat-in-out-comes?type=income';
        }

        this.creatOutcomeButton.onclick = () => {
            location.href = '/#/creat-in-out-comes?type=expense';
        }

        let hasClass = false;
        if (this.period) {
            let checkHref = this.period.split('&date')[0];
            if (checkHref) {
                this.period = checkHref;
            }
        }
        for (let i = 0; i < this.buttonsPeriod.length; i++) {
            if (this.buttonsPeriod[i].getAttribute('data-period') === this.period) {
                this.buttonsPeriod[i].classList.add('active-gray');
                hasClass = true;
            } else {
                this.buttonsPeriod[i].classList.remove('active-gray');
            }
        }
        if (!hasClass) {
            this.buttonsPeriod[0].classList.add('active-gray');
        }
    }

    redDelButtons() {
        for (let i = 0; i < this.delButtons.length; i++) {
            this.delButtons[i].onclick = () => {
                this.sureElement.classList.add('are__you__in-out');
                this.sureBgElement.classList.add('are__you__in-out');
                this.operId = this.delButtons[i].parentElement.parentElement.getAttribute('data-id');
            }
        }

        for (let i = 0; i < this.redButtons.length; i++) {
            this.redButtons[i].onclick = () => {
                this.operId = this.redButtons[i].parentElement.parentElement.getAttribute('data-id');
                location.href = '/#/redact-in-out-comes?id=' + this.operId;
            }
        }
    }

    popUp() {
        this.sureNo.onclick = () => {
            this.sureElement.classList.remove('are__you__in-out')
            this.sureBgElement.classList.remove('are__you__in-out')
            this.operId = null;
        }
        this.sureYes.onclick = () => {
            CustomHttp.request(config.host + '/operations/' + this.operId, 'DELETE');

            location.href = this.page;

            this.sureElement.classList.remove('are__you__in-out')
            this.sureBgElement.classList.remove('are__you__in-out')
            this.operId = null;
        }
    }
}