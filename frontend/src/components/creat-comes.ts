import {CustomHttp} from "../services/custom-http";
import config from "../config/config";

export class CreatComes {

    readonly page: string | null;
    readonly titleElement: HTMLElement | null;
    readonly accButton: HTMLElement | null;
    readonly rejButton: HTMLElement | null;

    constructor(page: string | null) {
        this.page = page;
        this.titleElement = document.getElementById('name-creat');
        this.accButton = document.getElementById('acc');
        this.rejButton = document.getElementById('rej');

        this.buttons();


        let that: CreatComes = this;
        if (!this.accButton || !this.titleElement) {
            return;
        }
        this.accButton.setAttribute('disabled', 'disabled');
        this.titleElement.addEventListener('change',function(): void {
            if (that.titleElement!.value) {
                that.accButton!.removeAttribute('disabled');
            } else {
                that.accButton!.setAttribute('disabled', 'disabled');
            }
        });
    }

    private buttons(): void {
        if (!this.rejButton || !this.accButton) {
            return;
        }
        this.rejButton.onclick = () => {
            location.href = '/#/' + this.page;
        }

        this.accButton.onclick = () => {
            try {
                if (this.titleElement && this.titleElement.value) {
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