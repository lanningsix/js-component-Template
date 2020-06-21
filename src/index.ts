import '../css/CommonLogin.css'
import CommonLoginSDK from './CommonLoginSDK'

let instance = new CommonLoginSDK();

if (!(window as any).CommonLoginSDK) {
  (window as any).CommonLoginSDK = instance
}

export default instance
