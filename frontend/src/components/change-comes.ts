import {CustomHttp} from "../services/custom-http";
import config from "../config/config";

export class ChangeComes {

    readonly page: string | null;
    readonly titleElement: HTMLElement | null;
    readonly saveButton: HTMLElement | null;
    readonly rejButton: HTMLElement | null;
    readonly cardId: string | null;
    readonly inputElement: HTMLElement | null;

    constructor(page: string | null) {
        this.page = page;
        this.titleElement = document.getElementById('name-creat');
        this.saveButton = document.getElementById('save');
        this.rejButton = document.getElementById('rej');
        this.cardId = location.href.split('id=')[1];
        this.inputElement = document.getElementById('name-creat');


        this.buttons();
        this.getTitle();
    }

    private buttons(): void {
        if (!this.rejButton || !this.saveButton) {
            return;
        }
        this.rejButton.onclick = () => {
            location.href = '/#/' + this.page;
        }

        this.saveButton.onclick = () => {
            try {
                if (this.titleElement && this.titleElement.value) {
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

    private async getTitle(): Promise<void> {
        if (!this.inputElement) {
            return;
        }
        const result = await CustomHttp.request(config.host + '/categories/' + this.page + '/' + this.cardId)
        this.inputElement.value = result.title
    }
}