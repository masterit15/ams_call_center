import { required, email, max, min } from "vee-validate/dist/rules";
import { extend } from "vee-validate";

extend("required", {
  ...required,
  message: "Это поле является обязательным"
});
extend('password', {
  params: ['target'],
  validate(value, { target }) {
    return value === target;
  },
  message: 'Подтверждение пароля не совпадает'
});

extend("max", {
  ...max,
  message: "Это поле должно содержать не более символов {length}"
});
extend("min", {
  ...min,
  message: "Это поле должно содержать более символов {length}"
});
// extend('min', {
//   validate: value => {
//     return value.length >= 8;
//   },
//  message: "Пароль должен не менее 8 символов"
// });
extend("email", {
  ...email,
  message: "Это поле должно быть действительным электронным адресом"
});
