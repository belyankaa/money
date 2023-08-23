export class Period {

    readonly page: string | null;
    readonly buttons: HTMLCollection | null;
    readonly dataFrom: HTMLElement | null;
    readonly dataFromIn: HTMLElement | null;
    readonly acceptButton: HTMLElement | null;
    private valueFrom: string | null;
    private valueTo: string | null;
    readonly dataTo: HTMLElement | null;
    readonly dataToIn: HTMLInputElement | null;

    constructor(page: string | null) {
        this.page = page;
        this.buttons = document.getElementsByClassName('gray-btn');
        this.dataFrom = document.getElementById('dateFrom');
        this.dataFromIn = document.getElementById('dateFromIn');
        this.acceptButton = document.getElementById('accept');
        this.valueFrom = null;
        this.valueTo = null;
        this.dataTo = document.getElementById('dateTo');
        this.dataToIn = document.getElementById('dateToIn') as HTMLInputElement;

        this.periodButtons();
    }

    private sendInterval(): void {
        let href: string;
        if (this.page) {
            href = '/#/in-out-comes?period=interval';
        } else {
            href = '/#/main?period=interval';
        }
        location.href = href + '&dateFrom=' + this.valueFrom + '&dateTo=' + this.valueTo;
    }

    private clearActiveButton(): void {
        if (!this.buttons) {
            return;
        }
        for (let i = 0; i < this.buttons.length; i++) {
            this.buttons[i].classList.remove('active-gray');
        }
    }

    private periodButtons(): void {
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
            (this.buttons[5] as HTMLElement).classList.add('active-gray');
            // @ts-ignore
            (this.acceptButton as HTMLElement).display = 'block';
            this.acceptButton.classList.add('show');
            this.acceptButton.setAttribute('disabled', 'disabled');
            if ((this.dataToIn as HTMLInputElement).value && (this.dataFromIn as HTMLInputElement).value) {
                this.acceptButton.removeAttribute('disabled');
            } else {
                this.acceptButton.setAttribute('disabled', 'disabled');
            }

            this.dataFrom.innerText = (this.dataFromIn as HTMLInputElement).value
            this.dataFromIn.classList.remove('show-inp');
            this.valueFrom = (this.dataFromIn as HTMLInputElement).value.split('-')[0] + '.' + (this.dataFromIn as HTMLInputElement).value.split('-')[1] + '.' + (this.dataFromIn as HTMLInputElement).value.split('-')[2].split('T')[0];
        }

        if (!this.dataTo) {
            return;
        }

        this.dataTo.onclick = (): void => {
            this.dataToIn!.classList.add('show-inp');
        }

        this.dataToIn!.onchange = (): void => {
            this.clearActiveButton();
            if (!this.buttons || !this.acceptButton) {
                return;
            }
            (this.buttons[5] as HTMLElement).classList.add('active-gray');
            // @ts-ignore
            (this.acceptButton as HTMLElement).display = 'block';
            this.acceptButton.classList.add('show');
            this.acceptButton.setAttribute('disabled', 'disabled');
            if (this.dataToIn && this.dataFromIn && this.dataToIn.value && (this.dataFromIn as HTMLInputElement).value) {
                this.acceptButton.removeAttribute('disabled');
            } else {
                this.acceptButton.setAttribute('disabled', 'disabled');
            }
            if (this.dataToIn && this.dataFromIn && this.dataTo) {
                this.dataTo.innerText = this.dataToIn.value
                this.dataToIn.classList.remove('show-inp');
                this.valueTo = this.dataToIn.value.split('-')[0] + '.' + this.dataToIn.value.split('-')[1] + '.' + this.dataToIn.value.split('-')[2].split('T')[0];
            }
        }

        for (let i: number = 0; i < this.buttons!.length; i++) {
            (this.buttons![i] as HTMLElement).onclick = (): void => {
                let period = this.buttons![i].getAttribute('data-period');

                if (this.page) {
                    if (period === 'interval') {
                        this.clearActiveButton();
                        this.buttons![i].classList.add('active-gray')
                        this.acceptButton!.classList.add('show');
                        this.acceptButton!.setAttribute('disabled', 'disabled');
                    } else {
                        this.acceptButton!.classList.remove('show');
                        location.href = '/#/in-out-comes?period=' + period;
                    }
                } else {
                    if (period === 'interval') {
                        this.clearActiveButton();
                        this.buttons![i].classList.add('active-gray');
                        // @ts-ignore
                        (this.acceptButton as HTMLElement).display = 'block';
                        this.acceptButton!.classList.add('show');
                        this.acceptButton!.setAttribute('disabled', 'disabled');
                    } else {
                        this.acceptButton!.classList.remove('show');
                        this.acceptButton!.removeAttribute('disabled');
                        location.href = '/#/main?period=' + period;
                    }
                }
            }
        }
    }


}