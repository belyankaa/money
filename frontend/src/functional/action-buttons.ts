import {CustomHttp} from "../services/custom-http";
import config from "../config/config";
import {OperationType} from "../types/operation.type";

export class ActionButtons {
    readonly page: string | null;
    readonly sureElement: HTMLElement | null;
    readonly sureBgElement: HTMLElement | null;
    readonly sureYes: HTMLElement | null;
    readonly sureNo: HTMLElement | null;
    readonly cardAddElement: HTMLElement | null;

    constructor(page: string | null) {
        this.page = page;
        this.sureElement = document.getElementById('sure');
        this.sureBgElement = document.getElementById('sure-bg');
        this.sureYes = document.getElementById('yes-shur');
        this.sureNo = document.getElementById('no-shur');
        this.cardAddElement = document.getElementById('card-add');

        this.buttons();
        this.creatCard();
    }

    private async buttons(): Promise<void> {
        const btn: HTMLCollection | null = document.getElementsByClassName('change')
        let cardId: string | null | undefined = null;
        let categoryName: string | null = null

        const result: OperationType[] = await CustomHttp.request(config.host + '/operations?period=all', 'GET');

        if (!btn || !this.sureNo || !this.sureYes) {
            return;
        }

        for (let i: number = 0; i < btn.length; i++) {
            (btn[i] as HTMLElement).onclick = () => {
                if (btn[i].classList.contains('btn-red')) {
                    cardId = btn[i].parentElement!.parentElement!.getAttribute('data-id');
                    location.href = '/#/red-' + this.page + "?id=" + cardId;
                } else {
                    if (!this.sureElement || !this.sureBgElement) {
                        return
                    }
                    this.sureElement.classList.add('are__you__in');
                    this.sureBgElement.classList.add('are__you__in');
                    cardId = btn[i].parentElement!.parentElement!.getAttribute('data-id');
                    categoryName = (btn[i].previousElementSibling!.previousElementSibling! as HTMLInputElement).innerText;
                }
            }
        }

        this.sureNo.onclick = () => {
            if (!this.sureElement || !this.sureBgElement) {
                return
            }
            this.sureElement.classList.remove('are__you__in')
            this.sureBgElement.classList.remove('are__you__in')
            cardId = null;
        }


        this.sureYes.onclick = (): void => {
            CustomHttp.request(config.host + '/categories/' + this.page + '/' + cardId, 'DELETE');
            result.forEach((item) => {
                if (item.category === categoryName) {
                    CustomHttp.request(config.host + '/operations/' + item.id, 'DELETE');
                }
            })

            location.href = '/#/' + this.page;
            if (!this.sureElement || !this.sureBgElement) {
                return
            }

            this.sureElement.classList.remove('are__you__in')
            this.sureBgElement.classList.remove('are__you__in')
            cardId = null;
        }
    }

    private creatCard(): void {
        if (!this.cardAddElement) {
            return;
        }
        this.cardAddElement.onclick = () => {
            location.href = '/#/create-' + this.page;
        }
    }
}