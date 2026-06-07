import {PropertyPolicy} from "~/types";

export const policyOptions = [
  {
    value: PropertyPolicy.FLEXIBLE,
    label: 'Гнучка',
    description: 'Повернення коштів за 24 год до заїзду',
  },
  {
    value: PropertyPolicy.STRICT,
    label: 'Сувора',
    description: 'Кошти не повертаються після бронювання',
  },
]
