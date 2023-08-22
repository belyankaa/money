export class Period {

    readonly page: string | null;
    private buttons: HTMLCollection | null;
    private dataFrom: HTMLElement | null;
    private dataFromIn: HTMLElement | null;
    private acceptButton: HTMLElement | null;
    private valueFrom: string | null;
    private valueTo: string | null;
    private dataTo: HTMLElement | null;
    private dataToIn: HTMLElement | null;

    constructor(page: string | null) {
        this.page = page;
        this.buttons = document.getElementsByClassName('gray-btn');
        this.dataFrom = document.getElementById('dateFrom');
        this.dataFromIn = document.getElementById('dateFromIn');
        this.acceptButton = document.getElementById('accept');
        this.valueFrom = null;
        this.valueTo = null;
        this.dataTo = document.getElementById('dateTo');
        this.dataToIn = document.getElementById('dateToIn');

        this.periodButtons();
    }

    private sendInterval() {
        let href: string;
        if (this.page) {
            href = '/#/in-out-comes?period=interval';
        } else {
            href = '/#/main?period=interval';
        }
        location.href = href + '&dateFrom=' + this.valueFrom + '&dateTo=' + this.valueTo;
    }

    private clearActiveButton() {
        if (!this.buttons) {
            return;
        }
        for (let i = 0; i < this.buttons.length; i++) {
            this.buttons[i].classList.remove('active-gray');
        }
    }

    private periodButtons() {
        if (!this.acceptButton) {
            return;
        }
        this.acceptButton.onclick = () => {
            this.sendInterval();
        }

        if (!this.dataFrom) {
            return;
        }

        this.dataFrom.onclick = (): void => {
            if (!this.dataFromIn || !this.dataFromIn) {
                return;
            }
            this.dataFromIn.classList.add('show-inp');
            this.dataFromIn.click();
        }

        if (!this.dataFromIn) {
            return;
        }

        this.dataFromIn.onchange = (): void => {
            if (!this.buttons || !this.acceptButton || !this.dataFrom || !this.dataFromIn) {
                return;
            }
            this.clearActiveButton();
            this.buttons[5].classList.add('active-gray')
            this.acceptButton.display = 'block'
            this.acceptButton.classList.add('show');
            this.acceptButton.setAttribute('disabled', 'disabled');
            if (this.dataToIn.value && this.dataFromIn.value) {
                this.acceptButton.removeAttribute('disabled');
            } else {
                this.acceptButton.setAttribute('disabled', 'disabled');
            }

            this.dataFrom.innerText = this.dataFromIn.value
            this.dataFromIn.classList.remove('show-inp');
            this.valueFrom = this.dataFromIn.value.split('-')[0] + '.' + this.dataFromIn.value.split('-')[1] + '.' + this.dataFromIn.value.split('-')[2].split('T')[0];
        }

        if (!this.dataTo) {
            return;
        }

        this.dataTo.onclick = (): void => {
            this.dataToIn!.classList.add('show-inp');
        }

        this.dataToIn!.onchange = (): void => {
            this.clearActiveButton();
            this.buttons[5].classList.add('active-gray')
            this.acceptButton.display = 'block'
            this.acceptButton.classList.add('show');
            this.acceptButton.setAttribute('disabled', 'disabled');
            if (this.dataToIn.value && this.dataFromIn.value) {
                this.acceptButton.removeAttribute('disabled');
            } else {
                this.acceptButton.setAttribute('disabled', 'disabled');
            }
            this.dataTo.innerText = this.dataToIn.value
            this.dataToIn.classList.remove('show-inp');
            this.valueTo = this.dataToIn.value.split('-')[0] + '.' + this.dataToIn.value.split('-')[1] + '.' + this.dataToIn.value.split('-')[2].split('T')[0];
        }

        for (let i = 0; i < this.buttons.length; i++) {
            this.buttons[i].onclick = () => {
                let period = this.buttons[i].getAttribute('data-period');

                if (this.page) {
                    if (period === 'interval') {
                        this.clearActiveButton();
                        this.buttons[i].classList.add('active-gray')
                        this.acceptButton.classList.add('show');
                        this.acceptButton.setAttribute('disabled', 'disabled');
                    } else {
                        this.acceptButton.classList.remove('show');
                        location.href = '/#/in-out-comes?period=' + period;
                    }
                } else {
                    if (period === 'interval') {
                        this.clearActiveButton();
                        this.buttons[i].classList.add('active-gray')
                        this.acceptButton.display = 'block'
                        this.acceptButton.classList.add('show');
                        this.acceptButton.setAttribute('disabled', 'disabled');
                    } else {
                        this.acceptButton.classList.remove('show');
                        this.acceptButton.removeAttribute('disabled');
                        location.href = '/#/main?period=' + period;
                    }
                }
            }
        }
    }


}