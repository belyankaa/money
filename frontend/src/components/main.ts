import {Chart} from 'chart.js/auto';
import {Sidebar} from "../functional/sidebar";
import {Period} from "../functional/period";
import {CustomHttp} from "../services/custom-http";
import config from "../config/config";
import {MainDataOper, MainDataType} from "../types/main-data.type";

export class Main {

    private buttonsPeriod: HTMLCollection | null;
    private period: string | null;
    private data: MainDataType;

    constructor() {
        this.buttonsPeriod = document.getElementsByClassName('gray-btn');
        this.period = location.href.split('period=')[1];

        this.data = {
            income: [],
            expense: []
        };

        this.charts();
        new Sidebar();
        new Period();
        this.buttons();
    }


    async charts() {
        const result = await CustomHttp.request(config.host + '/operations?period=' + this.period);


        let ctxP1 = document.getElementById("pieChartIn").getContext('2d');
        let myPieChart1 = new Chart(ctxP1, {
            type: 'pie',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: ["#F7464A", "#46BFBD", "#FDB45C", "#949FB1", "#4D5360"],
                    hoverBackgroundColor: ["#FF5A5E", "#5AD3D1", "#FFC870", "#A8B3C5", "#616774"]
                }]
            },
            options: {
                responsive: true
            }
        });

        let ctxP2 = document.getElementById("pieChartOut").getContext('2d');
        let myPieChart2 = new Chart(ctxP2, {
            type: 'pie',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: ["#F7464A", "#46BFBD", "#FDB45C", "#949FB1", "#4D5360"],
                    hoverBackgroundColor: ["#FF5A5E", "#5AD3D1", "#FFC870", "#A8B3C5", "#616774"]
                }]
            },
            options: {
                responsive: true
            },
        });

        result.forEach(item => {
            if (item.type === 'income') {
                const index = this.data.income.findIndex(incomeItem => incomeItem.category === item.category)

                if (index !== -1) {
                    this.data.income[index].amount += item.amount
                } else {
                    this.data.income.push({
                        category: item.category,
                        amount: item.amount
                    })
                }
            } else {
                const index: number = this.data.expense.findIndex((expenseItem: MainDataOper) => expenseItem.category === item.category)

                if (index !== -1) {
                    this.data.expense[index].amount += item.amount
                } else {
                    this.data.expense.push({
                        category: item.category,
                        amount: item.amount
                    })
                }
            }
        })

        if (this.data.income) {
            this.data.income.forEach(item => {
                this.addData(myPieChart1, item.category, item.amount)
            })
        }

        if (this.data.expense) {
            this.data.expense.forEach(item => {
                this.addData(myPieChart2, item.category, item.amount)
            })
        }

    }

    private addData(chart, label: string, newData: number): void {
        chart.data.labels.push(label);
        chart.data.datasets.forEach((dataset) => {
            dataset.data.push(newData);
        });
        chart.update();
    }

    private buttons(): void {
        let hasClass = false;
        if (this.period) {
            let checkHref = this.period.split('&date')[0];
            if (checkHref) {
                this.period = checkHref;
            }
        }
        if (!this.buttonsPeriod) {
            return;
        }
        for (let i = 0; i < this.buttonsPeriod.length; i++) {
            if (this.buttonsPeriod[i].getAttribute('data-period') === this.period) {
                this.buttonsPeriod[i].classList.add('active-gray');
                hasClass = true;
            }
        }
        if (!hasClass) {
            this.buttonsPeriod[0].classList.add('active-gray');
        }
    }
}