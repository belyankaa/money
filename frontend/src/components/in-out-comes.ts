import {Sidebar} from "../functional/sidebar";
import {Period} from "../functional/period";
import {CustomHttp} from "../services/custom-http";
import config from "../config/config";
import {OperationType} from "../types/operation.type";

export class InOutComes {

    readonly page: string | null;
    private operId: string | null;
    readonly sureElement: HTMLElement | null;
    readonly sureBgElement: HTMLElement | null;
    readonly sureYes: HTMLElement | null;
    readonly sureNo: HTMLElement | null;
    readonly creatIncomeButton: HTMLElement | null;
    readonly creatOutcomeButton: HTMLElement | null;
    private period: string | null;
    readonly tabletBodyElement: HTMLElement | null;
    private tabletItemElement: HTMLElement | null;
    private tabletCountElement: HTMLTableCellElement | null;
    private tabletTypeElement: HTMLElement | null;
    private tableCategoryElement: HTMLElement | null;
    private tableAmountElement: HTMLElement | null;
    private tableDataElement: HTMLElement | null;
    private tableCommentElement: HTMLElement | null;
    private tableActionsElement: HTMLElement | null;
    private tableActionsRedElement: HTMLElement | null;
    private tableActionsDelElement: HTMLElement | null;
    readonly buttonsPeriod: HTMLCollectionOf<Element> | null;
    readonly delButtons: HTMLCollectionOf<Element> | null;
    readonly redButtons: HTMLCollectionOf<Element> | null;

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

    private async processOperations(): Promise<void> {
        const result: OperationType[] = await CustomHttp.request(config.host + '/operations?period=' + this.period);

        if (result.length > 0) {
            result.forEach((item: OperationType, index: number): void => {
                //Строка таблицы---------
                this.tabletItemElement = document.createElement('tr');
                this.tabletItemElement.classList.add('tablet__item');
                this.tabletItemElement.setAttribute('data-id', item.id.toString());

                //Порядковый номер---------
                this.tabletCountElement = document.createElement('th');
                if (this.tabletCountElement) {
                    this.tabletCountElement.innerText = (index + 1).toString();
                }

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
                this.tableAmountElement.innerText = item.amount.toString();

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

                if (this.tabletBodyElement) {
                    this.tabletBodyElement.appendChild(this.tabletItemElement);
                }
            })
            this.redDelButtons()
        } else {
            this.tabletItemElement = document.createElement('div');
            this.tabletItemElement.classList.add('empty')
            this.tabletItemElement.innerText = 'Нет операций';

            if (this.tabletBodyElement) {
                this.tabletBodyElement.appendChild(this.tabletItemElement);
            }
        }
    }

    private buttons(): void {
        if (!this.creatIncomeButton || !this.creatOutcomeButton) {
            return;
        }
        this.creatIncomeButton.onclick = () => {
            location.href = '/#/creat-in-out-comes?type=income';
        }

        this.creatOutcomeButton.onclick = () => {
            location.href = '/#/creat-in-out-comes?type=expense';
        }

        let hasClass: boolean = false;
        if (this.period) {
            let checkHref = this.period.split('&date')[0];
            if (checkHref) {
                this.period = checkHref;
            }
        }
        if (!this.buttonsPeriod) {
            return;
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

    private redDelButtons(): void {
        if (!this.delButtons || !this.redButtons) {
            return;
        }
        for (let i = 0; i < this.delButtons.length; i++) {
            (this.delButtons[i] as HTMLElement).onclick = (): void => {
                if (!this.sureElement || !this.sureBgElement) {
                    return;
                }
                this.sureElement.classList.add('are__you__in-out');
                this.sureBgElement.classList.add('are__you__in-out');
                this.operId = this.delButtons![i].parentElement!.parentElement!.getAttribute('data-id');
            }
        }

        for (let i = 0; i < this.redButtons.length; i++) {
            (this.redButtons[i] as HTMLElement).onclick = () => {
                this.operId = this.redButtons![i].parentElement!.parentElement!.getAttribute('data-id');
                location.href = '/#/redact-in-out-comes?id=' + this.operId;
            }
        }
    }

    private popUp(): void {
        if (!this.sureNo || !this.sureYes) {
            return;
        }
        this.sureNo.onclick = () => {
            if (!this.sureElement || !this.sureBgElement) {
                return;
            }
            this.sureElement.classList.remove('are__you__in-out')
            this.sureBgElement.classList.remove('are__you__in-out')
            this.operId = null;
        }

        this.sureYes.onclick = () => {
            CustomHttp.request(config.host + '/operations/' + this.operId, 'DELETE');

            if (this.page) {
                location.href = this.page;
            }

            if (!this.sureElement || !this.sureBgElement) {
                return;
            }

            this.sureElement.classList.remove('are__you__in-out')
            this.sureBgElement.classList.remove('are__you__in-out')
            this.operId = null;
        }
    }
}