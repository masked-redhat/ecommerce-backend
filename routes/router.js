import { LoginRouter } from "./login.js";
import { LogoutRouter } from "./logout.js";
import { SellerRouter } from "./seller.js";

const _routes = {
  login: LoginRouter,
  logout: LogoutRouter,
  seller: SellerRouter,
};

export default _routes;
