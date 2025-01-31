import { LoginRouter } from "./login.js";
import { LogoutRouter } from "./logout.js";
import { ProductRouter } from "./product.js";
import { SellerRouter } from "./seller.js";

const _routes = {
  login: LoginRouter,
  logout: LogoutRouter,
  seller: SellerRouter,
  product: ProductRouter,
};

export default _routes;
