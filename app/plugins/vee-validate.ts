import { configure } from 'vee-validate'

export default defineNuxtPlugin(() => {
  configure({
    validateOnInput: false,
    validateOnBlur: true,
    validateOnChange: true,
    validateOnModelUpdate: false,
  })
})
