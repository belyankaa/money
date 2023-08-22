import {CustomHttp} from "../services/custom-http.js";
import config from "../config/config.js";

export class CreatComes {

    constructor(page) {
        this.page = page;
        this.titleElement = document.getElementById('name-creat');
        this.accButton = document.getElementById('acc');
        this.rejButton = document.getElementById('rej');

        this.buttons();


        let that = this;
        this.accButton.setAttribute('disabled', 'disabled');
        this.titleElement.addEventListener('change',function(event) {
            if (that.titleElement.value) {
                that.accButton.removeAttribute('disabled');
            } else {
                that.accButton.setAttribute('disabled', 'disabled');
            }
        });
    }

    buttons() {
        this.rejButton.onclick = () => {
            location.href = '/#/' + this.page;
        }

        this.accButton.onclick = () => {
            try {
                if (this.titleElement.value) {
                    try {
                        CustomHttp.request(config.host + '/categories/' + this.page, 'POST', {
                            title: this.titleElement.value
                        })
                    } catch (e) {
                        location.href = '/#/' + this.page;
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
}