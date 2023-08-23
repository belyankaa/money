import {Sidebar} from "../functional/sidebar";
import {CustomHttp} from "../services/custom-http";
import config from "../config/config";
import {CreatOperationType} from "../types/creat-operation.type";
import {ComeResultType} from "../types/come-result.type";

export class CreatInOutComes {

    readonly param: string | null;
    private type: string | null;
    readonly saveButton: HTMLElement | null;
    readonly rejButton: HTMLElement | null;
    private responseCat: ComeResultType[] | null;
    readonly selectTypeElement: HTMLInputElement | null;
    readonly selectCategoryElement: HTMLInputElement | null;
    readonly selectAmountElement: HTMLInputElement | null;
    readonly selectDateElement: HTMLInputElement | null;
    readonly selectCommentElement: HTMLInputElement | null;
    private optionElement: HTMLElement | null;
    readonly inputsElement: HTMLCollectionOf<Element>;
    readonly operId: string;
    private operInfo: CreatOperationType | null;
    id: string | null;
    readonly valid: boolean;

    constructor(param: string | null) {
        this.param = param;
        this.type = location.href.split('type=')[1];
        this.saveButton = document.getElementById('acc');
        this.rejButton = document.getElementById('rej');
        this.responseCat = null;
        // @ts-ignore
        this.selectTypeElement = document.getElementById('type');
        // @ts-ignore
        this.selectCategoryElement = document.getElementById('category');
        // @ts-ignore
        this.selectAmountElement = document.getElementById('amount');
        // @ts-ignore
        this.selectDateElement = document.getElementById('data');
        // @ts-ignore
        this.selectCommentElement = document.getElementById('comment');
        // @ts-ignore
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
        this.selectAmountElement.value = this.operInfo.amount.toString()
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
            this.responseCat.forEach((item: ComeResultType): void => {
                this.optionElement = document.createElement('option');
                if (!this.optionElement) {
                    return;
                }
                this.optionElement.classList.add('categ');
                this.optionElement.setAttribute('data-id', item.id.toString());
                (this.optionElement as HTMLInputElement).value = item.title;
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
        // @ts-ignore
        this.optionElement = document.getElementsByClassName('categ');
        if (this.optionElement) {
            // @ts-ignore
            while (this.optionElement[0]) {
                // @ts-ignore
                this.optionElement[0].parentNode.removeChild(this.optionElement[0]);
            }
        }
    }

    private buttons(): void {
        if (!this.rejButton || !this.saveButton) {
            return;
        }

        this.rejButton.onclick = (): void => {
            location.href = '/#/in-out-comes';
        }
        this.saveButton.onclick = (): void => {
            this.optionElement = document.getElementById('category');
            if (!this.optionElement) {
                return;
            }
           (this.optionElement as HTMLOptionElement).childNodes.forEach((item: ChildNode): void => {
                if ((item as HTMLInputElement).value === (this.optionElement! as HTMLInputElement).value) {
                    this.id = (item as HTMLInputElement).getAttribute('data-id');
                }
            })
            if (this.param) {
                this.updateOperation(this.selectTypeElement!.value, +this.selectAmountElement!.value, +this.selectDateElement!.value, this.selectCommentElement!.value, +this.id!);
            } else {
                this.createOperation(this.selectTypeElement!.value, +this.selectAmountElement!.value, +this.selectDateElement!.value, this.selectCommentElement!.value, +this.id!);
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
            if (!(this.inputsElement[i] as HTMLInputElement).value) {
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
        for (let i: number = 0; i < this.inputsElement.length; i++) {
            (this.inputsElement[i] as HTMLInputElement).onchange = (): void => {
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