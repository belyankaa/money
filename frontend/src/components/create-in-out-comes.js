import {Sidebar} from "../functional/sidebar.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../config/config.js";

export class CreatInOutComes {

    constructor(param) {
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
        if (param) {
            this.fill(this.operId);
        }
    }

    process() {
        if (this.type) {
            if (this.type === 'expense') {
                this.selectTypeElement.value = 'expense';
            } else {
                this.selectTypeElement.value = 'income';
            }
        }
    }

    async fill(id) {
        this.saveButton.innerText = 'Сохранить'
        this.operInfo = await CustomHttp.request(config.host + '/operations/' + id);
        this.type = this.operInfo.type;
        await this.takeCategory();
        this.selectTypeElement.value = this.type
        this.selectCategoryElement.value = this.operInfo.category
        this.selectAmountElement.value = this.operInfo.amount
        let date = this.operInfo.date.split('-')
        this.selectDateElement.value = date[0] + '-' + date[1] + '-' + date[2]
        this.selectCommentElement.value = this.operInfo.comment
    }

    async takeCategoryOnchange() {
        this.selectTypeElement.onchange = async () => {
            this.type = this.selectTypeElement.value;
            if (this.type) {
                this.responseCat = await CustomHttp.request(config.host + '/categories/' + this.type);
                this.processCategory();
            } else {
                this.clearOptions();
            }
        }
    }

    async takeCategory() {
        if (this.type) {
            this.responseCat = await CustomHttp.request(config.host + '/categories/' + this.type);
            this.processCategory();
        } else {
            this.clearOptions();
        }
    }

    async processCategory() {
        this.clearOptions();
        if (this.type) {
            this.responseCat.forEach(item => {
                this.optionElement = document.createElement('option');
                this.optionElement.classList.add('categ');
                this.optionElement.setAttribute('data-id', item.id);
                this.optionElement.value = item.title;
                this.optionElement.innerText = item.title;

                this.selectCategoryElement.appendChild(this.optionElement)
            })
        } else {
            this.clearOptions();
        }
    }

    clearOptions() {
        this.optionElement = document.getElementsByClassName('categ');
        if (this.optionElement) {
            while (this.optionElement[0]) {
                this.optionElement[0].parentNode.removeChild(this.optionElement[0]);
            }
        }
    }

    buttons() {
        this.rejButton.onclick = () => {
            location.href = '/#/in-out-comes';
        }
        this.saveButton.onclick = () => {
            this.optionElement = document.getElementById('category');
            this.optionElement.childNodes.forEach(item => {
                if (item.value === this.optionElement.value) {
                    this.id = item.getAttribute('data-id');
                }
            })
            if (this.param) {
                this.updateOperation(this.selectTypeElement.value, +this.selectAmountElement.value, this.selectDateElement.value, this.selectCommentElement.value, +this.id);
            } else {
                this.createOperation(this.selectTypeElement.value, +this.selectAmountElement.value, this.selectDateElement.value, this.selectCommentElement.value, +this.id);
            }
            location.href = '/#/in-out-comes';
        }
    }

    checkInputs() {
        let hasEmpty = false;
        for (let i = 0; i < this.inputsElement.length; i++) {
            if (!this.inputsElement[i].value) {
                hasEmpty = true;
            }
        }

        if (!hasEmpty) {
            this.saveButton.removeAttribute('disabled');
        }
    }

    validForm() {
        this.saveButton.setAttribute('disabled', 'disabled');
        for (let i = 0; i < this.inputsElement.length; i++) {
            this.inputsElement[i].onchange = () => {
                this.checkInputs();
            }
        }
    }

    createOperation(type, amount, date, comment = '', categoryId) {
        CustomHttp.request(config.host + '/operations', 'POST', {
            type: type,
            amount: amount,
            date: date,
            comment: comment,
            category_id: categoryId
        })
    }

    updateOperation(type, amount, date, comment = '', categoryId) {
        CustomHttp.request(config.host + '/operations/' + this.operId, 'PUT', {
            type: type,
            amount: amount,
            date: date,
            comment: comment,
            category_id: categoryId
        })
    }
}