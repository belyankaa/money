import {CustomHttp} from "../services/custom-http.js";
import config from "../config/config.js";

export class ChangeComes {

    constructor(page) {
        this.page = page;
        this.titleElement = document.getElementById('name-creat');
        this.saveButton = document.getElementById('save');
        this.rejButton = document.getElementById('rej');
        this.cardId = location.href.split('id=')[1];
        this.inputElement = document.getElementById('name-creat');


        this.buttons();
        this.getTitle();
    }

    buttons() {
        this.rejButton.onclick = () => {
            location.href = '/#/' + this.page;
        }

        this.saveButton.onclick = () => {
            try {
                if (this.titleElement.value) {
                    try {
                        CustomHttp.request(config.host + '/categories/' + this.page + '/' + this.cardId, 'PUT', {
                            title: this.titleElement.value
                        })
                    } catch (e) {
                        console.log(e.message)
                    }
                } else {
                    throw new Error('Пустое поле')
                }
            } catch (e) {
                location.href = '/#/' + this.page;
            }
            location.href = '/#/' + this.page;
        }
    }

    async getTitle() {
        const result = await CustomHttp.request(config.host + '/categories/' + this.page + '/' + this.cardId)
        this.inputElement.value = result.title
    }
}