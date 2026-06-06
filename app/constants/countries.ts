export type CountryPhone = {
  icon: string
  value: string
  dialCode: string
  label: string
  maskLength: number
}

import uaFlag from '~/assets/icons/flags/ukraine.png'

export const countriesPhone: CountryPhone[] = [
  {
    icon: uaFlag,
    value: 'ua',
    dialCode: '+380',
    label: 'Україна',
    maskLength: 9,
  },
]
