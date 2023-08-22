import {Auth} from "../services/auth.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../config/config.js";

export class Form {

    constructor(page) {
        this.rememberElement = null;
        this.processElement = null;
        this.page = page;

        Auth.logOut();

        this.fields = [
            {
                name: 'email',
                id: 'email',
                element: null,
                regex: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+$/,
                valid: false,
                textLog: '',
                textReg: 'Неправильно введен email'
            },
            {
                name: 'password',
                id: 'password',
                element: null,
                regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                valid: false,
                textLog: 'Неправильный email или пароль',
                textReg: 'Пароль должен содержать хотябы одну букву верхнего и нижнего регистра'
            }
        ];

        if (this.page === 'signup') {
            this.fields.unshift({
                    name: 'name',
                    id: 'name',
                    element: null,
                    regex: /[а-яА-Я]{2,}\s[а-яА-Я]{2,}/,
                    valid: false,
                    textReg: 'Имя и Фамилия должны быть введены на русском'
                },
                {
                    name: 'repeatPassword',
                    id: 'repeatPassword',
                    element: null,
                    regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                    valid: false,
                    textReg: 'Пароли не совпадают'
                })
        } else {
            this.rememberElement = document.getElementById('gridCheck');
        }

        const that = this;
        this.fields.forEach(item => {
            item.element = document.getElementById(item.id);
            item.element.onchange = function () {
                that.validateField.call(that, item, this);
                if (that.page === 'signup') {
                    that.checkPasswords();
                }
            }
        })
        this.processElement = document.getElementById('process');
        this.processElement.onclick = function () {
            that.processForm();
        }
    }

    validateField(field, element) {
        if (this.page === 'signup') {
            if (!element.value || !element.value.match(field.regex)) {
                element.classList.add('error-input');
                element.parentElement.nextElementSibling.innerText = field.textReg
                element.parentElement.nextElementSibling.style.display = 'block'
                field.valid = false;
            } else {
                element.classList.remove('error-input');
                element.parentElement.nextElementSibling.style.display = 'none'
                field.valid = true;
            }
        } else {
            if (!element.value || !element.value.match(field.regex)) {
                field.valid = false;
            } else {
                field.valid = true;
            }
        }
        this.validateForm();
    }

    checkPasswords() {
        const field1 = document.getElementById('password');
        const field2 = document.getElementById('repeatPassword');
        const repeatPasswordField = this.fields.find(item => item.name === 'repeatPassword');
        const passwordField = this.fields.find(item => item.name === 'password');

        if (field2.value && passwordField.valid) {
            if (field1.value !== field2.value) {
                field2.parentElement.nextElementSibling.innerText = repeatPasswordField.textReg
                field2.parentElement.nextElementSibling.style.display = 'block'
                field1.classList.add('error-input');
                field2.classList.add('error-input');
                repeatPasswordField.valid = false;
            } else {
                field2.parentElement.nextElementSibling.style.display = 'none'
                field1.classList.remove('error-input');
                field2.classList.remove('error-input');
                repeatPasswordField.valid = true;
            }
        } else {
            field2.classList.remove('error-input')
            field2.parentElement.nextElementSibling.style.display = 'none'
        }
        this.validateForm();
    }

    validateForm() {
        const validForm = this.fields.every(item => item.valid);
        if (validForm) {
            this.processElement.removeAttribute('disabled');
        } else {
            this.processElement.setAttribute('disabled', 'disabled');
        }
        return validForm;
    }

    async processForm() {
        if (this.validateForm()) {
            const email = this.fields.find(item => item.name === 'email').element.value;
            const password = this.fields.find(item => item.name === 'password').element.value;


            if (this.page === 'signup') {
                try {
                    const name = this.fields.find(item => item.name === 'name').element.value.split(' ')
                    const repeatPassword = this.fields.find(item => item.name === 'repeatPassword').element.value;
                    const result = await CustomHttp.request(config.host + '/signup', 'POST', {
                        name: name[0],
                        lastName: name[1],
                        email: email,
                        password: password,
                        passwordRepeat: repeatPassword
                    });

                    try {
                        const param = {
                            email: email,
                            password: password,
                        }

                        const result = await CustomHttp.request(config.host + '/login', 'POST', param);

                        if (result) {
                            if (result.error || !result.tokens.accessToken || !result.tokens.refreshToken || !result.user.name || !result.user.lastName || !result.user.id) {
                                throw new Error(result.message);
                            }

                            Auth.setTokens(result.tokens.accessToken, result.tokens.refreshToken)
                            Auth.setUserInfo({
                                name: result.user.name,
                                lastName: result.user.lastName,
                                userId: result.user.id
                            });
                            location.href = '/#/main'
                        }

                    } catch (error) {
                        console.log(error)
                    }
                } catch (error) {
                    return console.log(error)
                }
            } else {
                try {
                    const param = {
                        email: email,
                        password: password,
                        rememberMe: this.rememberElement.checked
                    }

                    const result = await CustomHttp.request(config.host + '/login', 'POST', param);


                    // Не работает-------------------------------------------
                    // const errorBlock = document.getElementById('not-found');
                    // const response = await fetch(config.host + '/login', param)
                    // console.log(response)
                    // if (response.status === 404) {
                    //     errorBlock.style.display = 'block';
                    //     errorBlock.innerText = 'Неверный email или пароль';
                    // } else {
                    //     errorBlock.style.display = 'none';
                    // }
                    // ------------------------------------------------------

                    if (result) {
                        if (result.error || !result.tokens.accessToken || !result.tokens.refreshToken || !result.user.name || !result.user.lastName || !result.user.id) {
                            throw new Error(result.message);
                        }

                        Auth.setTokens(result.tokens.accessToken, result.tokens.refreshToken)
                        Auth.setUserInfo({
                            name: result.user.name,
                            lastName: result.user.lastName,
                            userId: result.user.id
                        });
                        location.href = '/#/main'
                    }

                } catch (error) {
                    console.log(error)
                }
            }
        }
    }

}