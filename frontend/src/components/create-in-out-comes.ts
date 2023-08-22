import {Sidebar} from "../functional/sidebar";
import {CustomHttp} from "../services/custom-http";
import config from "../config/config";

export class CreatInOutComes {

    readonly param: string | null;
    private type: string | null;
    readonly saveButton: HTMLElement | null;
    readonly rejButton: HTMLElement | null;
    private responseCat;
    readonly selectTypeElement: HTMLElement | null;
    readonly selectCategoryElement: HTMLElement | null;
    readonly selectAmountElement: HTMLElement | null;
    readonly selectDateElement: HTMLElement | null;
    readonly selectCommentElement: HTMLElement | null;
    private optionElement: HTMLElement | null;
    readonly inputsElement: HTMLCollectionOf<Element> | null;
    readonly operId: string;
    private operInfo: HTMLElement | null;
    id: HTMLElement | null;
    readonly valid: boolean;

    constructor(param: string | null) {
        this.param = param;
        this.type = location.href.split('type=')[1];
        this.saveButton = document.getElementById('acc');
        this.rejButton = document.getElementById('rej');
        this.responseCat = null;
        this.selectTypeElement = document.getElementById('type');
        this.selectCategoryElement = document.getElementById('category');
        this.selectAmountElement = document.getElementById('amount');
        this.selectDateElement = document.getElementById('data');
        this.selectCommentElement = document.getElementById('comment');
        this.optionElement = document.getElementById('category');
        this.inputsElement = document.getElementsByClassName('input-create');
        this.operId = location.href.split('id=')[1];
        this.operInfo = null;
        this.id = null;
        this.valid = true;


        new Sidebar();
        this.buttons();
        this.process();
        this.takeCategory();
        this.takeCategoryOnchange();
        this.validForm();
        if (param && this.operId) {
            this.fill(parseInt(this.operId));
        }
    }

    private process(): void {
        if (this.type && this.selectTypeElement) {
            if (this.type === 'expense') {
                this.selectTypeElement.value = 'expense';
            } else {
                this.selectTypeElement.value = 'income';
            }
        }
    }

    private async fill(id: number): Promise<void> {
        if (this.saveButton) {
            this.saveButton.innerText = 'Сохранить';
        }
        this.operInfo = await CustomHttp.request(config.host + '/operations/' + id);
        if (!this.operInfo || !this.selectTypeElement || !this.selectCategoryElement
            || !this.selectAmountElement || !this.selectDateElement || !this.selectCommentElement) {
            return;
        }
        this.type = this.operInfo.type;
        await this.takeCategory();
        this.selectTypeElement.value = this.type
        this.selectCategoryElement.value = this.operInfo.category
        this.selectAmountElement.value = this.operInfo.amount
        let date = this.operInfo.date.split('-')
        this.selectDateElement.value = date[0] + '-' + date[1] + '-' + date[2]
        this.selectCommentElement.value = this.operInfo.comment
    }

    private async takeCategoryOnchange(): Promise<void> {
        if (!this.selectTypeElement) {
            return;
        }
        this.selectTypeElement.onchange = async () => {
            this.type = this.selectTypeElement!.value;
            if (this.type) {
                this.responseCat = await CustomHttp.request(config.host + '/categories/' + this.type);
                this.processCategory();
            } else {
                this.clearOptions();
            }
        }
    }

    private async takeCategory(): Promise<void> {
        if (this.type) {
            this.responseCat = await CustomHttp.request(config.host + '/categories/' + this.type);
            this.processCategory();
        } else {
            this.clearOptions();
        }
    }

    private async processCategory(): Promise<void> {
        this.clearOptions();
        if (this.type && this.responseCat) {
            this.responseCat.forEach(item => {
                this.optionElement = document.createElement('option');
                this.optionElement.classList.add('categ');
                this.optionElement.setAttribute('data-id', item.id);
                this.optionElement.value = item.title;
                this.optionElement.innerText = item.title;
                if (this.selectCategoryElement) {
                    this.selectCategoryElement.appendChild(this.optionElement)
                }
            })
        } else {
            this.clearOptions();
        }
    }

    private clearOptions(): void {
        this.optionElement = document.getElementsByClassName('categ');
        if (this.optionElement) {
            while (this.optionElement[0]) {
                this.optionElement[0]!.parentNode!.removeChild(this.optionElement[0]);
            }
        }
    }

    private buttons(): void {
        if (!this.rejButton || !this.saveButton) {
            return;
        }

        this.rejButton.onclick = () => {
            location.href = '/#/in-out-comes';
        }
        this.saveButton.onclick = () => {
            this.optionElement = document.getElementById('category');
            if (!this.optionElement) {
                return;
            }
            this.optionElement.childNodes.forEach(item => {
                if (item.value === this.optionElement!.value) {
                    this.id = item.getAttribute('data-id');
                }
            })
            if (this.param) {
                this.updateOperation(this.selectTypeElement!.value, +this.selectAmountElement!.value, this.selectDateElement!.value, this.selectCommentElement!.value, +this.id!);
            } else {
                this.createOperation(this.selectTypeElement!.value, +this.selectAmountElement!.value, this.selectDateElement!.value, this.selectCommentElement!.value, +this.id!);
            }
            location.href = '/#/in-out-comes';
        }
    }

    private checkInputs(): void {
        let hasEmpty = false;
        if (!this.inputsElement) {
            return;
        }
        for (let i = 0; i < this.inputsElement.length; i++) {
            if (!this.inputsElement[i].value) {
                hasEmpty = true;
            }
        }

        if (!hasEmpty && this.saveButton) {
            this.saveButton.removeAttribute('disabled');
        }
    }

    private validForm(): void {
        if (!this.saveButton || !this.inputsElement) {
            return;
        }
        this.saveButton.setAttribute('disabled', 'disabled');
        for (let i = 0; i < this.inputsElement.length; i++) {
            this.inputsElement[i].onchange = () => {
                this.checkInputs();
            }
        }
    }

    private createOperation(type: string, amount: number, date: number, comment: string = '', categoryId: number): void {
        CustomHttp.request(config.host + '/operations', 'POST', {
            type: type,
            amount: amount,
            date: date,
            comment: comment,
            category_id: categoryId
        })
    }

    private updateOperation(type: string, amount: number, date: number, comment: string = '', categoryId: number): void {
        CustomHttp.request(config.host + '/operations/' + this.operId, 'PUT', {
            type: type,
            amount: amount,
            date: date,
            comment: comment,
            category_id: categoryId
        })
    }
}