import { toast as t } from "react-toastify"

export function toast(status: number, message?: string) {
   if (!message || message == "") return

   if (status >= 100 && status < 199) {
      return t(message, {
         type: "info",
      })
   } else if (status >= 200 && status < 299) {
      return t(message, {
         type: "success"
      })
   } else if (status >= 400 && status < 499) {
      return t(message, {
         type: "warning"
      })
   } else if (status >= 500 && status < 599) {
      return t(message, {
         type: "error"
      })
   }
}