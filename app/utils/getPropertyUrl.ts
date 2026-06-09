import {DOMAIN_URL} from "~/constants";

export const getPropertyUrl = (slug: string) => {
  return `${DOMAIN_URL}/${slug}`
}
