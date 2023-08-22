import {CustomHttp} from "../services/custom-http.js";
import config from "../config/config.js";

export class ActionButtons {

    constructor(page) {
        this.page = page;
        this.sureElement = document.getElementById('sure');
        this.sureBgElement = document.getElementById('sure-bg');
        this.sureYes = document.getElementById('yes-shur');
        this.sureNo = document.getElementById('no-shur');
        this.cardAddElement = document.getElementById('card-add');

        this.buttons();
        this.creatCard();
    }

    async buttons() {
        const btn = document.getElementsByClassName('change')
        let cardId = null;
        let categoryName = null

        const result = await CustomHttp.request(config.host + '/operations?period=all', 'GET');

        for (let i = 0; i < btn.length; i++) {
            btn[i].onclick = () => {
                if (btn[i].classList.contains('btn-red')) {
                    cardId = btn[i].parentElement.parentElement.getAttribute('data-id');
                    location.href = '/#/red-' + this.page + "?id=" + cardId;
                } else {
                    this.sureElement.classList.add('are__you__in');
                    this.sureBgElement.classList.add('are__you__in');
                    cardId = btn[i].parentElement.parentElement.getAttribute('data-id');
                    categoryName = btn[i].previousElementSibling.previousElementSibling.innerText;
                }
            }
        }




        this.sureNo.onclick = () => {
            this.sureElement.classList.remove('are__you__in')
            this.sureBgElement.classList.remove('are__you__in')
            cardId = null;
        }


        this.sureYes.onclick = () => {
            CustomHttp.request(config.host + '/categories/' + this.page + '/' + cardId, 'DELETE');
            result.forEach(item => {
                if (item.category === categoryName) {
                    CustomHttp.request(config.host + '/operations/' + item.id, 'DELETE');
                }
            })

            location.href = '/#/' + this.page;

            this.sureElement.classList.remove('are__you__in')
            this.sureBgElement.classList.remove('are__you__in')
            cardId = null;
        }
    }

    creatCard() {
        this.cardAddElement.onclick = () => {
            location.href = '/#/create-' + this.page;
        }
    }
}